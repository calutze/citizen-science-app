""" Models for custom forms """

from datetime import datetime
from app import db


class FormTemplate(db.Model):
    """ Represents a custom form template with associated fields.

    Attributes:
        form_id (int): Primary key for the form template.
        created_at (datetime): Timestamp for form creation.
        description (str): Description of the form's purpose.
        created_by (int): ID of the user who created the form.
        project (int): ID of the project this form is associated with.
        form_fields (list): Relationship to fields within the form template.
    """

    __tablename__ = 'form_templates'

    form_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
        index=True
        )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text)
    created_by = db.Column(
        db.Integer,
        db.ForeignKey('users.user_id', ondelete='CASCADE'),
        nullable=False, index=True
        )
    project = db.Column(
        db.Integer,
        db.ForeignKey('projects.project_id', ondelete='CASCADE'),
        nullable=False,
        index=True
        )
    form_fields = db.relationship(
        'FormField',
        backref='parent_form',
        cascade='all, delete',
        lazy=True
        )

    def get_id(self):
        """ Gets form id. """
        return self.form_id

    def to_dict(self):
        """ Converts form template and related fields to dictionary format. """
        return {
            'form_id': self.form_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'description': self.description,
            'created_by': self.created_by,
            'project_id': self.project,
            'fields': [field.to_dict() for field in self.form_fields]
        }


class FormField(db.Model):
    """ Represents a field within a form template.

    Attributes:
        field_id (int): Primary key for the form field.
        field_title (str): Title of the form field.
        field_type (str): Data type of the form field (e.g., text, dropdown).
        field_description (str): Description of the field's purpose.
        field_options (list): Options for dropdown fields, if applicable.
        field_order (int): Order of the field within the form.
        is_required (bool): Whether the field is required.
        form (int): Foreign key linking to the form template.
    """

    __tablename__ = 'form_fields'

    field_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    field_title = db.Column(db.String(150))
    field_type = db.Column(db.String(150))
    field_description = db.Column(db.Text)
    field_options = db.Column(db.JSON)  # for multiple options (ie. drop down)
    field_order = db.Column(db.Integer)
    is_required = db.Column(db.Boolean)
    form = db.Column(
        db.Integer,
        db.ForeignKey('form_templates.form_id', ondelete='CASCADE'),
        nullable=False,
        index=True
        )

    def get_id(self):
        """ Gets form field id. """
        return self.field_id

    def to_dict(self):
        """ Converts form field and related values to dictionary format. """
        return {
            'field_id': self.field_id,
            'field_title': self.field_title,
            'field_type': self.field_type,
            'field_description': self.field_description,
            'field_options': self.field_options,
            'field_order': self.field_order,
            'is_required': self.is_required,
            'form': self.form
        }
