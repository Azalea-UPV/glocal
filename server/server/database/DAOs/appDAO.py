from ..database import db, AppInfo, Point
import datetime

class AppDAO:
    def get_appinfo(self):
        latest_appinfo = db.session.query(AppInfo).order_by(AppInfo.timestamp.desc()).first()
        if not latest_appinfo:
            return {"points": []}

        points = [(point.latitude, point.longitude) for point in latest_appinfo.points]
        return {"points": points}

    def set_appinfo(self, points):
        assert len(points) >= 3
        for point in points:
            assert len(point) == 2

        new_appinfo = AppInfo(timestamp=datetime.datetime.now())
        db.session.add(new_appinfo)
        db.session.flush()

        for point in points:
            new_point = Point(appinfoid=new_appinfo.id, latitude=point[0], longitude=point[1])
            db.session.add(new_point)

        db.session.commit()
        return True
