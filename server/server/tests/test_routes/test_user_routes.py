import unittest
from unittest.mock import patch
from server import app
from server.database import UserDAO
from server.database.database import db

class TestUserRoutes(unittest.TestCase):
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

    def test_get_all_users(self):
        response = self.client.get('/users')
        self.assertEqual(response.status_code, 403)

        with self.client.session_transaction() as sess:
            sess['user'] = {"id": 1, "is_admin": 1}

        users_data = [
            {"id": 1, "username": "user1", "email": "user1@example.com"},
            {"id": 2, "username": "user2", "email": "user2@example.com"}
        ]

        with patch.object(UserDAO, 'get_all_users', return_value=users_data):
            with patch.object(UserDAO, 'is_admin', return_value=False):
                response = self.client.get('/users')
            self.assertEqual(response.status_code, 403)

            with patch.object(UserDAO, 'is_admin', return_value=True):
                response = self.client.get('/users')

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json['users'], users_data)

    def test_signup(self):
        response = self.client.post('/signup', json={})
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/signup', json={"user": "testuser", "mail": "test@example.com"})
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/signup', json={"user": "testuser", "password": "password"})
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/signup', json={"mail": "test@example.com", "password": "password"})
        self.assertEqual(response.status_code, 400)

        invalid_email_data = {"user": "testuser", "mail": "invalid_email", "password": "password"}
        response = self.client.post('/signup', json=invalid_email_data)
        self.assertEqual(response.status_code, 400)

        valid_signup_data = {"user": "testuser", "mail": "test@example.com", "password": "password"}
        with patch.object(UserDAO, 'add_user', return_value=True):
            response = self.client.post('/signup', json=valid_signup_data)
        self.assertEqual(response.status_code, 200)

    def test_login(self):
        response = self.client.post('/login', json={})
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/login', json={"mail": "test@example.com"})
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/login', json={"password": "password"})
        self.assertEqual(response.status_code, 400)

        invalid_login_data = {"mail": "test@example.com", "password": "wrong_password"}
        with patch.object(UserDAO, 'check_password', return_value=False):
            response = self.client.post('/login', json=invalid_login_data)
        self.assertEqual(response.status_code, 403)

        valid_login_data = {"mail": "test@example.com", "password": "password"}
        user_data = {"id": 1, "username": "testuser", "email": "test@example.com"}
        with patch.object(UserDAO, 'check_password', return_value=True), \
             patch.object(UserDAO, 'get_user_by_mail', return_value=user_data):
            response = self.client.post('/login', json=valid_login_data)
        self.assertEqual(response.status_code, 200)

        with self.client.session_transaction() as sess:
            self.assertEqual(sess['user'], user_data)

if __name__ == '__main__':
    unittest.main()
