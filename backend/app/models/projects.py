""" Model for Projects """

from datetime import datetime
from app import db


class Project(db.Model):
    """ Represents a project containing observations and forms.

    Attributes:
        project_id (int): Primary key for the project.
        created_at (datetime): Timestamp for project creation.
        project_code (str): Unique code for project identification.
        title (str): Project title.
        description (str): Description of the project.
        instructions (str): Additional instructions for the project.
        created_by (int): ID of the user who created the project.
    """

    __tablename__ = 'projects'

    project_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        index=True
        )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    project_code = db.Column(db.String(200), unique=True, index=True)
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

    def to_dict(self):
        """ Converts project attributes to a dictionary. """
        return {
            'project_id': self.project_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'project_code': self.project_code,
            'title': self.title,
            'description': self.description,
            'instructions': self.instructions,
            'created_by': self.created_by
        }
