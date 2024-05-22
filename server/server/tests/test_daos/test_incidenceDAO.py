import unittest
from unittest.mock import Mock, patch
from server.database.database import db, Incidence, User
from server.database.DAOs import IncidenceDAO, AppDAO
from server import app
import datetime

class TestIncidenceDAO(unittest.TestCase):
    def setUp(self):
        self.dao = IncidenceDAO()
        self.app = app.test_client()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app_context = app.app_context()

        self.app_context.push()
        AppDAO()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

        self.app_context.pop()  

    incidence1 = Incidence(
        id = 1,
        timestamp = datetime.datetime.now(),
        short_description = "short description",
        long_description = "long description",
        address = "address",
        latitude = 0.1,
        longitude = 10.5,
        creation_user = User(
            username="username"
        )
    )

    incidence2 = Incidence(
        id = 2,
        timestamp = datetime.datetime.now(),
        short_description = "short description",
        long_description = "long description",
        creation_user_id = 1,
        address = "address",
        latitude = 0.1,
        longitude = 10.5,
        closed = datetime.datetime.now() - datetime.datetime.now(),
        closed_by_id = 1
    )

    @patch('server.database.database.db.session.query')
    def test_get_incidences(self, mock_query):
        mock_query.return_value.filter.return_value.all.return_value = [
            self.incidence1,
            self.incidence2
        ]

        incidences = self.dao.get_incidences()
        self.assertEqual(len(incidences), 2)
        self.assertEqual(incidences[0], IncidenceDAO.to_short_dict(self.incidence1))
        self.assertEqual(incidences[1], IncidenceDAO.to_short_dict(self.incidence2))

    @patch('server.database.database.db.session.add', new_callable=Mock)
    @patch('server.database.database.db.session.commit', new_callable=Mock)
    @patch('server.database.DAOs.incidenceDAO.get_address', return_value="Mocked Address")
    def test_add_incidence(self, mock_get_address, mock_commit, mock_add):
        result = self.dao.add_incidence(1, "short_description", "long_description", 1.0, 1.0, 1)

        mock_get_address.assert_called_once_with(1.0, 1.0)
        mock_add.assert_called_once()
        mock_commit.assert_called_once()

        args, _ = mock_add.call_args
        incidence_arg = args[0]
        self.assertEqual(incidence_arg.creation_user_id, 1)
        self.assertEqual(incidence_arg.short_description, "short_description")
        self.assertEqual(incidence_arg.long_description, "long_description")
        self.assertEqual(incidence_arg.address, "Mocked Address")
        self.assertEqual(incidence_arg.latitude, 1.0)
        self.assertEqual(incidence_arg.longitude, 1.0)

        self.assertTrue(result)

    @patch('server.database.database.db.session.get')
    def test_get_incidence(self, mock_get):
        mock_get.return_value = self.incidence1
        incidence = self.dao.get_incidence(1)
        self.assertIsNotNone(incidence)
        self.assertEqual(incidence, IncidenceDAO.to_dict(self.incidence1))

    def test_close_incidence(self):
        self.dao.add_incidence(1, "short_description", "long_description", 1.0, 1.0, 1)
        self.assertTrue(self.dao.close_incidence(1, 1))

    def test_like(self):
        self.dao.add_incidence(1, "short_description", "long_description", 1.0, 1.0, 1)
        self.assertTrue(self.dao.like(1, 1))

    def test_unlike(self):
        self.dao.add_incidence(1, "short_description", "long_description", 1.0, 1.0, 1)
        self.dao.like(1, 1)  # Dar like primero
        self.assertTrue(self.dao.unlike(1, 1))

    def test_is_liked(self):
        self.dao.add_incidence(1, "short_description", "long_description", 1.0, 1.0, 1)
        self.dao.like(1, 1)  # Dar like primero
        self.assertTrue(self.dao.is_liked(1, 1))

    @patch('server.database.database.db.session.query')
    def test_get_comments(self, mock_query):
        mock_comment1 = Mock(id=1, user=User(username="user1"), text="Comment 1", timestamp=datetime.datetime.now())
        mock_comment2 = Mock(id=2, user=User(username="user2"), text="Comment 2", timestamp=datetime.datetime.now())

        mock_query.return_value.filter_by.return_value.filter.return_value.order_by.return_value.all.return_value = [
            mock_comment1,
            mock_comment2
        ]

        comments = self.dao.get_comments(1)
        self.assertEqual(len(comments), 2)
        self.assertEqual(comments[0]['id'], 1)
        self.assertEqual(comments[1]['text'], "Comment 2")

    @patch('server.database.database.db.session.get')
    def test_remove_comment(self, mock_get):
        mock_comment = Mock(id=1, removed=None)
        mock_get.return_value = mock_comment

        result = self.dao.remove_comment(1, 1)
        self.assertTrue(result)
        self.assertIsNotNone(mock_comment.removed)
        self.assertEqual(mock_comment.removed_by_id, 1)

    @patch('server.database.database.db.session.add')
    def test_add_comment(self, mock_add):
        self.dao.add_comment(1, 1, "New comment")
        mock_add.assert_called_once()

if __name__ == '__main__':
    unittest.main()
