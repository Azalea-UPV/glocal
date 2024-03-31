from flask import request, session, Blueprint
from server.database import UserDAO
from server.app import app, is_user_logged
import re

users_blueprint = Blueprint("users", __name__)


@app.route("/mod", methods=["POST", "DELETE"])
def mod():
    """
    Endpoint to toggle moderator status for a user (admin only).
    POST /mod: sets moderator status for a user.
    DELETE /mod: removes moderator status for a user.
    """
    if not is_user_logged() or not UserDAO().is_admin(session["user"]["id"]):
        return {}, 403
    json_args = request.get_json()

    userid = json_args.get("userid")

    if userid is None:
        return {}, 400

    modded = UserDAO().set_mod(userid, request.method == "POST")
    if modded is None:
        return {}, 404
    elif modded:
        return {}, 200
    else:
        return {}, 500


@app.route("/users", methods=["GET"])
def users():
    """
    Endpoint to retrieve all users (admin only).
    GET /users: Retrieves all users.
    """
    if not is_user_logged() or not UserDAO().is_admin(session["user"]["id"]):
        return {}, 403

    return {"users": UserDAO().get_all_users()}, 200


@app.route("/signup", methods=["POST"])
def signup():
    """
    Endpoint to register a new user.
    POST /signup: Registers a new user.
    """
    userDAO = UserDAO()
    json_args = request.get_json()
    user = json_args.get("user", "").strip()
    mail = json_args.get("mail", "").strip()
    password = json_args.get("password", "")

    if mail == None or mail.strip() == "":
        return {"error": "missing_mail"}, 400
    if password == None or password.strip() == "":
        return {"error": "missing_password"}, 400
    if user == None or user.strip() == "":
        return {"error": "missing_user"}, 400

    email_regex = r"^\S+@\S+\.\S+$"
    if not re.match(email_regex, mail):
        return {"error": "invalid_mail"}, 400

    if userDAO.add_user(user, mail, password):
        return {}, 200
    else:
        return {}, 500


@app.route("/login", methods=["POST"])
def login():
    """
    Endpoint to log in an existing user.
    POST /login: Logs in an existing user.
    """
    json_args = request.get_json()
    mail = json_args.get("mail")
    password = json_args.get("password")

    if mail == None or mail.strip() == "":
        return {"error": "missing_mail"}, 400
    if password == None or password.strip() == "":
        return {"error": "missing_password"}, 400

    if UserDAO().check_password(mail, password):
        user = UserDAO().get_user_by_mail(mail)
        session["user"] = user
        return {}, 200
    else:
        return {}, 403


@app.route("/logout", methods=["GET"])
def logout():
    """
    Endpoint to log out the current user.
    GET /logout: Logs out the current user.
    """
    session.clear()
    return {}, 200
