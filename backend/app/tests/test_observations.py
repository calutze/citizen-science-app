# Unit Tests created with ChatGPT assistance.

from .helpers.helper_functions import register_and_login, create_test_project, add_test_observation


def test_add_observation(test_client):
    register_and_login(test_client)
    project = create_test_project(test_client)
    project_id = project['project']['project_id']

    observation_data = {
        'project_id': project_id,
        'student_identifier': 'student001',
        'image_url': 'http://example.com/image.jpg',
        'observation_values': [
            {'value': 'Test Value', 'field': 1}
        ]
    }

    # add observation
    response = test_client.post('/add-observation', json=observation_data)
    assert response.status_code == 201
    assert response.json['success'] is True

    # get observation
    observation_id = response.json['observation']['observation_id']
    response = test_client.get(f"/observation/{observation_id}")
    assert response.status_code == 200


def test_update_observation(test_client):
    register_and_login(test_client)
    project = create_test_project(test_client)
    project_id = project['project']['project_id']

    observation = add_test_observation(test_client, project_id)
    observation_id = observation['observation_id']

    updated_data = {
        'student_identifier': 'updated_student001',
        'image_url': 'http://example.com/updated_image.jpg',
        'observation_values': [
            {'observation_value_id': observation['observation_values'][0]['observation_value_id'],
             'value': 'Updated Test Value', 'field': 2}
        ]
    }

    response = test_client.put(f"/observation/{observation_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json['success'] is True

    response = test_client.get(f"/observation/{observation_id}")
    assert response.status_code == 200
    updated_observation = response.json

    # validate updated fields
    assert updated_observation['student_identifier'] == updated_data['student_identifier']
    assert updated_observation['image_url'] == updated_data['image_url']
    assert updated_observation['observation_values'][0]['value'] == updated_data['observation_values'][0]['value']
    assert updated_observation['observation_values'][0]['field'] == updated_data['observation_values'][0]['field']


def test_delete_observation(test_client):
    register_and_login(test_client)
    project = create_test_project(test_client)
    project_id = project['project']['project_id']

    observation = add_test_observation(test_client, project_id)
    observation_id = observation['observation_id']

    response = test_client.delete(f"/observation/{observation_id}")
    assert response.status_code == 200
    assert response.json['success'] is True
