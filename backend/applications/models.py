from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "User"
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)
    username = db.Column(db.String, nullable=False)
    accessToken = db.Column(db.String(255))

class CompanyDetails(db.Model):
    __tablename__ = "Companydetails"
    id = db.Column(db.Integer, primary_key=True)
    entity = db.Column(db.String, nullable=False)
    sector = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True)
    incorporation = db.Column(db.String, nullable=False)
    address = db.Column(db.String)
    revenue = db.Column(db.float, nullable=False)
    website = db.Column(db.String)
    is_verified = db.Column(db.Integer, nullable=False)