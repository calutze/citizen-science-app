import os
from dotenv import load_dotenv
from datetime import timedelta

from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from .services.error_handlers import register_error_handlers

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
bcrypt = Bcrypt()


def create_app():

    # create and config app
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

    app.config['SESSION_PERMANENT'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)

    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = True

    CORS(app)

    # initialize with app
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    # register error handlers
    register_error_handlers(app)

    # import models
    from app.models.users import User
    from app.models.projects import Project
    from app.models.observations import Observation, ObservationValue
    from app.models.forms import FormTemplate, FormField
    from app.models.questions import Question

    # loads user
    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))

    # import and register blueprints
    from app.routes.auth_routes import auth
    from app.routes.project_routes import project
    from app.routes.field_app_routes import field_app
    from app.routes.form_routes import form
    from app.routes.observation_routes import observation

    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(project)
    app.register_blueprint(field_app)
    app.register_blueprint(form)
    app.register_blueprint(observation)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', debug=True)
