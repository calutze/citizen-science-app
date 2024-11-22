from flask import Blueprint, request, jsonify, abort, session
from flask_login import login_required, current_user
from app import db
from app.models.projects import Project
from app.models.forms import FormField
from app.models.observations import Observation, ObservationValue
from app.services.validation import validate_observation


dashboard = Blueprint('dashboard', __name__)


@dashboard.route('/show-obs-stats', methods=['GET'])
@login_required
def project_obs_chart():

    projects = Project.guery.filter_by(created_by=current_user.user_id).all()
