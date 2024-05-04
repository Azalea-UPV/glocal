import unittest
from unittest.mock import Mock, patch
from server.database.database import db, User
from server.database.DAOs import UserDAO
from server import app
import bcrypt

class TestUserDAO(unittest.TestCase):
    def setUp(self):
        self.dao = UserDAO()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app_context = app.app_context()

        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()  

    @patch('server.database.database.db.session.query')
    def test_add_user(self, mock_query):
        mock_user = Mock(email="test@example.com")
        mock_query.return_value.filter_by.return_value.first.return_value = None

        result = self.dao.add_user("test", "test@example.com", "password")
        self.assertTrue(result)

    @patch('server.database.database.db.session.query')
    def test_add_user_existing_email(self, mock_query):
        mock_user = Mock(email="test@example.com")
        mock_query.return_value.filter_by.return_value.first.return_value = mock_user

        result = self.dao.add_user("test", "test@example.com", "password")
        self.assertFalse(result)

    @patch('server.database.database.db.session.query')
    def test_check_password(self, mock_query):
        hashed_password = bcrypt.hashpw("password".encode(), bcrypt.gensalt())
        mock_user = Mock(password=hashed_password)
        mock_query.return_value.filter_by.return_value.first.return_value = mock_user

        result = self.dao.check_password("test@example.com", "password")
        self.assertTrue(result)

    @patch('server.database.database.db.session.query')
    def test_check_password_wrong_password(self, mock_query):
        hashed_password = bcrypt.hashpw("password".encode(), bcrypt.gensalt())
        mock_user = Mock(password=hashed_password)
        mock_query.return_value.filter_by.return_value.first.return_value = mock_user

        result = self.dao.check_password("test@example.com", "wrong_password")
        self.assertFalse(result)

    def test_is_admin(self):
        user = User(username="test", email="test@example.com", password="password", is_admin=True)
        db.session.add(user)
        db.session.commit()

        result = self.dao.is_admin(user.id)
        self.assertTrue(result)

    def test_is_mod(self):
        user = User(username="test", email="test@example.com", password="password", is_mod=True)
        db.session.add(user)
        db.session.commit()

        result = self.dao.is_mod(user.id)
        self.assertTrue(result)

    def test_set_mod(self):
        user = User(username="test", email="test@example.com", password="password", is_mod=False)
        db.session.add(user)
        db.session.commit()

        self.assertTrue(self.dao.set_mod(user.id, True))
        self.assertTrue(user.is_mod)

    @patch('server.database.database.db.session.query')
    def test_get_user_by_mail(self, mock_query):
        mock_user = Mock(email="test@example.com")
        mock_query.return_value.filter_by.return_value.first.return_value = mock_user

        result = self.dao.get_user_by_mail("test@example.com")
        self.assertIsNotNone(result)
        self.assertEqual(result["email"], "test@example.com")

    @patch('server.database.database.db.session.get')
    def test_get_user_by_id(self, mock_get):
        mock_user = Mock(email="test@example.com")
        mock_get.return_value = mock_user

        result = self.dao.get_user_by_id(1)
        self.assertIsNotNone(result)
        self.assertEqual(result["email"], "test@example.com")

    @patch('server.database.database.db.session.query')
    def test_get_all_users(self, mock_query):
        mock_user1 = Mock(email="test1@example.com")
        mock_user2 = Mock(email="test2@example.com")
        mock_query.return_value.all.return_value = [mock_user1, mock_user2]

        result = self.dao.get_all_users()
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["email"], "test1@example.com")
        self.assertEqual(result[1]["email"], "test2@example.com")

if __name__ == '__main__':
    unittest.main()
