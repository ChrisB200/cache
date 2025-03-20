FROM python:3.12-slim

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock /app/

RUN poetry install --no-root

COPY . /app/

EXPOSE 8000

CMD ["bash", "-c", "source ~/.bashrc && poetry run gunicorn -w 4 -b 0.0.0.0:8000 app:app"]


