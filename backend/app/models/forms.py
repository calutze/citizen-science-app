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

    def get_id(self):
        """ Gets form id. """
        return self.form_id


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
