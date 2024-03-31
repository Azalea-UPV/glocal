from flask import request, session, Blueprint
from server.database import UserDAO, AppDAO
from server.app import app, is_user_logged

app_blueprint = Blueprint("app", __name__)


@app.route("/appinfo", methods=["GET", "POST"])
def appinfo():
    """
    Endpoint to retrieve or update application information.
    GET /appinfo: Retrieves application information.
    POST /appinfo: Updates application information (only accessible to admin users).
    """
    appDAO = AppDAO()
    if request.method == "GET":
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
    elif request.method == "POST":
        if not is_user_logged() or not UserDAO().is_admin(session["user"]["id"]):
            return {}, 403

        body = request.json
        points = body["points"]
        if appDAO.set_appinfo(points):
            return {"points": points}
