start_db:
	docker compose up -d

stop_db:
	docker compose down

migrate:
	npx db-migrate up

migrate-down:
	npx db-migrate down

create_migration:
	npx db-migrate create $(n) --sql-file

.PHONY: start_db stop_db migrate migrate-down create_migration