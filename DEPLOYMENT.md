# Deployment Guide

## Prerequisites
- Docker & Docker Compose
- Node.js 16+ (for local development)
- MongoDB instance
- Nokia API credentials

## Environment Configuration
```bash
# .env file
SERVER_PORT=3000
MONGODB_URI=mongodb://mongodb:27017/sdm
NOKIA_API_KEY=your_api_key_here
NOKIA_API_SECRET=your_secret_here
SESSION_SECRET=your_session_secret
```

## Docker Deployment
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production Deployment

### 1. AWS ECS
```bash
# Build image
docker build -t sportstream:latest .

# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag sportstream:latest <account>.dkr.ecr.<region>.amazonaws.com/sportstream:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/sportstream:latest
```

### 2. Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sportstream
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sportstream
  template:
    metadata:
      labels:
        app: sportstream
    spec:
      containers:
      - name: sportstream
        image: sportstream:latest
        ports:
        - containerPort: 3000
```

## Health Checks
```bash
# Application health
curl http://localhost:3000/health

# Database connectivity
curl http://localhost:3000/api/status
```

## Monitoring
- Application logs: `/var/log/sportstream/`
- Performance metrics: Prometheus + Grafana
- Error tracking: Sentry integration
- Uptime monitoring: Pingdom/DataDog

## Backup Strategy
- MongoDB: Daily automated backups
- Application data: Weekly snapshots
- Configuration: Version controlled
- Recovery time: < 4 hours
