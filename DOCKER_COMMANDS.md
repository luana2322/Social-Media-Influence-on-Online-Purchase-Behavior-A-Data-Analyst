# Docker Commands Cheat Sheet - AI SaaS Platform

## 📦 Build Commands

```bash
# Build all services (from project root)
docker-compose build

# Build a specific service only
docker-compose build backend
docker-compose build ml-service
docker-compose build db

# Rebuild without cache (if dependencies changed)
docker-compose build --no-cache

# Check built images
docker images | grep saas
```

---

## ▶️ Start Commands

```bash
# Start all services (detached mode - runs in background)
docker-compose up -d

# Start all services (attached mode - shows logs in terminal)
docker-compose up

# Start only specific services
docker-compose up -d backend ml-service db

# Recreate containers (if config changed)
docker-compose up -d --force-recreate

# Scale ML service (if needed for load)
docker-compose up -d --scale ml-service=2
```

---

## 🛑 Stop Commands

```bash
# Stop all services (keep containers)
docker-compose stop

# Stop and remove containers (keep volumes)
docker-compose down

# Stop and remove EVERYTHING (containers + volumes + networks)
docker-compose down -v

# Stop a specific service
docker-compose stop backend
```

---

## 📋 View Logs

```bash
# View logs for all services
docker-compose logs

# Follow logs in real-time (like tail -f)
docker-compose logs -f

# View logs for a specific service
docker-compose logs backend
docker-compose logs ml-service
docker-compose logs db

# Follow specific service logs
docker-compose logs -f ml-service

# Last 50 lines only
docker-compose logs --tail=50 backend
```

---

## 🔍 Debugging Tips

### **Check Service Health**
```bash
# Check running containers
docker-compose ps

# Check container health status
docker inspect saas-backend | grep -A 10 Health
docker inspect saas-ml-service | grep -A 10 Health

# Test endpoints from host
curl http://localhost:8080/api/predictions/health
curl http://localhost:8000/health
```

### **Enter Containers (Shell Access)**
```bash
# Enter Spring Boot container
docker exec -it saas-backend /bin/sh

# Enter FastAPI container
docker exec -it saas-ml-service /bin/sh

# Enter PostgreSQL container
docker exec -it saas-db psql -U postgres

# Run command inside container without entering
docker exec saas-ml-service ls -la /app/models/
```

### **Check Networks**
```bash
# Inspect Docker network
docker network inspect saas_platform_app-network

# Test connectivity from backend to ml-service
docker exec saas-backend ping ml-service
docker exec saas-backend curl http://ml-service:8000/health

# Verify env vars in backend
docker exec saas-backend printenv | grep DB
```

### **Check Resource Usage**
```bash
# View container stats (CPU, RAM, Network)
docker stats

# View specific containers
docker stats saas-backend saas-ml-service saas-db
```

---

## 🧹 Cleanup Commands

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove ALL unused Docker resources (containers, images, networks, volumes)
docker system prune -a --volumes

# Remove specific container
docker rm saas-backend

# Remove specific image
docker rmi saas_platform-backend
```

---

## 🚨 Common Fixes

### **Issue: Spring Boot can't connect to DB**
```bash
# Check if DB is healthy
docker inspect saas-db | grep Health

# Check DB logs
docker-compose logs db

# Verify env vars in backend
docker exec saas-backend printenv | grep DB
```

### **Issue: Backend can't reach ml-service**
```bash
# Test internal DNS resolution
docker exec saas-backend nslookup ml-service

# Check ml-service health
docker exec saas-backend curl -v http://ml-service:8000/health

# Verify ML_SERVICE_URL in backend
docker exec saas-backend printenv | grep ML
```

### **Issue: Model file not found in ml-service**
```bash
# Check if models are mounted
docker exec saas-ml-service ls -la /app/models/

# If empty, rebuild with proper COPY in Dockerfile
docker-compose build --no-cache ml-service
```

### **Issue: Port already in use**
```bash
# Find process using port 8080 (macOS/Linux)
lsof -i :8080 | grep LISTEN
kill -9 <PID>

# Or change port in .env
# BACKEND_PORT=8081
```

---

## ✅ Verification Sequence

```bash
# 1. Start everything
docker-compose up -d

# 2. Wait 30 seconds for health checks
sleep 30

# 3. Check all services are healthy
docker-compose ps

# 4. Test endpoints
curl http://localhost:8000/health   # FastAPI
curl http://localhost:8080/api/predictions/health  # Spring Boot

# 5. View logs if something fails
docker-compose logs -f

# 6. Stop when done
docker-compose down
```

---

## 📌 Quick Reference
| Action | Command |
|--------|---------|
| Build | `docker-compose build` |
| Start | `docker-compose up -d` |
| Stop | `docker-compose down` |
| Logs | `docker-compose logs -f` |
| Shell | `docker exec -it <container> /bin/sh` |
| Status | `docker-compose ps` |
| Stats | `docker stats` |
| Clean | `docker system prune -a --volumes` |

---

## 📂 Volume Management

```bash
# Check volumes
docker volume ls | grep saas

# Inspect volume
docker volume inspect saas_platform_postgres_data

# Backup database volume
docker run --rm -v saas_platform_postgres_data:/var/lib/postgresql/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /var/lib/postgresql/data

# Restore database volume
docker run --rm -v saas_platform_postgres_data:/var/lib/postgresql/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

---

## 🔄 Update Services

```bash
# Rebuild and restart a single service after code changes
docker-compose up -d --force-recreate --no-deps backend

# Update all services
docker-compose up -d --force-recreate

# Pull latest base images
docker-compose pull
```
