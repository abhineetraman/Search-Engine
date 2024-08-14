from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "User"
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)
    username = db.Column(db.String, nullable=False)
    accessToken = db.Column(db.String(255), unique=True, nullable=False)
    urole = db.Column(db.String, nullable=False)
