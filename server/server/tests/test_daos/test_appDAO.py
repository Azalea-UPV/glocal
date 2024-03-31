import unittest
from unittest.mock import Mock, patch
from server.database.database import db
from server.database.DAOs import AppDAO
from server import app

class TestAppDAO(unittest.TestCase):
    def setUp(self):
        self.dao = AppDAO()
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
    def test_get_appinfo(self, mock_query):
        mock_point1 = Mock(latitude=1.0, longitude=2.0)
        mock_point2 = Mock(latitude=3.0, longitude=4.0)
        mock_appinfo = Mock(points=[mock_point1, mock_point2])

        mock_query.return_value.order_by.return_value.first.return_value = mock_appinfo

        result = self.dao.get_appinfo()
        self.assertEqual(len(result['points']), 2)
        self.assertEqual(result['points'][0], (1.0, 2.0))
        self.assertEqual(result['points'][1], (3.0, 4.0))

    @patch('server.database.database.db.session.add')
    @patch('server.database.database.db.session.flush')
    @patch('server.database.database.db.session.commit')
    def test_set_appinfo(self, mock_commit, mock_flush, mock_add):
        points = [(1.0, 2.0), (3.0, 4.0), (5.0, 6.0)]

        result = self.dao.set_appinfo(points)
        self.assertTrue(result)
        mock_add.assert_called()
        mock_flush.assert_called()
        mock_commit.assert_called()

if __name__ == '__main__':
    unittest.main()
