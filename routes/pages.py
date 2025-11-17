"""Page routes for rendering HTML templates"""
from flask import Blueprint, render_template

pages_bp = Blueprint('pages', __name__)


@pages_bp.route('/')
def index():
    return render_template('index.html')


@pages_bp.route('/analyze')
def analyze():
    return render_template('analyze.html')


@pages_bp.route('/settings')
def settings():
    return render_template('settings.html')

