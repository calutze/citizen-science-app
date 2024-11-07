import os
from dotenv import load_dotenv
from datetime import timedelta

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

from flask import render_template, session

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
bcrypt = Bcrypt()


# remove config param
def create_app(config=None):

    # create and config app
    app = Flask(__name__)

    # for pytest, take configs out of else, delete if
    if config:
        app.config.from_mapping(config)
    else:
        app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
        app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

    app.config['SESSION_PERMANENT'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)  # TODO TBD

    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = True

    CORS(app)   # TODO more specific config is needed here

    # initialize with app
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    # import models
    from app.models.users import User
    from app.models.projects import Project
    from app.models.observations import Observation, ObservationValue
    from app.models.forms import FormTemplate, FormField
    from app.models.questions import Question

    # loads user
    @login_manager.user_loader
    def load_user(user_id):
        # return User.query.get(int(user_id))
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

    # TODO for backend demo and testing only
    @app.route('/')
    def home():
        project_code = None

        if 'project_id' in session:
            project = Project.query.get(session['project_id'])
            if project:
                project_code = project.project_code

        return render_template('home.html', project_code=project_code)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', debug=True)
