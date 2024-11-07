from .helpers.helper_functions import register_and_login, create_test_project


def test_add_project(test_client):
    register_and_login(test_client)

    # create project
    response = test_client.post('/add-project', json={
        'project_code': 'P123',
        'title': 'Test Project',
        'description': 'A test project description',
        'instructions': 'Test instructions'
    })

    assert response.status_code == 201

    # get project
    response = test_client.get('/project/1')

    assert response.status_code == 200
    assert response.json['success'] is True


def test_update_project(test_client):
    register_and_login(test_client)
    project = create_test_project(test_client)

    updated_data = {
        'project_code': 'P0987',
        'title': 'Updated Project Title',
        'description': 'Updated description for the test project',
        'instructions': 'Updated instructions'
    }

    response = test_client.put(f"/project/{project['project']['project_id']}", json=updated_data)
    assert response.status_code == 200
    assert response.json['success'] is True

    # get project to verify
    response = test_client.get(f"/project/{project['project']['project_id']}", json=updated_data)

    assert response.status_code == 200
    updated_project = response.json['project']

    # check update was made
    assert updated_project['project_code'] == updated_data['project_code']
    assert updated_project['title'] == updated_data['title']
    assert updated_project['description'] == updated_data['description']
    assert updated_project['instructions'] == updated_data['instructions']


def test_delete_project(test_client):
    register_and_login(test_client)
    project = create_test_project(test_client)

    response = test_client.delete(f"/project/{project['project']['project_id']}")
    assert response.status_code == 200
    assert response.json['success'] is True
