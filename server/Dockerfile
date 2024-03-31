FROM python:latest

WORKDIR /app
ADD . /app/
RUN python -m pip install --upgrade pip && python -m pip install -r requirements.txt
CMD gunicorn -w 4 -b 0.0.0.0:5000 app:app
EXPOSE 5000