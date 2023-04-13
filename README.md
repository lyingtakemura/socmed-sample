[![main](https://github.com/lyingtakemura/socmed-sample/actions/workflows/main.yaml/badge.svg)](https://github.com/lyingtakemura/socmed-sample/actions/workflows/main.yaml)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)

```
poetry shell
poetry install
poetry update

black . --verbose --diff --exclude /migrations/
flake8 .
bandit .

manage.py seed

docker:
pip freeze > requirements.txt (dependency list for docker)
sudo rm -rf volumes (remove previous docker images state on rebuild, will block compose up otherwise)
docker compose up

![login](screenshots/00_login.png)
![posts](screenshots/01_posts.png)
![messenger](screenshots/02_messenger.png)
![users](screenshots/03_users.png)
![drf_posts](screenshots/04_drf_posts.png)
![drf_rooms](screenshots/05_drf_rooms.png)
```
