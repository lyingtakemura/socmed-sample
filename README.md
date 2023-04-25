[![main](https://github.com/lyingtakemura/socmed-sample/actions/workflows/main.yaml/badge.svg)](https://github.com/lyingtakemura/socmed-sample/actions/workflows/main.yaml)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)

###### SUMMARY
```
Social media project with  ability to follow users,
make posts and send personal messages.

Django, DRF, Websocket, ReactJS.
Signup with djoser, one-to-one chat using django-channels.
Ability to follow users.
Views - genericViewSet with mixins.
Filtering, pagination.
Custom manage.py command to seed db with faker.
Linter – flake8, formatter - black.
Docker compose.
```
###### LOCALHOST
```
poetry shell
poetry install
poetry update

black . --verbose --diff --exclude /migrations/
flake8 .
bandit .

manage.py seed
```
###### DOCKER
```
pip freeze > requirements.txt (dependency list for docker)
rm -rf volumes (previous docker image state will block compose up)
docker compose up
```
![](docs/images/00_login.png)
![](docs/images/01_posts.png)
![](docs/images/02_messenger.png)
![](docs/images/03_users.png)
![](docs/images/04_drf_posts.png)
![](docs/images/05_drf_rooms.png)