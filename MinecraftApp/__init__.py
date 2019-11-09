from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://yoda:theforce@0.0.0.0:27017/minecraftapp"
mongo = PyMongo(app)

from . import routes
