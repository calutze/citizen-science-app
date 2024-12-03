"""
Unit Tests created with ChatGPT assistance.

Note: Unit testing was created prior to forntend integration,
and may not reflect current endpoints and database models.
"""

import pytest
from app import create_app, db


@pytest.fixture(scope='function')
def test_client():
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SECRET_KEY': 'test_secret'
    })

    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()
            # db.session.commit()
        yield testing_client

        with app.app_context():
            db.session.remove()
            db.drop_all()
