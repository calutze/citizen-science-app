""" Model for Users. """

from app import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    """ Represents an 'admin' user (for the admin web app).

        Attributes:
        user_id (int): Primary key and unique identifier for the user.
        username (str): Unique username for user authentication.
        password_hash (str): Hashed password for user security.
        email (str): User's email address.
        first_name (str): User's first name.
        last_name (str): User's last name.
        school (str): School associated with the user.
        projects (list): Relationship to the projects created by the user.

    """

    __tablename__ = 'users'

    user_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        index=True
        )
    username = db.Column(db.String(150), unique=True, index=True)
    password_hash = db.Column(db.String(200))
    email = db.Column(db.String(200))
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    school = db.Column(db.String(200))
    projects = db.relationship('Project', backref='creator', lazy=True)

    def get_id(self):
        """ Gets user id. """
        return self.user_id
