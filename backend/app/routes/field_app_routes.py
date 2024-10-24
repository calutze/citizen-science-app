# field app routes

# in progress, not yet testing

from flask import Blueprint, request, session, jsonify
from app.models import Projects

field_app = Blueprint('field_app', __name__)


@field_app.route('/enter_code', methods=['POST'])
def enter_code():
    """ Gets project associated with FE code, creates persistant session. """

    # gets request from FE
    code = request.json.get('code')

    # query to get project with code
    project = Projects.query.filter_by(project_code=code).first()

    if not project:
        return jsonify({"error": "Invalid code"}), 401

    # store project_id in the session
    session.permanent = True
    session['project_id'] = project.project_id      # 'project_id' vs 'id' ?
    return project
