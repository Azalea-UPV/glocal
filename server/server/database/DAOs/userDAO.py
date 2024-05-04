from ..database import db, User
import bcrypt

class UserDAO:
    def add_user(self, username, email, password):
        user_with_email = db.session.query(User).filter_by(email=email).first()
        if user_with_email:
            return False

        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return True

    def check_password(self, email, password):
        user = db.session.query(User).filter_by(email=email).first()
        if not user:
            return False
        hashed_password = user.password
        return bcrypt.checkpw(password.encode(), hashed_password)

    def is_admin(self, id):
        user = db.session.get(User, id)
        if not user:
            return False
        return user.is_admin

    def is_mod(self, id):
        user = db.session.get(User, id)
        if not user:
            return False
        return user.is_mod

    def set_mod(self, userid, is_mod):
        user = db.session.get(User, userid)
        if not user:
            return None
        user.is_mod = is_mod
        db.session.commit()
        return True

    def get_user_by_mail(self, mail):
        user = db.session.query(User).filter_by(email=mail).first()
        if user:
            return UserDAO.to_dict(user)
        else:
            return None

    def get_user_by_id(self, id):
        user = db.session.get(User, id)
        if user:
            return UserDAO.to_dict(user)
        else:
            return None
    
    def get_all_users(self):
        users = db.session.query(User).all()
        return [UserDAO.to_dict(x) for x in users]

    def to_dict(user):
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "is_admin": user.is_admin,
            "is_mod": user.is_mod,
        }