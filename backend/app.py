from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_restful import Resource, Api,  fields, marshal_with, reqparse
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from datetime import timedelta
from flask_cors import CORS

from applications.models import db, User
from applications.validations import *

app = Flask(__name__, template_folder="templates")
app.config['SECRET_KEY'] = "21f1005523"
app.config["JWT_SECRET_KEY"] ="21f1005523"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Company_details.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
api = Api(app)
app.app_context().push()
CORS(app)
jwt = JWTManager(app)

output_fields = {
    "username": fields.String,
    "password": fields.String,
    "accessToken": fields.String
}

login_user_parser = reqparse.RequestParser()
login_user_parser.add_argument('email')
login_user_parser.add_argument('pwd')

class LoginAPI(Resource):
    @marshal_with(output_fields)
    def post(self, email, pwd):
        args = login_user_parser.parse_args()
        email = args.get("email", None)
        pwd = args.get("pwd", None)

        if email is None:
            raise BusinessValidationError(status_code=400, error_code="BE1001", error_message="Email is Required")

        if pwd is None:
            raise BusinessValidationError(status_code=400, error_code="BE1002", error_message="Password is Required")
        
        user = db.session.query(User).filter(User.email==email).first()
        print(user)
        if user:
            if pwd == user.password:
                access_token = create_access_token(identity=email)
                user.accessToken = access_token
                db.session.commit()
            else:
                raise BusinessValidationError(status_code=400, error_code="BE0001", error_message="Incorrect Password")
        else:
            raise NotFoundError(status_code=404)
        
        user = db.session.query(User).filter(User.email==email).first()
        return user, 200


create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument('email')
create_user_parser.add_argument('pwd')

class SignupAPI(Resource):
    def post(self):
        args = create_user_parser.parse_args()
        email = args.get("email", None)
        password = args.get("pwd", None)

        if email is None:
            raise BusinessValidationError(status_code=400, error_code="BE1001", error_message="Email is Required")

        if password is None:
            raise BusinessValidationError(status_code=400, error_code="BE1002", error_message="Password is Required")

        if '@' not in email:
            raise BusinessValidationError(status_code=400, error_code="BE1003", error_message="Invalid email")

        user = db.session.query(User).filter(User.email == email).first()
        if user:
            raise BusinessValidationError(status_code=402, error_code="BE1004", error_message="Duplicate Value")

        uname = ""
        for i in email:
            if i != '@':
                uname += i
            if i == '@':
                break
        
        temp_user = User(email=email, password = password, username=uname, accessToken="a", urole="user")
        db.session.add(temp_user)
        db.session.commit()

        return "Account Created", 200
    

company_data_output = {
    "id": fields.Integer
}

class CompanyDetailsAPI(Resource):
    @jwt_required
    @marshal_with(company_data_output)
    def get(self):
        pass



api.add_resource(LoginAPI, "/api/login")
api.add_resource(SignupAPI, "/api/signup")


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)