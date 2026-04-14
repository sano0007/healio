# Healio : AI-Enabled Smart Healthcare Appointment & Telemedicine Platform

This guide covers local Docker deployment and Kubernetes deployment for the
AI-Enabled Smart Healthcare Appointment & Telemedicine Platform.

---

## Prerequisites

- Node.js 18+ (for local dev)
- Bun package manager (bun.sh)
- Docker Desktop (for containerised deployment)
- kubectl (for Kubernetes deployment)
- Kubernetes cluster (e.g., Minikube, Docker Desktop K8s, GKE, EKS, AKS)

---

## Environment Setup

1. Copy the root `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required values:
   - `JWT_SECRET` — a strong random string (used for signing JWT tokens)
   - `STRIPE_SECRET_KEY` — your Stripe sandbox/test key
   - `STRIPE_WEBHOOK_SECRET` — your Stripe webhook signing secret
   - `SMTP_USER` / `SMTP_PASS` — your email address and app password
   - `NOTIFY_LK_USER_ID` / `NOTIFY_LK_API_KEY` / `NOTIFY_LK_SENDER_ID` — notify.lk credentials for SMS

---

## Local Development (Docker Compose)

### Step 1 — Build and start all services

```bash
bun run docker:up
```

This builds all 8 service containers and starts:
- API Gateway on port 3001
- auth-service on port 9001
- patient-service on port 9002
- doctor-service on port 9003
- appointment-service on port 9004
- telemedicine-service on port 9005
- payment-service on port 9006
- notification-service on port 9007

### Step 2 — Start the frontend (separate terminal)

```bash
cd apps/web
bun install
bun dev
```

Frontend runs at http://localhost:3000

### Step 3 — Stop all services

```bash
bun run docker:down
```

---

## Production / Kubernetes Deployment

### Prerequisites

1. Build and push all Docker images to a container registry:
   ```bash
   # Login to your registry (e.g., Docker Hub, GCR, ECR, ACR)
   docker login

   # Tag and push each service image
   docker tag healio/api-gateway:latest yourregistry/healio/api-gateway:latest
   docker push yourregistry/healio/api-gateway:latest
   # Repeat for all services...
   ```

2. Update `infra/k8s/` manifest image references to point to your registry.

### Step 1 — Update secrets

Edit `infra/k8s/01-secrets.yaml` and replace placeholder values:
- `JWT_SECRET`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- `SMTP_USER` / `SMTP_PASS`
- `NOTIFY_LK_USER_ID` / `NOTIFY_LK_API_KEY` / `NOTIFY_LK_SENDER_ID`

### Step 2 — Apply manifests

```bash
kubectl apply -f infra/k8s/
```

This creates:
- `healio` namespace
- `healio-secrets` secret
- `healio-configmap` configmap
- MongoDB StatefulSet + Headless Service
- 8 microservice Deployments + Services (ClusterIP)
- API Gateway Deployment + Service (LoadBalancer)

### Step 3 — Verify deployment

```bash
kubectl get pods -n healio
kubectl get services -n healio
```

### Step 4 — Get the API Gateway external URL

```bash
kubectl get service api-gateway-service -n healio
```

The external IP/port will be used as the `NEXT_PUBLIC_API_URL` in the frontend.

### Step 5 — Tear down

```bash
kubectl delete -f infra/k8s/
```

---

## Service Ports Reference

| Service | Port | Protocol |
|---------|------|----------|
| Frontend (Next.js) | 3000 | HTTP |
| API Gateway | 3001 | HTTP/TCP |
| auth-service | 9001 | TCP |
| patient-service | 9002 | TCP |
| doctor-service | 9003 | TCP |
| appointment-service | 9004 | TCP |
| telemedicine-service | 9005 | TCP |
| payment-service | 9006 | TCP |
| notification-service | 9007 | TCP |