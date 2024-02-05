FROM continuumio/miniconda3:latest

# Install Tesseract dependencies
RUN apt-get update && \
    apt-get -qq -y install tesseract-ocr && \
    apt-get -qq -y install libtesseract-dev

WORKDIR /app

# Copy backend files
COPY . .

# Copy environment.yml file
COPY environment.yml /app/

# Create and activate Conda environment
RUN conda env create -f environment.yml
RUN echo "conda activate $(head -1 environment.yml | cut -d' ' -f2)" >> ~/.bashrc

# Expose only Flask port
EXPOSE 8000

# Start gunicorn
CMD ["bash", "-c", "source ~/.bashrc && gunicorn -w 4 -b 0.0.0.0:8000 app:app"]

