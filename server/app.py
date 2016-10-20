from flask import Flask, render_template
from views.route_api import route_api

app = Flask(__name__)

app.register_blueprint(route_api)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
