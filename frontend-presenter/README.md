# Quiz platform presenter frontend

## How to build the docker container

```
docker build --platform linux/amd64 --no-cache -t quiz-frontend-presenter .
docker tag quiz-frontend-presenter registry.hub.docker.com/quiz-frontend-presenter
docker push registry.hub.docker.com/quiz-frontend-presenter
```

## How to deploy the docker container

```
docker pull registry.hub.docker.com/quiz-frontend-presenter
docker run -d -p 8082:80 --restart=always --name quiz-frontend-presenter registry.hub.docker.com/quiz-frontend-presenter
```