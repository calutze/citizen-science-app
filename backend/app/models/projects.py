# models for Projects

from app import db
from datetime import datetime


class Project(db.Model):
    __tablename__ = 'projects'

    project_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    project_code = db.Column(db.String(200), unique=True)
    title = db.Column(db.String(150))
    description = db.Column(db.Text)
    instructions = db.Column(db.Text)

    created_by = db.Column(
        db.Integer,
        db.ForeignKey('users.user_id', ondelete='CASCADE'),
        nullable=False
    )

    def get_id(self):
        """ Gets project id. """
        return self.project_id
