# admin web app routes

# TODO: Fix data source and returns for FE integration, remove demo functions and imports.

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.projects import Project

from flask import render_template, redirect, url_for


admin = Blueprint('admin', __name__)


@admin.route('/add-project', methods=['GET'])
@login_required
def add_project_form():
    return render_template('add_project.html')


@admin.route('/success', methods=['GET'])
def success():
    return render_template('success.html')


@admin.route('/fail', methods=['GET'])
def fail():
    return render_template('fail.html')


@admin.route('/user-projects')
@login_required
def show_user_projects():
    projects = Project.query.filter_by(created_by=current_user.user_id).all()
    return render_template('show_user_projects.html', projects=projects, username=current_user.username)


@admin.route('/add-project', methods=['POST'])
@login_required
def add_project():
    """ Creates a new project and saves to the database. """
    # data = request.get_json()

    project_code = request.form['project_code']
    title = request.form['title']
    description = request.form['description']
    instructions = request.form['instructions']
    created_by = current_user.user_id

    print(created_by)

    project = Project(
        project_code=project_code,
        title=title,
        description=description,
        instructions=instructions,
        created_by=created_by
    )

    try:
        db.session.add(project)
        db.session.commit()
        # return jsonify({'success': True, 'project code': project.project_code}), 201
        return redirect(url_for('admin.success'))

    except Exception as e:
        db.session.rollback()
        # return jsonify({'error': str(e)}), 500
        return redirect(url_for('admin.fail'))
