# Quiz platform backend

## How to build the docker container

```
docker build --platform linux/amd64 --no-cache -t quiz-backend .
docker tag quiz-backend registry.hub.docker.com/quiz-backend
docker push registry.hub.docker.com/quiz-backend
```

## How to deploy the docker container

```
docker pull registry.hub.docker.com/quiz-backend
docker run -d -p 3333:3333 --restart=always --name quiz-backend registry.hub.docker.com/quiz-backend
```