from flask import Flask, jsonify, request, render_template, send_file, send_from_directory
import os

template_dir = os.path.abspath('../client')
app = Flask(__name__, template_folder=template_dir)


@app.route('/')
def home():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)