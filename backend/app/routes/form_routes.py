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
from app.models.observations import Observation, ObservationValue
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
        form_id=project_id,
        description=description,
        created_by=current_user.user_id
    )

    try:
        db.session.add(form_template)

        # add associated fields
        for field_data in fields_data:
            form_field = FormField(
                field_title=field_data.get('field_title'),
                field_type=field_data.get('field_type'),
                field_description=field_data.get('field_description'),
                field_options=field_data.get('field_options'),
                field_order=field_data.get('field_order'),
                is_required=field_data.get('is_required'),
                form=project_id
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
    validate_project_ownership(form_template.project.project_id)

    data = request.get_json()
    form_template.description = data.get('description', form_template.description)

    # handle fields
    field_ids_in_request = update_existing_fields(form_template, data.get('fields', []))
    add_new_fields(form_template, data.get('fields', []), field_ids_in_request)

    # mark fields inactive
    for field in form_template.form_fields:
        if field.field_id not in field_ids_in_request:
            field.is_active = False

    # add placeholder values for existing observations
    add_placeholder_values(form_template)

    # commit changes
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


def update_existing_fields(form_template, fields_data):
    """ Updates existing fields in the form. """
    field_ids_in_request = []       # tracks field_id from request

    for field_data in fields_data:
        field_id = field_data.get('field_id')

        if field_id:
            form_field = db.session.get(FormField, field_id)

            if form_field:
                form_field.field_title = field_data.get('field_title', form_field.field_title)
                form_field.field_type = field_data.get('field_type', form_field.field_type)
                form_field.field_description = field_data.get('field_description', form_field.field_description)
                form_field.field_options = field_data.get('field_options', form_field.field_options)
                form_field.field_order = field_data.get('field_order', form_field.field_order)
                form_field.is_required = field_data.get('is_required', form_field.is_required)
                form_field.is_active = True

                field_ids_in_request.append(field_id)

    return field_ids_in_request


def add_new_fields(form_template, field_data, field_ids_in_request):
    """ Adds new fields to the form. """
    # validate field data
    for field in field_data:
        if not all(key in field for key in ['field_title', 'field_type']):
            abort(400, description="Field data is missing required keys.")

        if not field.get('field_id'):  # check for new fields
            new_field = FormField(
                field_title=field.get('field_title'),
                field_type=field.get('field_type'),
                field_description=field.get('field_description'),
                field_options=field.get('field_options'),
                field_order=field.get('field_order'),
                is_required=field.get('is_required'),
                form=form_template.form_id
            )

            try:
                db.session.add(new_field)
                db.session.flush()   # gets field_id
                field_ids_in_request.append(new_field.field_id)
            except Exception as e:
                abort(500, description=f"Error adding new field: {str(e)}")


def add_placeholder_values(form_template):
    """ Adds placeholder observation values for new fields
        in existing observations. """
    active_fields = [field.field_id for field in form_template.form_fields if field.is_active]
    observations = Observation.query.filter_by(project=form_template.project.project_id).all()

    for observation in observations:
        existing_values = {ov.field for ov in observation.observation_values}
        for field_id in active_fields:
            if field_id not in existing_values:
                placeholder_value = ObservationValue(
                    value=None,
                    observation=observation.observation_id,
                    field=field_id
                )
                db.session.add(placeholder_value)


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
