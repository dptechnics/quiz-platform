# Quiz platform backend

## How to build the docker container

```
docker build --platform linux/amd64 --no-cache -t quiz-backend .
docker tag docker.bluecherry.io:5050/quiz-backend
docker push docker.bluecherry.io:5050/quiz-backend
```

## How to deploy the docker container

```
docker pull docker.bluecherry.io:5050/quiz-backend
docker run -d -p 3333:3333 --restart=always --name quiz-backend docker.bluecherry.io:5050/quiz-backend
```