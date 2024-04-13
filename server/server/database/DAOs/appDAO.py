from ..database import db, Point, Class

class AppDAO:
    def get_appinfo(self):
        points = [(point.latitude, point.longitude) for point in db.session.query(Point).all()]
        classes = [{'id': x.id, 'classname': x.classname, 'iconurl': x.iconurl} for x in db.session.query(Class).all()]
        return {"points": points, "classes": classes}

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
        db.session.query(Class).filter_by(id=cl_id).delete()
        db.session.commit()
