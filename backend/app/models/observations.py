# models for observations

from app import db
from datetime import datetime


class Observation(db.Model):
    __tablename__ = 'observations'

    observation_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    student_identifier = db.Column(db.String(100), unique=True, nullable=True)
    image_url = db.Column(db.String(200), nullable=True)

    project = db.Column(
        db.Integer,
        db.ForeignKey('projects.project_id', ondelete='CASCADE'),
        nullable=False
    )

    def get_id(self):
        """ Gets observation id. """
        return self.observation_id


class ObservationValue(db.Model):
    __tablename__ = 'observation_values'

    observation_value_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    value = db.Column(db.Text)

    observation = db.Column(
        db.Integer,
        db.ForeignKey('observations.observation_id', ondelete='CASCADE'),
        nullable=False
    )

    field = db.Column(
        db.Integer,
        db.ForeignKey('form_fields.field_id', ondelete='CASCADE'),
        nullable=False
    )

    def get_id(self):
        """ Gets observation value id. """
        return self.observation_value_id
