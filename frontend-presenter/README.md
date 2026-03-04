# Quiz platform presenter frontend

## How to build the docker container

```
docker build --platform linux/amd64 --no-cache -t quiz-frontend-presenter .
docker tag quiz-frontend-presenter docker.bluecherry.io:5050/quiz-frontend-presenter
docker push docker.bluecherry.io:5050/quiz-frontend-presenter
```

## How to deploy the docker container

```
docker pull docker.bluecherry.io:5050/quiz-frontend-presenter
docker run -d -p 8082:80 --restart=always --name quiz-frontend-presenter docker.bluecherry.io:5050/quiz-frontend-presenter
```