"""
Defines routes for managing observations within a project, allowing users
to view, add, update, and delete observations linked to a specific project. 
Observations include details such as student identifiers, images,
and associated observation values.

Each route returns JSON responses and includes error handling.
"""

from flask import Blueprint, request, jsonify, abort, session
from app import db
from app.models.projects import Project
from app.models.forms import FormField
from app.models.observations import Observation, ObservationValue
from app.services.validation import validate_observation
from flask_login import login_required, current_user

observation = Blueprint('observation', __name__)


@observation.route('/show-observations/<int:project_id>', methods=['GET'])
def show_observations(project_id):
    """ Returns JSON response with observations for the given project_id """

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    observations = Observation.query.filter_by(project=project_id).all()
    observations_data = [
        {
            **obs.to_dict(),
            'values': [val.to_dict() for val in obs.observation_values]
        } for obs in observations
    ]

    response_data = {
        'project': project.to_dict(),
        'observations': observations_data
    }

    return jsonify(response_data), 200


@observation.route('/add-observation', methods=['POST'])
def add_observation():
    """ Creates new observation and saves it to the database. """
    data = request.get_json()
    project_id = data.get('project_id')
    student_identifier = data.get('student_identifier')
    image_url = data.get('image_url')
    observation_values_data = data.get('observation_values', [])

    # checks for valid project
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    # create observation
    obs = Observation(
        project=project_id,
        student_identifier=student_identifier,
        image_url=image_url
    )

    try:
        db.session.add(obs)
        db.session.flush()  # gets observation ID before committing

        # add observation values
        for value_data in observation_values_data:
            field_id = value_data.get('field')

            if not FormField.query.get(field_id):
                return jsonify({'error': f'Field ID {field_id} does not exist'}), 400

            observation_value = ObservationValue(
                value=value_data.get('value'),
                observation=obs.observation_id,
                field=field_id
            )
            db.session.add(observation_value)

        db.session.commit()
        return jsonify({'success': True, 'message': 'Observation added', 'observation': obs.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        abort(500, description=f"Error adding observation: {str(e)}")


@observation.route('/observation/<int:observation_id>', methods=['GET'])
def get_observation(observation_id):
    """ Retrieves observation details by observation_id. """
    obs = validate_observation(observation_id)
    return jsonify(obs.to_dict()), 200


@observation.route('/update-observation/<int:observation_id>', methods=['PUT'])
def update_observation(observation_id):
    """ Updates observation details by observation_id. """
    obs = validate_observation(observation_id)
    data = request.get_json()

    obs.student_identifier = data.get('student_identifier', obs.student_identifier)
    obs.image_url = data.get('image_url', obs.image_url)

    # update observation values if provided
    observation_values_data = data.get('observation_values', [])
    for value_data in observation_values_data:
        obs_value = db.session.get(ObservationValue, value_data.get('observation_value_id'))
        if obs_value:
            obs_value.value = value_data.get('value', obs_value.value)
            obs_value.field = value_data.get('field', obs_value.field)

    try:
        db.session.commit()
        return jsonify({'success': True, 'message': 'Observation updated', 'observation': obs.to_dict()}), 200

    except Exception:
        db.session.rollback()
        abort(500, description="Internal server error while updating observation.")


@observation.route('/delete-observation/<int:observation_id>', methods=['DELETE'])
def delete_observation(observation_id):
    """ Deletes an observation by observation_id. """
    obs = validate_observation(observation_id)

    try:
        db.session.delete(obs)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Observation deleted'}), 200

    except Exception:
        db.session.rollback()
        abort(500, description="Internal server error while deleting observation.")


@observation.route('/user-projects-with-observations', methods=['GET'])
@login_required
def get_projects_with_observations():
    """ Gets all projects for the current user and their associated observations. """
    try:

        projects = Project.query.filter_by(created_by=current_user.user_id).all()

        # creates response with projects and associated observations
        projects_with_observations = []
        for project in projects:
            observations = Observation.query.filter_by(project=project.project_id).all()
            observations_data = [
                {
                    **obs.to_dict(),
                    'values': [val.to_dict() for val in obs.observation_values]
                } for obs in observations
            ]

            project_data = project.to_dict()
            project_data['observations'] = observations_data
            projects_with_observations.append(project_data)

        return jsonify({'success': True, 'projects': projects_with_observations}), 200

    except Exception as e:
        print(f"Error fetching projects with observations: {e}")
        return jsonify({'error': 'An error occurred while fetching projects and observations.'}), 500
