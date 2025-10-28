# Quiz platform player frontend

## How to build the docker container

```
docker build --platform linux/amd64 --no-cache -t quiz-frontend-player .
docker tag quiz-frontend-player registry.hub.docker.com/quiz-frontend-player
docker push registry.hub.docker.com/quiz-frontend-player
```

## How to deploy the docker container

```
docker pull registry.hub.docker.com/quiz-frontend-player
docker run -d -p 8080:80 --restart=always --name quiz-frontend-player registry.hub.docker.com/quiz-frontend-player
```