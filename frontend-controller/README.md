# Quiz platform player frontend

## How to build the docker container

```
docker build --platform linux/amd64 --no-cache -t quiz-frontend-controller .
docker tag quiz-frontend-controller registry.hub.docker.com/quiz-frontend-controller
docker push registry.hub.docker.com/quiz-frontend-controller
```

## How to deploy the docker container

```
docker pull registry.hub.docker.com/quiz-frontend-controller
docker run -d -p 8081:80 --restart=always --name quiz-frontend-controller registry.hub.docker.com/quiz-frontend-controller
```