# Healio: Docker & Kubernetes Orchestration Guide

This guide covers deploying the Healio AI-Enabled Smart Healthcare Appointment & Telemedicine Platform using Docker Compose (local development) and Kubernetes (production-like environment).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Docker Compose](#docker-compose)
5. [Kubernetes](#kubernetes)
6. [Service Interconnection](#service-interconnection)
7. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                │
│                      (Next.js :3000)                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────▼───────────────────────────────────────┐
│                      API Gateway                                │
│                   (NestJS :3001)                                │
│  - JWT Authentication                                           │
│  - Role-based Access Control                                    │
│  - Service Orchestration                                        │
└─────┬─────┬──────┬──────┬──────┬──────┬──────┬─────────────────┘
      │     │      │      │      │      │      │
   Auth  Patient Doctor Appt  TeleMd  Pay  Notify
  :5001  :5002  :5003  :5004  :5005  :5006  :5007
      │     │      │      │      │      │      │
      └─────┴──────┴──────┴──────┴──────┴──────┘
                          │
               ┌──────────▼──────────┐
               │       MongoDB       │
               │  healio-auth        │
               │  healio-patients    │
               │  healio-doctors     │
               │  healio-appoints    │
               │  healio-payments    │
               └─────────────────────┘
```

### Services

| Service | Port | Responsibility |
|---------|------|----------------|
| API Gateway | 3001 | Routes requests, JWT auth, rate limiting |
| auth-service | 5001 | User registration & JWT issuance |
| patient-service | 5002 | Patient profiles & medical reports |
| doctor-service | 5003 | Doctor profiles & availability |
| appointment-service | 5004 | Booking, scheduling & status |
| telemedicine-service | 5005 | Jitsi video session management |
| payment-service | 5006 | Stripe Checkout integration |
| notification-service | 5007 | Email (nodemailer) & SMS (notify.lk) |

---

## Prerequisites

- **Docker Desktop** installed and running (enables both Docker Compose and Kubernetes)
- **Bun** package manager
- **kubectl** CLI (`brew install kubectl`)
- At least **8GB RAM** allocated to Docker Desktop

---

## Environment Setup

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Required variables in `.env`:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for JWT signing |
| `STRIPE_SECRET_KEY` | Stripe API key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (`whsec_...`) |
| `SMTP_HOST` | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g. `587`) |
| `SMTP_USER` | SMTP username / email |
| `SMTP_PASS` | SMTP app password |
| `SMTP_FROM` | From address (e.g. `noreply@healio.app`) |
| `NOTIFY_LK_USER_ID` | notify.lk user ID |
| `NOTIFY_LK_API_KEY` | notify.lk API key |
| `NOTIFY_LK_SENDER_ID` | notify.lk sender ID (default: `NotifyDEMO`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Docker Compose

All commands run from the **project root**.

### Start

```bash
bun run docker:up
```

Starts all services (MongoDB + 8 microservices) in the foreground.

### Start with rebuild

```bash
bun run docker:up:build
```

Rebuilds images before starting (use after code changes).

### Fresh build (no cache)

```bash
bun run docker:up:fresh
```

Wipes the Docker build cache and rebuilds everything from scratch.

### Stop

```bash
bun run docker:down
```

Stops and removes all containers (data volumes are preserved).

### Stop and wipe data

```bash
bun run docker:down:volumes
```

Stops containers **and** deletes MongoDB data volumes.

### View logs

```bash
bun run docker:logs
```

---

## Kubernetes

Uses **Docker Desktop's built-in Kubernetes** — no external cluster needed.

### One-time setup

**1. Enable Kubernetes in Docker Desktop:**
- Open Docker Desktop → Settings → Kubernetes
- Check **Enable Kubernetes** → Apply & Restart
- Wait for the green indicator

**2. Verify connection:**
```bash
kubectl cluster-info
```

### Deploy

**1. Build images** (tags them as `healio/*:latest`):
```bash
bun run k8s:build
```

**2. Generate secrets** from your `.env`:
```bash
bun run k8s:gen-secrets
```
This writes real values into `infra/k8s/01-secrets.yaml` (gitignored — never committed).

**3. Apply all manifests:**
```bash
bun run k8s:up
```

### Check status

```bash
bun run k8s:status
```

Expected output — all pods `1/1 Running`:
```
NAME                                    READY   STATUS    RESTARTS   AGE
api-gateway-xxx                         1/1     Running   0          1m
appointment-service-xxx                 1/1     Running   0          1m
auth-service-xxx                        1/1     Running   0          1m
doctor-service-xxx                      1/1     Running   0          1m
mongodb-0                               1/1     Running   0          1m
notification-service-xxx                1/1     Running   0          1m
patient-service-xxx                     1/1     Running   0          1m
payment-service-xxx                     1/1     Running   0          1m
telemedicine-service-xxx                1/1     Running   0          1m
```

### Access the API

The API gateway is exposed as a `LoadBalancer` service — no port-forward needed:

```
http://localhost:3001/api
```

### Tear down

```bash
bun run k8s:down
```

Deletes the `healio` namespace and everything inside it. Data volumes are also removed.

### Other useful commands

```bash
bun run k8s:restart   # Rolling restart of all deployments
bun run k8s:logs      # Stream logs from all pods
```

```bash
# Per-service logs
kubectl logs -n healio -l app=api-gateway -f
kubectl logs -n healio -l app=auth-service -f

# Describe a pod (for debugging)
kubectl describe pod <pod-name> -n healio

# List services
kubectl get svc -n healio
```

### Manifests reference

| File | Contents |
|------|----------|
| `00-namespace.yaml` | `healio` namespace |
| `01-secrets.yaml` | Sensitive credentials (generated by `k8s:gen-secrets`) |
| `02-configmap.yaml` | Non-sensitive config & service discovery hostnames |
| `03-mongodb-statefulset.yaml` | MongoDB StatefulSet with health probes |
| `04-mongodb-service.yaml` | Headless MongoDB service |
| `10-api-gateway.yaml` | API Gateway deployment + LoadBalancer service |
| `11-17-*.yaml` | One file per microservice (deployment + headless service) |

---

## Service Interconnection

Services communicate via NestJS TCP microservices. The API gateway connects to each downstream service by hostname:

```
api-gateway ──TCP──> auth-service:5001
api-gateway ──TCP──> patient-service:5002
api-gateway ──TCP──> doctor-service:5003
api-gateway ──TCP──> appointment-service:5004
api-gateway ──TCP──> telemedicine-service:5005
api-gateway ──TCP──> payment-service:5006
api-gateway ──TCP──> notification-service:5007
```

- **Docker Compose**: hostnames are the service names in `docker-compose.yml`
- **Kubernetes**: hostnames are the `metadata.name` of each Service resource (same names)

---

## Troubleshooting

### Pods stuck in `0/1 Running` or `CrashLoopBackOff`

```bash
# Check events and probe status
kubectl describe pod <pod-name> -n healio

# Check logs
kubectl logs <pod-name> -n healio
```

### MongoDB not ready

```bash
kubectl get pods -l app=mongodb -n healio
kubectl exec -it mongodb-0 -n healio -- mongosh --quiet --eval "db.adminCommand('ping')"
```

### Image not found (`ErrImageNeverPull`)

Ensure you ran `bun run k8s:build` **without** `eval $(minikube docker-env)` — Docker Desktop shares the host Docker daemon, so images built locally are immediately available in the cluster.

### Secrets missing or wrong

Re-run secrets generation after updating `.env`:
```bash
bun run k8s:gen-secrets
kubectl apply -f infra/k8s/01-secrets.yaml
bun run k8s:restart
```

### Docker Compose — environment variables missing

Ensure `.env` is in the **project root** (not inside `infra/`). The npm scripts pass `--env-file .env` explicitly.
