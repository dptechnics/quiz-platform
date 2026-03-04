# Quiz platform player frontend

## How to build the docker container

```
docker build --platform linux/amd64 --no-cache -t quiz-frontend-player .
docker tag quiz-frontend-player docker.bluecherry.io:5050/quiz-frontend-player
docker push docker.bluecherry.io:5050/quiz-frontend-player
```

## How to deploy the docker container

```
docker pull docker.bluecherry.io:5050/quiz-frontend-player
docker run -d -p 8080:80 --restart=always --name quiz-frontend-player docker.bluecherry.io:5050/quiz-frontend-player
```