[![main](https://github.com/lyingtakemura/socmed-sample/actions/workflows/main.yaml/badge.svg)](https://github.com/lyingtakemura/socmed-sample/actions/workflows/main.yaml)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)
![GitHub repo size](https://img.shields.io/github/repo-size/lyingtakemura/socmed-sample)
![GitHub issues](https://img.shields.io/github/issues/lyingtakemura/socmed-sample)

### PROJECT SUMMARY

```
Social media project with ability to send personal messages, make posts and follow users
```

### BUILT WITH

```
- Backend:
Django, Django REST Framework
Signup with Djoser
Django Channels for one-to-one chats
Views - genericViewSet with mixins
Filtering, pagination
Custom manage.py command to seed db with faker
Linter – flake8, formatter - black
Docker compose

- Frontend:
ReactJS, React Router, Redux, Redux Persist, Axios, Tailwind CSS
```

### SETUP

```
cp .example.env .env && nano .env

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
./manage.py seed
./manage.py runserver

cd frontend && npm install && npm start
```

### META

```
pip freeze > requirements.txt
rm -rf volumes (previous docker image state will block compose up)

black . --verbose --diff --exclude /migrations/
flake8 .
bandit .

docker compose up

psql://username:password@host:port/db
```
