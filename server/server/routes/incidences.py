from flask import request, session, Blueprint
from server.database import IncidenceDAO, UserDAO, AppDAO
from server.utils import is_point_inside_polygon
from server.app import app, is_user_logged

incidences_blueprint = Blueprint("incidence", __name__)


@app.route("/incidence", methods=["GET", "POST", "DELETE"])
def incidence():
    """
    Endpoint to handle GET, POST, and DELETE requests related to incidences.
    GET /incidence: Retrieves incidences or a specific incidence by ID.
    POST /incidence: Adds a new incidence.
    DELETE /incidence: Deletes an incidence by ID.
    """
    incidenceDAO = IncidenceDAO()
    if request.method == "GET":
        incidence_id = request.args.get("id")
        if incidence_id is not None:
            incidence = incidenceDAO.get_incidence(incidence_id)
            if incidence is None:
                return {"error": "not_exists_incidence"}, 404
            incidence["comments"] = incidenceDAO.get_comments(incidence_id)
            incidence["liked"] = False
            if is_user_logged():
                incidence["liked"] = incidenceDAO.is_liked(
                    session["user"]["id"], incidence_id
                )
            return incidence, 200
        else:
            incidences = incidenceDAO.get_incidences()
            app_points = AppDAO().get_appinfo()["points"]
            incidences = [
                incidence
                for incidence in incidences
                if is_point_inside_polygon(incidence["coordinates"], app_points)
            ]
            return {"incidences": incidences}, 200

    elif request.method == "POST":
        if not is_user_logged():
            return {}, 403

        if not AppDAO().get_appinfo()["config"]["can_open_incidences"] and not UserDAO().is_admin(session["user"]["id"]):
            return {}, 403

        json_args = request.get_json()
        short_description = json_args.get("short_description")
        long_description = json_args.get("long_description")
        coordinates = json_args.get("coordinates")
        kind = json_args.get("class")

        if coordinates is None or len(coordinates) != 2:
            return {"error": "wrong_coordinates"}, 400
        if not is_point_inside_polygon(coordinates, AppDAO().get_appinfo()["points"]):
            return {"error": "outside_limits"}, 400
        if short_description is None or short_description.strip() == "":
            return {"error": "no_short_description"}, 400
        if long_description is None or long_description.strip() == "":
            return {"error": "no_long_description"}, 400

        added = incidenceDAO.add_incidence(
            session["user"]["id"],
            short_description,
            long_description,
            coordinates[0],
            coordinates[1],
            kind,
        )
        if added:
            return {}, 200
        else:
            return {}, 500

    elif request.method == "DELETE":
        if not is_user_logged() or (
            not UserDAO().is_admin(session["user"]["id"])
            and not UserDAO().is_mod(session["user"]["id"])
        ):
            return {}, 403

        json_args = request.get_json()
        incidenceid = json_args.get("incidenceid")

        if incidenceid is None:
            return {"error": "no_incidenceid"}, 400

        result = incidenceDAO.close_incidence(incidenceid, session["user"]["id"])
        if result is None:
            return {"error": "incidence_not_found"}, 404
        else:
            return {}, 200


@app.route("/like", methods=["POST", "DELETE"])
def like():
    """
    Endpoint to handle liking or unliking incidences.
    POST /like: Likes an incidence.
    DELETE /like: Unlikes an incidence.
    """
    if not is_user_logged():
        return {}, 403
    json_args = request.get_json()
    incidenceid = json_args.get("incidenceid")
    if incidenceid is None:
        return {}, 400

    userid = session["user"]["id"]
    if request.method == "POST":
        liked = IncidenceDAO().like(incidenceid, userid)
        if liked is None:
            return {"error": "incidence_not_found"}, 404
        elif liked:
            return {}, 200
        else:
            return {}, 500
    elif request.method == "DELETE":
        unliked = IncidenceDAO().unlike(incidenceid, userid)
        if unliked is None:
            return {"error": "incidence_not_found"}, 404
        elif unliked:
            return {}, 200
        else:
            return {}, 500

    return {}, 500


@app.route("/comment", methods=["POST", "DELETE"])
def comment():
    """
    Endpoint to handle adding and deleting comments on incidences.
    POST /comment: Adds a comment to an incidence.
    DELETE /comment: Deletes a comment from an incidence.
    """
    if request.method == "POST":
        if not is_user_logged():
            return {}, 403
        if not AppDAO().get_appinfo()["config"]["can_comment"] and not UserDAO().is_admin(session["user"]["id"]):
            return {}, 403

        json_args = request.get_json()

        text = json_args.get("text")
        incidenceid = json_args.get("incidenceid")
        userid = session["user"]["id"]

        if incidenceid is None or text is None or text.strip() == "":
            return {}, 400

        commentid = IncidenceDAO().add_comment(userid, incidenceid, text)

        if commentid == None:
            return {"error": "incidence_not_found"}, 404
        else:
            return {"commentid": commentid}, 200

    elif request.method == "DELETE":
        if not is_user_logged() or (
            not UserDAO().is_admin(session["user"]["id"])
            and not UserDAO().is_mod(session["user"]["id"])
        ):
            return {}, 403

        json_args = request.get_json()

        commentid = json_args.get("commentid")

        if commentid is None:
            return {}, 400

        removed = IncidenceDAO().remove_comment(commentid, session["user"]["id"])
        if removed is None:
            return {"error": "comment_not_found"}, 404
        elif removed:
            return {}, 200
