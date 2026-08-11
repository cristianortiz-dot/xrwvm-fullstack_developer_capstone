"""
Microservicio de Análisis de Sentimientos.

Usa NLTK (VADER) para determinar si el texto de una reseña es
positivo, negativo o neutral. Se expone como una app Flask
independiente para ser desplegada como microservicio (Docker /
IBM Code Engine / Google Cloud Run).

Endpoint:
    GET /analyze/<text>  -> {"sentiment": "positive|neutral|negative"}
"""
from flask import Flask, jsonify
from flask_cors import CORS
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

nltk.download('vader_lexicon', quiet=True)

app = Flask(__name__)
CORS(app)

analyzer = SentimentIntensityAnalyzer()


@app.route('/')
def index():
    return jsonify({"status": "ok", "service": "sentiment-analyzer"})


@app.route('/analyze/<text>')
def analyze(text):
    scores = analyzer.polarity_scores(text)
    compound = scores['compound']
    if compound >= 0.05:
        sentiment = 'positive'
    elif compound <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    return jsonify({"sentiment": sentiment})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=False)
