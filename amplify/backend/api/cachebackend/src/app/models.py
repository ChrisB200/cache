from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))
    settings_id = db.Column(db.Integer, db.ForeignKey('settings.settings_id'))
    
    # Define the relationship to the Settings model
    settings = db.relationship('Settings', back_populates='user', cascade='all, delete')
    shifts = db.relationship('Shift', back_populates='user', cascade='all, delete')

    # Implement the get_id method
    def get_id(self):
        return str(self.user_id)

class Settings(db.Model):
    settings_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date_format = db.Column(db.String(25), nullable=True)
    pay_frequency = db.Column(db.Integer, nullable=True)
    pay = db.Column(db.Float, nullable=True)
    
    # Define the relationship to the User model
    user = db.relationship('User', back_populates='settings')

class Shift(db.Model):
    shift_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    date = db.Column(db.Date)
    start = db.Column(db.Time)
    finish = db.Column(db.Time)
    rate = db.Column(db.Float)
    
    # Define the relationship to the User model
    user = db.relationship('User', back_populates='shifts')
