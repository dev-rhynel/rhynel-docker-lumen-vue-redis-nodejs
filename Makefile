APP_CONTAINER = rhynel-technical-test-lumen-1
DB_CONTAINER = rhynel-technical-test-lumen-db-testing-1

start:
	docker compose up -d

build:
	docker buildx build --platform linux/amd64 -t rhynel-technical-test-lumen .

stop:
	docker compose down

bash:
	docker exec -it $(APP_CONTAINER) bash

sql:
	docker exec -it $(DB_CONTAINER) bash

test:
	docker exec $(APP_CONTAINER) php artisan test