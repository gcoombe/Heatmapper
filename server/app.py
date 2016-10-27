from flask import Flask, render_template
from views.route_api import route_api
from api_utils import CustomEncoder

app = Flask(__name__, instance_relative_config=True)
app.config.update(dict(
    MAPBOX_KEY="secret"
))
#Reads from instance/application.cfg
app.config.from_pyfile('application.cfg', silent=True)

app.register_blueprint(route_api)
app.json_encoder = CustomEncoder

print(app.config)
@app.route('/')
def index():
    return render_template('index.html', mapbox_key=app.config["MAPBOX_KEY"])

if __name__ == '__main__':
    app.run(debug=True)
