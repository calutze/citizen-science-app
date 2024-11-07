import pytest
from .helpers.helper_functions import register_and_login, create_test_project


def test_add_form(test_client):
    register_and_login(test_client)
    project = create_test_project(test_client)

    project_id = project['project']['project_id']

    form_data = {
        'project_id': project_id,
        'description': 'Test Form',
        'fields': [
            {
                'field_title': 'Test Field',
                'field_type': 'text',
                'field_description': 'A test field',
                'field_order': 1,
                'is_required': True
            }
        ]
    }

    # add form
    response = test_client.post('/form', json=form_data)
    assert response.status_code == 201
    assert response.json['success'] is True

    # get form
    form_id = response.json['form']['form_id']
    response = test_client.get(f"/form/{form_id}")
    assert response.status_code == 200


def test_update_form(test_client):
    register_and_login(test_client)
    project = create_test_project(test_client)
    project_id = project['project']['project_id']

    # add a form first
    form = test_client.post('/form', json={
        'project_id': project_id,
        'description': 'Test Form',
        'fields': [
            {
                'field_title': 'Test Field',
                'field_type': 'text',
                'field_description': 'A test field',
                'field_order': 1,
                'is_required': True
            }
        ]
    }).json['form']
    form_id = form['form_id']

    # update form data
    updated_data = {
        'description': 'Updated Test Form',
        'fields': [
            {
                'field_id': form['fields'][0]['field_id'],
                'field_title': 'Updated Field Title',
                'field_type': 'number',
                'field_description': 'Updated description',
                'field_order': 2,
                'is_required': False
            }
        ]
    }

    # update form
    response = test_client.put(f"/form/{form_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json['success'] is True

    # get updated form
    response = test_client.get(f"/form/{form_id}")
    assert response.status_code == 200


def test_delete_form(test_client):
    register_and_login(test_client)
    project = create_test_project(test_client)
    project_id = project['project']['project_id']

    # add a form
    form = test_client.post('/form', json={
        'project_id': project_id,
        'description': 'Test Form',
        'fields': [
            {
                'field_title': 'Test Field',
                'field_type': 'text',
                'field_description': 'A test field',
                'field_order': 1,
                'is_required': True
            }
        ]
    }).json['form']
    form_id = form['form_id']

    # delete the form
    response = test_client.delete(f"/form/{form_id}")
    assert response.status_code == 200
    assert response.json['success'] is True
