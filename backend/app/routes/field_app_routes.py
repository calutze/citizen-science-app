"""
Defines routes for interacting with project sessions in the field
app, where users can enter project codes, check for active sessions,
and clear existing sessions. These routes are primarily
used by field users to retrieve observations and interact with
project data without login requirements.
"""


from flask import Blueprint, request, session, jsonify
from app.models.projects import Project


field_app = Blueprint('field_app', __name__)


@field_app.route('/enter-code', methods=['POST'])
def enter_code():
    """ Gets project associated with project code,
        sets session, returns the project_id. """

    code = request.json.get('code')
    project = Project.query.filter_by(project_code=code).first()

    if not project:
        return jsonify({"error": "Invalid code"}), 401

    # store project_id in the session
    session.permanent = True
    session['project_id'] = project.project_id

    return jsonify({"success": True, "message": "Project code accepted", "project_id": project.project_id})


@field_app.route('/check-session', methods=['GET'])
def check_session():
    """ Checks if there is an active project session and returns project ID. """
    project_id = session.get('project_id')

    if not project_id:
        return jsonify({"session_active": False, "message": "No active session"}), 200

    return jsonify({"session_active": True, "project_id": project_id}), 200


@field_app.route('/clear-session', methods=['GET'])
def clear_session():
    """ Clears the current session and returns a JSON confirmation. """
    session.clear()

    return jsonify({"success": True, "message": "Session cleared"}), 200
