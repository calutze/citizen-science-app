# form routes

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.projects import Project
from app.models.forms import FormTemplate, FormField


form = Blueprint('form', __name__)


@form.route('/forms', methods=['GET'])
@login_required
def show_project_forms():
    """ Gets all forms for projects owned by the current user. """
    projects = Project.query.filter_by(created_by=current_user.user_id).all()
    forms = []

    for project in projects:
        project_forms = FormTemplate.query.filter_by(project=project.project_id).all()
        forms.extend([form.to_dict() for form in project_forms])

    return jsonify(forms), 200


@form.route('/form', methods=['POST'])
@login_required
def add_form():
    """ Creates a new form template and associated fields. """

    data = request.get_json()

    project_id = data.get('project_id')
    description = data.get('description')
    fields_data = data.get('fields', [])

    # validate project ownership
    project = db.session.get(Project, project_id)

    if not project or project.created_by != current_user.user_id:
        return jsonify({'error': 'Invalid project or unauthorized access'}), 403

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

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@form.route('/form/<int:form_id>', methods=['GET'])
@login_required
def get_form(form_id):
    """ Retrieves form template details by form_id, including associated fields. """

    form_template = db.session.get(FormTemplate, form_id)

    if not form_template:
        return jsonify({'error': 'Form Template not found'}), 404

    # validate current user with project associated with form
    project = db.session.get(Project, form_template.project)

    if project.created_by != current_user.user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    return jsonify(form_template.to_dict()), 200


@form.route('/form/<int:form_id>', methods=['PUT'])
@login_required
def update_form(form_id):
    """ Updates form template details and associated fields. """

    form_template = db.session.get(FormTemplate, form_id)

    if not form_template:
        return jsonify({'error': 'Form Template not found'}), 404

    project = db.session.get(Project, form_template.project)

    if project.created_by != current_user.user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

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

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@form.route('/form/<int:form_id>', methods=['DELETE'])
@login_required
def delete_form(form_id):
    """ Deletes a form template by form_id. """

    form_template = db.session.get(FormTemplate, form_id)

    if not form_template:
        return jsonify({'error': 'Form Template not found'}), 404

    project = db.session.get(Project, form_template.project)

    if project.created_by != current_user.user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        db.session.delete(form_template)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Form deleted'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
