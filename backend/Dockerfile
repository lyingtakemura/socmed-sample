FROM python:alpine3.18

WORKDIR /project/backend

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN pip install poetry
RUN poetry config virtualenvs.create false
COPY . .
RUN poetry install
