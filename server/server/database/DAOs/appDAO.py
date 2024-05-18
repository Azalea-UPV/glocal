from ..database import db, Point, Class, Config

class AppDAO:
    def get_appinfo(self):
        points = [(point.latitude, point.longitude) for point in db.session.query(Point).all()]
        classes = {x.id: {'id': x.id, 'classname': x.classname, 'iconurl': x.iconurl} for x in db.session.query(Class).filter(Class.removed.is_(None))}
        config = self.get_config()
        return {"points": points, "classes": classes, "config": config}

    def set_points(self, points):
        assert len(points) >= 3
        for point in points:
            assert len(point) == 2

        db.session.query(Point).delete()
        db.session.commit()

        for point in points:
            new_point = Point(latitude=point[0], longitude=point[1])
            db.session.add(new_point)

        db.session.commit()
        return True
    
    def add_class(self, cl):
        new_class = Class(classname=cl['classname'], iconurl=cl['iconurl'])
        db.session.add(new_class)
        db.session.commit()
        return new_class.id

    def remove_class(self, cl_id):
        cl = db.session.query(Class).filter_by(id=cl_id)
        cl.update({Class.removed: db.func.current_timestamp()})
        db.session.commit()

    def set_can_comment(self, can_comment):
        config_row = db.session.query(Config).first()
        config_row.can_comment = can_comment
        db.session.commit()

    def set_can_open_incidences(self, can_open_incidences):
        config_row = db.session.query(Config).first()
        config_row.can_open_incidences = can_open_incidences
        db.session.commit()

    def get_config(self):
        config_row = db.session.query(Config).first()
        return {
            "can_open_incidences": config_row.can_open_incidences,
            "can_comment": config_row.can_comment
        }

    def init_config(self):
        config_row = db.session.query(Config).first()

        if config_row is None:
            default_config = Config(can_open_incidences=True, can_comment=True)
            db.session.add(default_config)
            db.session.commit()

