""" Service for validation needs. """

from flask_login import current_user
from flask import abort
from app.models.projects import Project
from app.models.observations import Observation
from app.models.forms import FormTemplate, FormField
from app import db


def validate_with_user(item):
    """ Validates item and is current user, and returns result. """
    if not item:
        abort(404)

    if item.created_by != current_user.user_id:
        abort(403)

    return True


def validate_project(item):
    """ Validates item, and returns result. """
    if not item:
        abort(404)

    return True


def validate_observation(observation_id):
    """Validates if an observation exists."""
    observation = db.session.get(Observation, observation_id)

    if not observation:
        abort(404, description="Observation not found.")

    return observation


def validate_project_ownership(project_id):
    """Validates that the project exists and belongs to the current user."""
    project = Project.query.get(project_id)

    if not project:
        abort(404, description="Project not found.")

    if project.created_by != current_user.user_id:
        abort(403, description="Unauthorized access to this project.")

    return project


def validate_form_template(form_id):
    """Validates if a form template exists."""
    form = FormTemplate.query.get(form_id)

    if not form:
        abort(404, description="Form template not found.")

    return form


def validate_form_field(field_id):
    """Validates if a form field exists."""
    field = FormField.query.get(field_id)

    if not field:
        abort(404, description="Form field not found.")

    return field
