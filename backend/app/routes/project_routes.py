# project routes for admin site

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.projects import Project


project = Blueprint('project', __name__)


# TODO: Work out get_project to remove duplicate code in other functions.

@project.route('/user-projects')
@login_required
def show_user_projects():
    """ Gets all projects for current user. """

    projects = Project.query.filter_by(created_by=current_user.user_id).all()
    return jsonify(projects), 200


@project.route('/add-project', methods=['POST'])
@login_required
def add_project():
    """ Creates a new project and saves to the database. """

    data = request.get_json()
    project_code = data.get('project_code')
    title = data.get('title')
    description = data.get('description')
    instructions = data.get('instructions')
    created_by = current_user.user_id

    project = Project(
        project_code=project_code,
        title=title,
        description=description,
        instructions=instructions,
        created_by=created_by
    )

    try:
        db.session.add(project)
        db.session.commit()
        return jsonify({'success': True, 'project': project.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@project.route('/project/<int:project_id>', methods=['GET'])
@login_required
def get_project(project_id):
    """ Retrieves project details by project_id. """

    project = db.session.get(Project, project_id)

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    if project.created_by != current_user.user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    project_info = {
        'project_id': project.project_id,
        'created_at': project.created_at,
        'project_code': project.project_code,
        'title': project.title,
        'description': project.description,
        'instructions': project.instructions,
        'created_by': project.created_by
    }

    return jsonify({'success': True, 'project': project_info}), 200


@project.route('/project/<int:project_id>', methods=['PUT'])
@login_required
def update_project(project_id):
    """ Updates project details by project_id. """

    project = db.session.get(Project, project_id)

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    if project.created_by != current_user.user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()
    project.project_code = data.get('project_code', project.project_code)
    project.title = data.get('title', project.title)
    project.description = data.get('description', project.description)
    project.instructions = data.get('instructions', project.instructions)

    try:
        db.session.commit()
        return jsonify({'success': True, 'message': 'Project updated'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@project.route('/project/<int:project_id>', methods=['DELETE'])
@login_required
def delete_project(project_id):
    """ Deletes a project by project_id. """

    project = db.session.get(Project, project_id)

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    if project.created_by != current_user.user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        db.session.delete(project)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Project deleted'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
