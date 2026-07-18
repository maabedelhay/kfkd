.PHONY: all start stop restart build \
        backend-build backend-start backend-stop backend-restart \
        frontend-start frontend-stop frontend-restart


BACKEND_BIN_CMD   := ./main
BACKEND_BIN   := main
BACKEND_DIR   := ./backend/main.go
FRONTEND_DIR  := ./frontend


BACKEND_PID   := .backend.pid
FRONTEND_PID  := .frontend.pid


all: build start

start: backend-start frontend-start

stop: backend-stop frontend-stop

restart: backend-restart frontend-restart

build: backend-build

rebuild: backend-stop backend-build


backend-build:
	@echo "→ building backend…"
	@go build -o $(BACKEND_BIN) $(BACKEND_DIR)
	@echo "✓ backend built"

backend-start: backend-build
	@if [ -f $(BACKEND_PID) ] && kill -0 $$(cat $(BACKEND_PID)) 2>/dev/null; then \
		echo "backend already running (pid $$(cat $(BACKEND_PID)))"; \
	else \
		$(BACKEND_BIN_CMD) >> .backend.log 2>&1 & echo $$! > $(BACKEND_PID); \
		echo "✓ backend started (pid $$(cat $(BACKEND_PID)))"; \
	fi

backend-stop:
	@if [ -f $(BACKEND_PID) ] && kill -0 $$(cat $(BACKEND_PID)) 2>/dev/null; then \
		kill $$(cat $(BACKEND_PID)) && rm -f $(BACKEND_PID); \
		echo "✓ backend stopped"; \
	else \
		echo "backend not running"; \
		rm -f $(BACKEND_PID); \
	fi

backend-restart: backend-stop backend-start


frontend-start:
	@if [ -f $(FRONTEND_PID) ] && kill -0 $$(cat $(FRONTEND_PID)) 2>/dev/null; then \
		echo "frontend already running (pid $$(cat $(FRONTEND_PID)))"; \
	else \
		cd $(FRONTEND_DIR) && pnpm dev >> ../.frontend.log 2>&1 & echo $$! > ../$(FRONTEND_PID); \
		echo "✓ frontend started (pid $$(cat $(FRONTEND_PID)))"; \
	fi

frontend-stop:
	@if [ -f $(FRONTEND_PID) ] && kill -0 $$(cat $(FRONTEND_PID)) 2>/dev/null; then \
		kill $$(cat $(FRONTEND_PID)) && rm -f $(FRONTEND_PID); \
		echo "✓ frontend stopped"; \
	else \
		echo "frontend not running"; \
		rm -f $(FRONTEND_PID); \
	fi

frontend-restart: frontend-stop frontend-start


logs-backend:
	@tail -f .backend.log

logs-frontend:
	@tail -f .frontend.log

status:
	@if [ -f $(BACKEND_PID) ] && kill -0 $$(cat $(BACKEND_PID)) 2>/dev/null; then \
		echo "backend:  running (pid $$(cat $(BACKEND_PID)))"; \
	else \
		echo "backend:  stopped"; \
	fi
	@if [ -f $(FRONTEND_PID) ] && kill -0 $$(cat $(FRONTEND_PID)) 2>/dev/null; then \
		echo "frontend: running (pid $$(cat $(FRONTEND_PID)))"; \
	else \
		echo "frontend: stopped"; \
	fi