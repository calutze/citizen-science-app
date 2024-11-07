# models for custom forms

from app import db
from datetime import datetime


class FormTemplate(db.Model):
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
        nullable=False
    )

    project = db.Column(
        db.Integer,
        db.ForeignKey('projects.project_id', ondelete='CASCADE'),
        nullable=False
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
    __tablename__ = 'form_fields'

    field_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    field_title = db.Column(db.String(150))
    field_type = db.Column(db.String(150))
    field_description = db.Column(db.Text)
    field_options = db.Column(db.JSON)      # for drop down and such
    field_order = db.Column(db.Integer)
    is_required = db.Column(db.Boolean)

    form = db.Column(
        db.Integer,
        db.ForeignKey('form_templates.form_id', ondelete='CASCADE'),
        nullable=False
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
