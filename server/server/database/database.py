from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Config(db.Model):
    __tablename__ = "config"
    id = db.Column(db.Integer, primary_key=True)
    can_open_incidences = db.Column(db.Boolean, default=True)
    can_comment = db.Column(db.Boolean, default=True)


class Point(db.Model):
    __tablename__ = "points"
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)


class Class(db.Model):
    __tablename__ = "class"
    id = db.Column(db.Integer, primary_key=True)
    classname = db.Column(db.Text)
    iconurl = db.Column(db.Text)
    removed = db.Column(db.DateTime)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    is_mod = db.Column(db.Boolean, default=False, nullable=False)


class Incidence(db.Model):
    __tablename__ = "incidences"
    id = db.Column(db.Integer, primary_key=True)
    creation_user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", name="fk_creation_user_id"),
        nullable=False,
    )
    timestamp = db.Column(
        db.DateTime, default=db.func.current_timestamp(), nullable=False
    )
    short_description = db.Column(db.Text)
    long_description = db.Column(db.Text)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    address = db.Column(db.String(255))
    closed = db.Column(db.DateTime)
    closed_by_id = db.Column(
        db.Integer, db.ForeignKey("users.id", name="fk_closed_by_id")
    )
    class_id = db.Column(db.Integer, db.ForeignKey("class.id"), name="fk_class_id")

    creation_user = db.relationship(
        "User",
        foreign_keys=[creation_user_id],
        backref=db.backref("created_incidences", lazy=True),
    )
    closed_by = db.relationship(
        "User",
        foreign_keys=[closed_by_id],
        backref=db.backref("closed_incidences", lazy=True),
    )
    kind = db.relationship(
        "Class", foreign_keys=[class_id], backref=db.backref("incidences", lazy=True)
    )


class Like(db.Model):
    __tablename__ = "likes"
    userid = db.Column(
        db.Integer, db.ForeignKey("users.id", name="fk_like_user_id"), primary_key=True
    )
    incidenceid = db.Column(
        db.Integer,
        db.ForeignKey("incidences.id", name="fk_like_incidence_id"),
        primary_key=True,
    )
    timestamp = db.Column(
        db.DateTime, default=db.func.current_timestamp(), nullable=False
    )
    user = db.relationship("User", backref=db.backref("likes", lazy=True))
    incidence = db.relationship("Incidence", backref=db.backref("likes", lazy=True))


class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(
        db.Integer, db.ForeignKey("users.id", name="fk_comment_user_id"), nullable=False
    )
    incidenceid = db.Column(
        db.Integer,
        db.ForeignKey("incidences.id", name="fk_comment_incidence_id"),
        nullable=False,
    )
    timestamp = db.Column(
        db.DateTime, default=db.func.current_timestamp(), nullable=False
    )
    text = db.Column(db.Text)
    removed = db.Column(db.DateTime)
    removed_by_id = db.Column(
        db.Integer, db.ForeignKey("users.id", name="fk_comment_removed_by_id")
    )
    user = db.relationship(
        "User", foreign_keys=[userid], backref=db.backref("comments", lazy=True)
    )
    removed_by = db.relationship(
        "User",
        foreign_keys=[removed_by_id],
        backref=db.backref("removed_comments", lazy=True),
    )
    incidence = db.relationship("Incidence", backref=db.backref("comments", lazy=True))
