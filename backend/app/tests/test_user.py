

def test_register_user(test_client):
    response = test_client.post('/auth/register', json={
        'username': 'testuser',
        'password': 'password123',
        'email': 'testuser@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'school': 'Test School'
    })

    assert response.status_code == 201
    assert response.json['success'] is True


def test_login_user(test_client):
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
    assert response.json['success'] is True
