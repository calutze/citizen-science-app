"""
Defines authentication and user management routes for registration,
login, logout, and CRUD operations on user data.

Each route returns JSON responses and includes error handling.
Passwords are hashed for security, and Flask-Login is used
to manage session states.
"""


from flask import Blueprint, request, jsonify, abort
from flask_login import login_user, login_required, logout_user
from app import bcrypt, db
from app.models.users import User


auth = Blueprint('auth', __name__)


@auth.route('/register', methods=['POST'])
def handle_registration():
    """ Registers a new user with provided details. """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    school = data.get('school')

    # verifies all required data is present in request
    if not all([username, password, email, first_name, last_name, school]):
        abort(400)

    user = User.query.filter((User.username == username)).first()

    if user:
        abort(409)

    # hash password and creates new user
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(
        username=username,
        password_hash=password_hash,
        email=email,
        first_name=first_name,
        last_name=last_name,
        school=school
        )

    try:
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return jsonify({"success": True, "message": "Registration successful"}), 201

    except Exception:
        db.session.rollback()
        abort(500)


@auth.route('/login', methods=['POST'])
def handle_login():
    """ Logs in an existing user if credentials are valid. """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        abort(400)

    user = User.query.filter(User.username == username).first()

    # verifies credientials, logs in user
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)

        return jsonify({'success': True, 'message': 'Login successful'}), 200

    abort(401)


@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    """ Logs out current user. """
    logout_user()
    return jsonify({'success': True}), 200


@auth.route('/user/<int:user_id>', methods=['GET'])
@login_required
def get_user_info(user_id):
    """ Gets user information based on user_id. """
    user = User.query.get(user_id)

    if not user:
        abort(404)

    user_info = {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'school': user.school
    }
    return jsonify(user_info), 200


@auth.route('/update-user/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    """ Updates user information by user id. """
    user = User.query.get(user_id)

    if not user:
        abort(404)

    data = request.get_json()
    user.email = data.get('email', user.email)
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.school = data.get('school', user.school)

    try:
        db.session.commit()
        return jsonify({'success': True, 'message': "User updated"}), 200

    except Exception:
        db.session.rollback()
        abort(500)


@auth.route('/delete-user/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    """ Deletes user account based on user_id. """
    user = User.query.get(user_id)

    if not user:
        abort(404)

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'success': True, 'message': "User deleted"}), 200

    except Exception:
        db.session.rollback()
        abort(500)
