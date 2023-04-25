[![main](https://github.com/lyingtakemura/socmed-sample/actions/workflows/main.yaml/badge.svg)](https://github.com/lyingtakemura/socmed-sample/actions/workflows/main.yaml)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)
### PROJECT SUMMARY
```
Social media project with ability to send personal messages, make posts and follow users
```
### BUILT WITH
```
- Backend:
django/drf/django-channels
signup with djoser
one-to-one chat - django-channels
views - genericViewSet with mixins
filtering, pagination
custom manage.py command to seed db with faker
linter – flake8, formatter - black
docker compose
- Frontend:
reactjs, tailwind css, axios, redux, redux-persist
```
### SETUP
```
cp .example.env .env && nano .env

poetry shell
poetry install && ./manage.py seed && ./manage.py runserver

cd frontend && npm install && npm start
```
### META
```
pip freeze > requirements.txt (dependency list for docker)
rm -rf volumes (previous docker image state will block compose up)

black . --verbose --diff --exclude /migrations/
flake8 .
bandit .

docker compose up

psql://username:password@host:port/db
```