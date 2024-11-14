"""
Project routes for the admin site, allowing authenticated users
to create, retrieve, update, and delete their projects.

Each route returns JSON responses, includes error handling to maintain
consistent messaging, and provides feedback on success
or failure of operations.
"""

from flask import Blueprint, request, jsonify, abort
from flask_login import login_required, current_user
from app import db
from app.models.projects import Project

from app.services.validation import validate_with_user


project = Blueprint('project', __name__)


@project.route('/user-projects')
@login_required
def show_user_projects():
    """ Gets all projects for current user. """
    projects = Project.query.filter_by(created_by=current_user.user_id).all()
    project_dicts = [proj.to_dict() for proj in projects]
    return jsonify(project_dicts), 200


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

    # create and add the project
    proj = Project(
        project_code=project_code,
        title=title,
        description=description,
        instructions=instructions,
        created_by=created_by
    )

    try:
        db.session.add(proj)
        db.session.commit()
        return jsonify({'success': True, 'project': proj.to_dict()}), 201

    except Exception:
        db.session.rollback()
        abort(500)


@project.route('/project/<int:project_id>', methods=['GET'])
@login_required
def get_project(project_id):
    """ Retrieves project details by project_id. """
    proj = db.session.get(Project, project_id)

    # validate project access
    result = validate_with_user(proj)
    if not result:
        abort(404)

    return jsonify({'success': True, 'project': proj.to_dict()}), 200


@project.route('/update-project/<int:project_id>', methods=['PUT'])
@login_required
def update_project(project_id):
    """ Updates project details by project_id. """
    proj = db.session.get(Project, project_id)

    # validate project access
    result = validate_with_user(proj)
    if not result:
        abort(404)

    data = request.get_json()
    proj.project_code = data.get('project_code', proj.project_code)
    proj.title = data.get('title', proj.title)
    proj.description = data.get('description', proj.description)
    proj.instructions = data.get('instructions', proj.instructions)

    try:
        db.session.commit()
        return jsonify({'success': True, 'message': 'Project updated'}), 200

    except Exception:
        db.session.rollback()
        abort(500)


@project.route('/delete-project/<int:project_id>', methods=['DELETE'])
@login_required
def delete_project(project_id):
    """ Deletes a project by project_id. """
    proj = db.session.get(Project, project_id)

    # validate project access
    result = validate_with_user(proj)
    if not result:
        abort(404)

    try:
        db.session.delete(proj)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Project deleted'}), 200

    except Exception:
        db.session.rollback()
        abort(500)
