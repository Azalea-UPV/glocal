import unittest
from unittest.mock import patch
from server import app
from server.database import AppDAO, IncidenceDAO, UserDAO
from server.database.database import db
import time

class TestIncidenceRoutes(unittest.TestCase):
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

    def test_get_incidences(self):
        with patch.object(IncidenceDAO, 'get_incidences', return_value=[{"id": 1, "coordinates": [0,0]}, {"id": 2, "coordinates": [100,100]}]), \
                patch.object(AppDAO, 'get_appinfo', return_value={"points": [(1, 1), (1, -1), (-1, 1), (-1, -1)]}):
            response = self.client.get('/incidence')

        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data, {"incidences": [{"id": 1, "coordinates": [0,0]}]})

    def test_get_incidence(self):
        incidence = {
            "id": 1,
            "timestamp": time.time(),
            "short_description": "short description",
            "long_description": "long description",
            "user": "user",
            "address": "address",
            "likes": 10
        }
        with patch.object(IncidenceDAO, 'get_incidence', return_value=incidence):
            response = self.client.get('/incidence?id=1')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data, incidence)

        with patch.object(IncidenceDAO, 'get_incidence', return_value=None):
            response = self.client.get('/incidence?id=1')
        self.assertEqual(response.status_code, 404)

    def test_add_incidence(self):
        response = self.client.post('/incidence', json={"short_description": "short description", "long_description": "long description", "coordinates": [0.5, 0.5]})
        self.assertEqual(response.status_code, 403)

        with self.client.session_transaction() as sess:
            sess['user'] = {"id": 1}

        with patch.object(AppDAO, 'get_appinfo', return_value={"points": [(1, 1), (1, -1), (-1, 1), (-1, -1)]}):
            response = self.client.post('/incidence', json={"short_description": "short description", "long_description": "long description", "coordinates": [0.5, 0.5]})
            self.assertEqual(response.status_code, 200)
            
            response = self.client.post('/incidence', json={"short_description": "short description", "long_description": "long description", "coordinates": [100, 100]})
            self.assertEqual(response.status_code, 400)

            response = self.client.post('/incidence', json={"short_description": "", "long_description": "long description", "coordinates": [0.5, 0.5]})
            self.assertEqual(response.status_code, 400)

            response = self.client.post('/incidence', json={"long_description": "long description", "coordinates": [0.5, 0.5]})
            self.assertEqual(response.status_code, 400)

            response = self.client.post('/incidence', json={"short_description": "short description", "long_description": "", "coordinates": [0.5, 0.5]})
            self.assertEqual(response.status_code, 400)
        
            response = self.client.post('/incidence', json={"short_description": "short description", "coordinates": [100, 100]})
            self.assertEqual(response.status_code, 400)

            response = self.client.post('/incidence', json={"short_description": "short description", "long_description": "long description", "coordinates": [0.5]})
            self.assertEqual(response.status_code, 400)

            response = self.client.post('/incidence', json={"short_description": "short description", "long_description": "long description"})
            self.assertEqual(response.status_code, 400)

    def test_remove_incidence(self):
        response = self.client.delete('/incidence', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 403)

        with self.client.session_transaction() as sess:
            sess['user'] = {"id": 1}

        response = self.client.delete('/incidence', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 403)

        with patch.object(IncidenceDAO, 'close_incidence', return_value=True), \
                patch.object(UserDAO, 'is_mod', return_value=True):
            response = self.client.delete('/incidence', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 200)

        with patch.object(IncidenceDAO, 'close_incidence', return_value=True), \
                patch.object(UserDAO, 'is_admin', return_value=True):
            response = self.client.delete('/incidence', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 200)

class TestLikeRoute(unittest.TestCase):
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

    def test_like(self):
        response = self.client.post('/like', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 403)

        with self.client.session_transaction() as sess:
            sess['user'] = {"id": 1}

        with patch.object(IncidenceDAO, 'like', return_value=True):
            response = self.client.post('/like', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 200)

        with patch.object(IncidenceDAO, 'like', return_value=None):
            response = self.client.post('/like', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 404)

        with patch.object(IncidenceDAO, 'like', return_value=False):
            response = self.client.post('/like', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 500)

    def test_unlike(self):
        response = self.client.delete('/like', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 403)

        with self.client.session_transaction() as sess:
            sess['user'] = {"id": 1}

        with patch.object(IncidenceDAO, 'unlike', return_value=True):
            response = self.client.delete('/like', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 200)

        with patch.object(IncidenceDAO, 'unlike', return_value=None):
            response = self.client.delete('/like', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 404)

        with patch.object(IncidenceDAO, 'unlike', return_value=False):
            response = self.client.delete('/like', json={"incidenceid": 1})
        self.assertEqual(response.status_code, 500)

class TestCommentRoute(unittest.TestCase):
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

    def test_add_comment(self):
        response = self.client.post('/comment', json={"incidenceid": 1, "text": "text"})
        self.assertEqual(response.status_code, 403)

        with self.client.session_transaction() as sess:
            sess['user'] = {"id": 1}

        with patch.object(IncidenceDAO, 'add_comment', return_value=1):
            response = self.client.post('/comment', json={"incidenceid": 1, "text": "text"})
        self.assertEqual(response.status_code, 200)
    
        with patch.object(IncidenceDAO, 'add_comment', return_value=1):
            response = self.client.post('/comment', json={"text": "text"})
            self.assertEqual(response.status_code, 400)

            response = self.client.post('/comment', json={"incidenceid": 1})
            self.assertEqual(response.status_code, 400)

            response = self.client.post('/comment', json={"incidenceid": 1, "text": ""})
            self.assertEqual(response.status_code, 400)

        with patch.object(IncidenceDAO, 'add_comment', return_value=None):
            response = self.client.post('/comment', json={"incidenceid": 1, "text": "text"})
        self.assertEqual(response.status_code, 404)

    def test_remove_comment(self):
        response = self.client.delete('/comment', json={"commentid": 1})
        self.assertEqual(response.status_code, 403)

        with self.client.session_transaction() as sess:
            sess['user'] = {"id": 1}

        with patch.object(UserDAO, 'is_mod', return_value=False):
            response = self.client.delete('/comment', json={"commentid": 1})
        self.assertEqual(response.status_code, 403)

        with patch.object(UserDAO, 'is_mod', return_value=True), patch.object(IncidenceDAO, 'remove_comment', return_value=True):
            response = self.client.delete('/comment', json={"commentid": 1})
        self.assertEqual(response.status_code, 200)

        with patch.object(UserDAO, 'is_mod', return_value=True), patch.object(IncidenceDAO, 'remove_comment', return_value=None):
            response = self.client.delete('/comment', json={"commentid": 1})
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()
