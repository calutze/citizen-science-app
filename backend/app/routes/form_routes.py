"""
Defines routes for creating, retrieving, updating, and deleting
custom form templates and their associated fields.
Each form is linked to a specific project owned by the current user.

Each route returns JSON responses and includes error handling.
"""


from flask import Blueprint, request, jsonify, abort
from flask_login import login_required, current_user
from app import db
from app.models.projects import Project
from app.models.forms import FormTemplate, FormField
from app.services.validation import validate_project_ownership, validate_form_template

form = Blueprint('form', __name__)


@form.route('/forms', methods=['GET'])
@login_required
def show_project_forms():
    """ Gets all forms for projects owned by the current user. """
    project_ids = [project.project_id for project in Project.query.filter_by(created_by=current_user.user_id).all()]
    forms = FormTemplate.query.filter(FormTemplate.project.in_(project_ids)).all()

    return jsonify([form.to_dict() for form in forms]), 200


@form.route('/add-form', methods=['POST'])
@login_required
def add_form():
    """ Creates a new form template and associated fields. """
    data = request.get_json()
    project_id = data.get('project_id')
    description = data.get('description')
    fields_data = data.get('fields', [])

    validate_project_ownership(project_id)

    # create form template
    form_template = FormTemplate(
        project=project_id,
        description=description,
        created_by=current_user.user_id
    )

    try:
        db.session.add(form_template)
        db.session.flush()  # get form_id before committing

        # add associated fields
        for field_data in fields_data:
            form_field = FormField(
                field_title=field_data.get('field_title'),
                field_type=field_data.get('field_type'),
                field_description=field_data.get('field_description'),
                field_options=field_data.get('field_options'),
                field_order=field_data.get('field_order'),
                is_required=field_data.get('is_required'),
                form=form_template.form_id
            )
            db.session.add(form_field)

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Form and fields added',
            'form': form_template.to_dict()
        }), 201

    except Exception:
        db.session.rollback()
        abort(500, description="Internal server error while adding form.")


@form.route('/form/<int:form_id>', methods=['GET'])
def get_form(form_id):
    """ Retrieves form template details by form_id, and associated fields. """
    form_template = validate_form_template(form_id)

    return jsonify(form_template.to_dict()), 200


@form.route('/update-form/<int:form_id>', methods=['PUT'])
@login_required
def update_form(form_id):
    """ Updates form template details and associated fields. """

    form_template = validate_form_template(form_id)
    validate_project_ownership(form_template.project)

    data = request.get_json()
    form_template.description = data.get('description', form_template.description)

    # update fields if provided
    fields_data = data.get('fields', [])
    for field_data in fields_data:
        field_id = field_data.get('field_id')
        form_field = db.session.get(FormField, field_id)

        if form_field:
            form_field.field_title = field_data.get('field_title', form_field.field_title)
            form_field.field_type = field_data.get('field_type', form_field.field_type)
            form_field.field_description = field_data.get('field_description', form_field.field_description)
            form_field.field_options = field_data.get('field_options', form_field.field_options)
            form_field.field_order = field_data.get('field_order', form_field.field_order)
            form_field.is_required = field_data.get('is_required', form_field.is_required)

    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Form and fields updated',
            'form': form_template.to_dict()
        }), 200

    except Exception:
        db.session.rollback()
        abort(500, description="Internal server error while updating form.")


@form.route('/delete-form/<int:form_id>', methods=['DELETE'])
@login_required
def delete_form(form_id):
    """ Deletes a form template by form_id. """
    form_template = validate_form_template(form_id)
    validate_project_ownership(form_template.project)

    try:
        db.session.delete(form_template)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Form deleted'}), 200

    except Exception:
        db.session.rollback()
        abort(500, description="Internal server error while deleting form.")
