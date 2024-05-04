from flask import request, session, Blueprint
from server.database import UserDAO, AppDAO
from server.app import app, is_user_logged

app_blueprint = Blueprint("app", __name__)


@app.route("/appinfo", methods=["GET"])
def appinfo():
    """
    Endpoint to retrieve or update application information.
    GET /appinfo: Retrieves application information.
    """
    appDAO = AppDAO()
    res = appDAO.get_appinfo()
    res["logged"] = is_user_logged()
    if res["logged"] == True:
        user = UserDAO().get_user_by_id(session["user"]["id"])
        if user is None:
            session.clear()
            res["logged"] = False
        else:
            res["user"] = user
    return res


@app.route("/points", methods=["POST"])
def points():
    """
    Endpoint to update points.
    POST /points: create or update app polygon
    """
    appDAO = AppDAO()
    if not is_user_logged() or not UserDAO().is_admin(session["user"]["id"]):
        return {}, 403
    body = request.json
    points = body["points"]
    if appDAO.set_points(points):
        return {"points": points}

@app.route("/class", methods=["POST", "DELETE"])
def classes():
    """
    Endpoint to manage classes.
    POST /class: create a new class
    DELETE /class: removes existing class
    """
    if not is_user_logged() or not UserDAO().is_admin(session["user"]["id"]):
        return {}, 403
    if request.method == "POST":
        json_args = request.get_json()
        classname = json_args.get("classname")
        iconUrl = json_args.get("iconurl")
        if iconUrl is not None and iconUrl.strip() == "":
            iconUrl = None
        if classname is None:
            return {}, 400
        class_id = AppDAO().add_class({'classname': classname, 'iconurl': iconUrl})
        return {'id': class_id}, 200
    if request.method == "DELETE":
        json_args = request.get_json()
        class_id = json_args.get("classid")
        if class_id is None:
            return {}, 400
        AppDAO().remove_class(class_id)
        return {}, 200