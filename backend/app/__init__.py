import os
from dotenv import load_dotenv
from datetime import timedelta

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

from flask import render_template

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
    # from app.models.projects import Project
    # from app.models.observations import Observation, ObservationValue
    # from app.models.forms import FormTemplate, FormField
    # from app.models.questions import Question

    # loads user
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # import and register blueprints
    from app.routes.auth_routes import auth
    from app.routes.admin_routes import admin
    app.register_blueprint(auth, url_prefix='/auth')    # TODO name ok?
    app.register_blueprint(admin, url_prefix='/admin')  # TODO name ok?

    # TODO for backend demo and testing
    @app.route('/')
    def home():
        return render_template('home.html')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', debug=True)
