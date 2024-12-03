# Unit Tests created with ChatGPT assistance.

# helper functions for unit testing

def register_and_login(test_client):
    """ Helper function to register and log for testing. """

    response = test_client.post('/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'email': 'testuser@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'school': 'Test School'
    })

    assert response.status_code == 201

    response = test_client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'password123'
    })

    assert response.status_code == 200


def create_test_project(test_client):
    """ Helper function to create a new project. """

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
    return response.json


def add_test_observation(test_client, project_id):
    """ Helper function to add an observation for testing. """

    observation_data = {
        'project_id': project_id,
        'student_identifier': 'student001',
        'image_url': 'http://example.com/image.jpg',
        'observation_values': [
            {'value': 'Test Value', 'field': 1}
        ]
    }

    response = test_client.post('/add-observation', json=observation_data)

    assert response.status_code == 201
    return response.json['observation']


def add_test_form(test_client, project_id, description="Test Form"):
    """ Helper function to add a form template for testing. """

    form_data = {
        'project_id': project_id,
        'description': description,
        'fields': [
            {
                'field_title': 'Test Field',
                'field_type': 'text',
                'field_description': 'A test field',
                'field_options': None,
                'field_order': 1,
                'is_required': True
            }
        ]
    }
    response = test_client.post('/form', json=form_data)
    assert response.status_code == 201
    return response.json['form']
