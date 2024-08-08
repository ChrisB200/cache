from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_login import LoginManager

from app.config import ApplicationConfig
from app.routes import routes
from app.models import db


app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app, supports_credentials=True)

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(routes)

with app.app_context():
    db.drop_all()
    db.create_all()


@app.route("/", methods=["GET"])
def index():
    return "hello"
