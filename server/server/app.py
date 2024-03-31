from server.database.database import db

from flask import Flask, session
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate

import os

app = Flask(__name__)

app.config["SECRET_KEY"] = "zafalea"
app.config["SESSION_TYPE"] = "filesystem"
session_path = os.path.join(os.getcwd(), 'data', 'session_data')
app.config["SESSION_FILE_DIR"] = session_path

db_path = os.path.join(os.getcwd(), "data", "database.sqlite")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////" + db_path
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config.from_object(__name__)

Session(app)
CORS(app, supports_credentials=True)

db.init_app(app)
with app.app_context():
    db.create_all()
Migrate(app, db, render_as_batch=True)


def is_user_logged():
    return "user" in session


from server.routes import incidences_blueprint, app_blueprint, users_blueprint
app.register_blueprint(incidences_blueprint)
app.register_blueprint(app_blueprint)
app.register_blueprint(users_blueprint)
