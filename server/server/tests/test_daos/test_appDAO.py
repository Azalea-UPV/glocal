import unittest
from unittest.mock import Mock, patch
from server.database.database import db, Class
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
        mock_class = Mock(id= 5, iconurl='iconurl', classname='classname')

        mock_query.return_value.all.return_value = [mock_point1, mock_point2]
        #.query(Class).filter(Class.removed.is_(None)
        mock_query.return_value.filter.return_value = {mock_class}

        result = self.dao.get_appinfo()
        self.assertEqual(len(result['points']), 2)
        self.assertEqual(result['points'][0], (1.0, 2.0))
        self.assertEqual(result['points'][1], (3.0, 4.0))
        self.assertEqual(result['classes'], {5: {'id': 5, 'classname': 'classname', 'iconurl': 'iconurl'}})
        mock_query.assert_called()

    @patch('server.database.database.db.session.add')
    @patch('server.database.database.db.session.commit')
    def test_set_points(self, mock_commit, mock_add):
        points = [(1.0, 2.0), (3.0, 4.0), (5.0, 6.0)]

        result = self.dao.set_points(points)
        self.assertTrue(result)
        mock_add.assert_called()
        mock_commit.assert_called()

    def test_add_class(self):
        cl_data = {'classname': 'Test Class', 'iconurl': 'test_icon_url'}
        class_id = self.dao.add_class(cl_data)

        added_class = db.session.query(Class).filter_by(id=class_id).first()

        self.assertIsNotNone(added_class)
        self.assertEqual(added_class.classname, cl_data['classname'])
        self.assertEqual(added_class.iconurl, cl_data['iconurl'])

    def test_remove_class(self):
        cl_data = {'classname': 'Test Class', 'iconurl': 'test_icon_url'}
        class_id = self.dao.add_class(cl_data)

        not_removed_class = db.session.query(Class).filter_by(id=class_id).first()
        self.assertIsNone(not_removed_class.removed)

        self.dao.remove_class(class_id)

        removed_class = db.session.query(Class).filter_by(id=class_id).first()
        self.assertIsNotNone(removed_class.removed)

if __name__ == '__main__':
    unittest.main()
