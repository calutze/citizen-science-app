# model for Users

from app import db
from flask_login import UserMixin
# from datetime import datetime
# from sqlalchemy import relationship


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    user_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    username = db.Column(db.String(150), unique=True)
    password_hash = db.Column(db.String(200))
    email = db.Column(db.String(200))
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    school = db.Column(db.String(200))

    # relationships
    # projects = db.relationship('Project', backref='creator', lazy=True)

    def get_id(self):
        """ Gets user id. """
        return self.user_id
