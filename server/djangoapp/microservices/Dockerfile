FROM python:3.12-slim

ENV PYTHONBUFFERED=1
WORKDIR /app

COPY requirements.txt /app
RUN pip3 install --no-cache-dir -r requirements.txt
RUN python -c "import nltk; nltk.download('vader_lexicon')"

COPY . /app

EXPOSE 5050

ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:5050", "sentiment_analyzer:app"]
