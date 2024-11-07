# observation routes

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.projects import Project
from app.models.observations import Observation, ObservationValue


observation = Blueprint('observation', __name__)


# TODO: revisit this function, create tests
@observation.route('/observations')
@login_required
def show_project_observations():
    """ Gets all projects for current admin user. """

    projects = Project.query.filter_by(created_by=current_user.user_id).all()
    return jsonify(projects), 200


@observation.route('/add-observation', methods=['POST'])
def add_observation():
    """ Creates new observation and saves it to the database. """

    data = request.get_json()

    project_id = data.get('project_id')
    student_identifier = data.get('student_identifier')
    image_url = data.get('image_url')
    observation_values_data = data.get('observation_values', [])

    # validate project
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({'error': 'Invalid project'}), 403

    # create observation
    observation = Observation(
        project=project_id,
        student_identifier=student_identifier,
        image_url=image_url
    )

    try:
        db.session.add(observation)
        db.session.flush()  # gets observation ID before committing

        # add associated observation values
        for value_data in observation_values_data:
            observation_value = ObservationValue(
                value=value_data.get('value'),
                observation=observation.observation_id,
                field=value_data.get('field')
            )
            db.session.add(observation_value)

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Observation added',
            'observation': observation.to_dict()
            }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@observation.route('/observation/<int:observation_id>', methods=['GET'])
def get_observation(observation_id):
    """ Retrieves observation details by observation_id. """

    observation = db.session.get(Observation, observation_id)

    if not observation:
        return jsonify({'error': 'Observation not found'}), 404

    project = db.session.get(Observation, observation.project)

    if not project:
        return jsonify({'error': 'Project not found'}), 403

    return jsonify(observation.to_dict()), 200


@observation.route('/observation/<int:observation_id>', methods=['PUT'])
def update_observation(observation_id):
    """ Updates observation details by observation_id. """

    observation = db.session.get(Observation, observation_id)

    if not observation:
        return jsonify({'error': 'Observation not found'}), 404

    project = db.session.get(Observation, observation.project)

    if not project:
        return jsonify({'error': 'Project not found'}), 403

    data = request.get_json()
    observation.student_identifier = data.get('student_identifier', observation.student_identifier)
    observation.image_url = data.get('image_url', observation.image_url)

    # update observation values if provided
    observation_values_data = data.get('observation_values', [])

    for value_data in observation_values_data:
        obs_value = db.session.get(ObservationValue, value_data.get('observation_value_id'))

        if obs_value:
            obs_value.value = value_data.get('value', obs_value.value)
            obs_value.field = value_data.get('field', obs_value.field)

    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Observation updated',
            'observation': observation.to_dict()
            }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@observation.route('/observation/<int:observation_id>', methods=['DELETE'])
def delete_observation(observation_id):
    """ Deletes an observation by observation_id. """

    observation = db.session.get(Observation, observation_id)

    if not observation:
        return jsonify({'error': 'Observation not found'}), 404

    project = db.session.get(Observation, observation.project)

    if not project:
        return jsonify({'error': 'Project not found'}), 403

    try:
        db.session.delete(observation)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Observation deleted'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
