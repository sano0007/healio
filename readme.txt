# Healio Deployment Guide

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
   - `SMTP_USER` / `SMTP_PASS` — your email address and app password
   - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER` — Twilio credentials

---

## Local Development (Docker Compose)

### Step 1 — Build and start all services

```bash
bun run docker:up
```

This builds all 8 service containers and starts:
- MongoDB on port 27017
- API Gateway on port 3001
- auth-service on port 4001
- patient-service on port 4002
- doctor-service on port 4003
- appointment-service on port 4004
- telemedicine-service on port 4005
- payment-service on port 4006
- notification-service on port 4007

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
- `STRIPE_SECRET_KEY`
- `SMTP_USER` / `SMTP_PASS`
- `TWILIO_*` credentials

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

| Service                  | Port | Protocol |
|--------------------------|------|----------|
| Frontend (Next.js)        | 3000 | HTTP     |
| API Gateway              | 3001 | HTTP/TCP |
| auth-service             | 4001 | TCP      |
| patient-service          | 4002 | TCP      |
| doctor-service           | 4003 | TCP      |
| appointment-service      | 4004 | TCP      |
| telemedicine-service      | 4005 | TCP      |
| payment-service          | 4006 | TCP      |
| notification-service     | 4007 | TCP      |
| MongoDB                  | 27017| TCP      |