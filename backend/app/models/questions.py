# models for questions

from app import db
from datetime import datetime


class Question(db.Model):
    __tablename__ = 'questions'

    question_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    student_identifier = db.Column(db.String(100), unique=True, nullable=True)

    project = db.Column(
        db.Integer,
        db.ForeignKey('projects.project_id', ondelete='CASCADE'),
        nullable=False
    )

    observation = db.Column(
        db.Integer,
        db.ForeignKey('observations.observation_id', ondelete='CASCADE'),
        nullable=False
    )

    def get_id(self):
        """ Gets question id. """
        return self.question_id
