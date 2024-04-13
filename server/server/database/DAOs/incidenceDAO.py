from server.database.database import db, Incidence, Like, Comment
import datetime
from sqlalchemy import desc
import requests


def get_address(latitude, longitude):
    address = ""
    try:
        req = requests.get(
            "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={}&lon={}".format(
                latitude, longitude
            )
        ).json()
        address = ", ".join(
            [
                req["address"]["road"],
                req["address"]["neighbourhood"],
                req["address"]["suburb"],
                req["address"]["city"],
            ]
        )
    except Exception:
        pass

    return address


class IncidenceDAO:
    def add_incidence(self, userid, short_description, long_description, latitude, longitude, kind):
        address = get_address(latitude, longitude)
        incidence = Incidence(
            creation_user_id=userid,
            short_description=short_description,
            long_description=long_description,
            address=address,
            latitude=latitude,
            longitude=longitude,
            kind=kind
        )
        db.session.add(incidence)
        db.session.commit()
        return True

    def get_incidences(self):
        data = db.session.query(Incidence).filter(Incidence.closed.is_(None)).all()
        return [IncidenceDAO.to_short_dict(x) for x in data]

    def get_incidence(self, incidence_id):
        incidence = db.session.get(Incidence, incidence_id)
        if incidence:
            return IncidenceDAO.to_dict(incidence)
        else:
            return None

    def close_incidence(self, incidence_id, user_id):
        incidence =  db.session.get(Incidence, incidence_id)
        if incidence is None:
            return None

        incidence.closed = datetime.datetime.now()
        incidence.closed_by_id = user_id

        db.session.commit()

        return True

    def like(self, incidence_id, user_id):
        incidence = db.session.get(Incidence, incidence_id)
        if incidence is None:
            return None
          
        like = Like.query.filter_by(userid=user_id, incidenceid=incidence_id).first()
        if like is None:
            like = Like(userid=user_id, incidenceid=incidence_id)
            db.session.add(like)
            db.session.commit()
            return True
        
        return False  

    def unlike(self, incidence_id, user_id):
        incidence = db.session.get(Incidence, incidence_id)
        if incidence is None:
            return None

        like = Like.query.filter_by(userid=user_id, incidenceid=incidence_id).first()
        if like:
            db.session.delete(like)
            db.session.commit()
            return True
        
        return False

    def is_liked(self, user_id, incidence_id):
        like = db.session.query(Like).filter_by(userid=user_id, incidenceid=incidence_id).first()
        return like is not None

    def get_comments(self, incidence_id):
        comments = db.session.query(Comment).filter_by(incidenceid=incidence_id).filter(Comment.removed.is_(None)).order_by(desc(Comment.timestamp)).all()
        
        if comments is None:
            return None

        return [
            {
                "id": comment.id,
                "user": comment.user.username,
                "text": comment.text,
                "timestamp": comment.timestamp,  # Añadir el timestamp si lo necesitas
            }
            for comment in comments
        ]

    def remove_comment(self, comment_id, user_id):
        comment = db.session.get(Comment, comment_id)
        if comment is None:
            return None

        comment.removed = datetime.datetime.now()
        comment.removed_by_id = user_id
        db.session.commit()

        return True

    def add_comment(self, user_id, incidence_id, text):
        comment = Comment(userid=user_id, incidenceid=incidence_id, text=text)
        db.session.add(comment)
        db.session.commit()
        return comment.id

    def to_dict(incidence):
        return {
            "id": incidence.id,
            "timestamp": incidence.timestamp,
            "short_description": incidence.short_description,
            "long_description": incidence.long_description,
            "user": incidence.creation_user.username,
            "address": incidence.address,
            "likes": len(incidence.likes),
            "class": incidence.kind
        }

    def to_short_dict(incidence):
        return {
            "id": incidence.id,
            "coordinates": (incidence.latitude, incidence.longitude),
            "class": incidence.kind
        }
