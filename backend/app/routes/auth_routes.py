# admin web app login/auth routes

# TODO: Fix data source and returns for FE integration, remove demo functions and imports.

from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user
from app import bcrypt, db
from app.models.users import User

from flask import render_template, redirect, url_for


auth = Blueprint('auth', __name__)


@auth.route('/register', methods=['GET'])
def register_form():
    return render_template('register.html')


@auth.route('/login', methods=['GET'])
def login_form():
    return render_template('login.html')


@auth.route('/success', methods=['GET'])
def success():
    return render_template('success.html')


@auth.route('/fail', methods=['GET'])
def fail():
    return render_template('fail.html')


@auth.route('/register', methods=['GET', 'POST'])
def handle_registration():
    """ Handles registration and login of a new user. """
    # data = request.get_json()     # request from FE

    # only for testing
    username = request.form['username']
    password = request.form['password']
    email = request.form['email']
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    school = request.form['school']

    user = User.query.filter((User.username == username)).first()

    if user:
        # return jsonify({'error': 'User already exits.'}), 409
        return redirect(url_for('auth.fail'))

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
        # return jsonify({'success': True, 'username': username}), 201
        return redirect(url_for('auth.success'))

    except Exception as e:
        db.session.rollback()
        # return jsonify({'error': str(e)}), 500
        return redirect(url_for('auth.fail'))


@auth.route('/login', methods=['GET', 'POST'])
def handle_login():
    """ Handles admin login. """
    # data = request.get_json()   # data to come from FE
    # username = data.get('username')
    # password = data.get('password')

    # only for testing
    username = request.form['username']
    password = request.form['password']

    if not username or not password:
        #  return jsonify({'error': 'Username and password are required for login'}), 400
        return redirect(url_for('auth.fail'))

    user = User.query.filter(User.username == username).first()

    print(user.username)

    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)
        # return jsonify({'success': True, 'username': user.username}), 200
        return redirect(url_for('auth.success'))

    return redirect(url_for('auth.fail'))
    # return jsonify({'error': 'Invalid username or password'}), 401


@auth.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    """ Logs out current user, redirects to home. """
    logout_user()
    # return jsonify({'success': True}), 200
    return redirect(url_for('home'))
