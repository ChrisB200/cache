FROM continuumio/miniconda3:latest

WORKDIR /app

COPY . .

COPY environment.yml /app/

RUN conda env create -f environment.yml
RUN echo "conda activate $(head -1 environment.yml | cut -d' ' -f2)" >> ~/.bashrc

EXPOSE 8080

