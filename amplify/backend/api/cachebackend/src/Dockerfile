FROM python:3.12.1-slim-buster

# Install Tesseract dependencies
RUN apt-get update && \
    apt-get -qq -y install tesseract-ocr && \
    apt-get -qq -y install libtesseract-dev

WORKDIR /app

# Copy backend files
COPY . .

# Copy Pipfile and Pipfile.lock
COPY Pipfile* /app/

# Install Pipenv
RUN pip install pipenv
RUN pip install gunicorn

ENV PIPENV_VENV_IN_PROJECT=1

# Install backend dependencies
RUN pipenv install --system

# Expose only flask port
EXPOSE 8000

# Start gunicorn
CMD ["pipenv", "run", "gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
