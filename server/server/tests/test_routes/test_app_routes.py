import unittest
from unittest.mock import patch
from server import app
from server.database import AppDAO, UserDAO
from server.database.database import db

class TestAppRoutes(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_appInfo(self):
        points = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        user = {
            "id": 1,
            "email": "email@email.email",
            "username": "username",
            "is_admin": 0,
            "is_mod": 0,
        }

        with patch.object(AppDAO, 'get_appinfo', return_value={"points": points}):
            response = self.client.get('/appinfo')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['logged'], False)
        self.assertEqual(response.json["points"], points)

        with self.client.session_transaction() as sess:
            sess['user'] = {"id": 1}

        with patch.object(AppDAO, 'get_appinfo', return_value={"points": points}), patch.object(UserDAO, 'get_user_by_id', return_value=user):
            response = self.client.get('/appinfo')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['logged'], True)
        self.assertEqual(response.json["user"], user)

        with patch.object(AppDAO, 'get_appinfo', return_value={"points": points}), patch.object(UserDAO, 'get_user_by_id', return_value=None):
            response = self.client.get('/appinfo')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['logged'], False)
