""" Models for Observations """

from datetime import datetime
from app import db


class Observation(db.Model):
    """ Represents an observation linked to a project.

    Attributes:
        observation_id (int): Primary key for the observation.
        created_at (datetime): Timestamp for observation creation.
        student_identifier (str): Identifier for the student.
        image_url (str): URL for image associated with the observation.
        project (int): Foreign key linking to the project.
        observation_values (list): Relationship to observation values.
    """

    __tablename__ = 'observations'

    observation_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        index=True
        )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    student_identifier = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(200), nullable=True)
    project = db.Column(
        db.Integer,
        db.ForeignKey('projects.project_id', ondelete='CASCADE'),
        nullable=False
        )
    observation_values = db.relationship(
        'ObservationValue',
        backref='parent_observation',
        cascade='all, delete'
        )

    def get_id(self):
        """ Gets observation id. """
        return self.observation_id

    def to_dict(self, include_inactive=False):
        """ Converts observation and related values to dictionary format. """
        values = [
            value.to_dict()
            for value in self.observation_values
            if include_inactive or (value.form_field and value.form_field.is_active)
        ]

        return {
            'observation_id': self.observation_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'student_identifier': self.student_identifier,
            'image_url': self.image_url,
            'project_id': self.project,
            'observation_values': values
        }


class ObservationValue(db.Model):
    """ Represents a value within an observation.

    Attributes:
        observation_value_id (int): Primary key for the observation value.
        value (str): The actual value recorded for the observation.
        observation (int): Foreign key linking to the observation.
        field (int): Foreign key linking to the form field.
    """

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
        nullable=False,
        index=True
        )
    field = db.Column(
        db.Integer,
        db.ForeignKey('form_fields.field_id', ondelete='CASCADE'),
        nullable=False,
        index=True
        )

    form_field = db.relationship('FormField', backref='observation_values', lazy=True)

    def get_id(self):
        """ Gets observation value id. """
        return self.observation_value_id

    def to_dict(self):
        """ Converts the observation value to dictionary format. """
        return {
            'observation_value_id': self.observation_value_id,
            'value': self.value,
            'form_field': self.form_field.to_dict() if self.form_field else None
        }
