# field app routes

from flask import Blueprint, request, session, jsonify
from app.models.projects import Project
from app.models.observations import Observation

from flask import render_template,  url_for, redirect


field_app = Blueprint('field_app', __name__)


@field_app.route('/enter-code')
def enter_code_entry():
    return render_template('enter_code.html')


@field_app.route('/enter-code', methods=['GET', 'POST'])
def enter_code():
    """ Gets project associated with project code,
        sets session, and redirects to show observations. """

    code = request.form.get('code')
    project = Project.query.filter_by(project_code=code).first()

    if not project:
        return jsonify({"error": "Invalid code"}), 401

    # store project_id in the session
    session.permanent = True
    session['project_id'] = project.project_id

    # redirect to show observations
    return redirect(url_for('field_app.show_observations'))


@field_app.route('/show-observations')
def show_observations():
    """ Displays observations for the project stored in session."""

    project_id = session.get('project_id')

    if not project_id:
        # redirect home if no active session or project ID
        return 'No session Found'

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    observations = Observation.query.filter_by(project=project_id).all()
    response_data = {
        'project': project.to_dict(),
        'observations': [
            {
                **obs.to_dict(),
                'values': [val.to_dict() for val in obs.observation_values]
            } for obs in observations
        ]
    }

    return render_template('project_observations.html', data=response_data)


# test route TODO delete
@field_app.route('/check-session')
def check_session():
    project_id = session.get('project_id')
    if project_id:
        return f"Session is active. Project ID: {project_id}"
    else:
        return "No active session or project ID not found in session."


@field_app.route('/clear-session')
def clear_session():
    session.clear()
    return redirect(url_for('home'))
