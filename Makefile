APP_CONTAINER = microservices_backend
DB_CONTAINER = rhynel-technical-test-lumen-db-testing-1
FRONTEND_CONTAINER = microservices_frontend

.PHONY: start stop build test test-backend test-frontend frontend-logs backend-logs

start:
	docker compose up -d

build:
	docker compose build

stop:
	docker compose down

bash:
	docker exec -it $(APP_CONTAINER) bash

sql:
	docker exec -it $(DB_CONTAINER) bash

frontend-bash:
	docker exec -it $(FRONTEND_CONTAINER) sh

frontend-logs:
	docker compose logs -f frontend

backend-logs:
	docker compose logs -f backend

test-backend:
	docker exec $(APP_CONTAINER) ./vendor/bin/phpunit

test-frontend:
	docker exec $(FRONTEND_CONTAINER) npm run test:unit

test: test-backend test-frontend