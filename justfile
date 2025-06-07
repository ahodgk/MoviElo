# Display this help message
help:
  just -l

# Run all linters
lint:
  turbo run lint

db-generate:
  (cd packages/database; yarn generate)

db-migrate:
  (cd packages/database; yarn migrate)

db-mig:
  (cd packages/database; yarn generate; yarn migrate)

docker-web-start:
  printenv; (cd apps/web; yarn docker-start)
  
docker-build-web:
  docker build -f apps/web/Dockerfile -t skincare-genie-web .


docker-build-api:
  docker build -f apps/api/Dockerfile -t skincare-genie-api .


docker-build: docker-build-web

