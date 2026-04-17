================================================================================
  HEALIO — Deployment Guide
  AI-Enabled Smart Healthcare Appointment & Telemedicine Platform
  SE3020 Distributed Systems Assignment
  Group: SE 107
================================================================================

  Hi there! This guide walks you through getting Healio up and running on your
  machine, whether you just want to spin it up quickly with Docker Compose, or
  go full production-style with Kubernetes (We have implemented both two options).
  Follow the steps one by one and you'll be good to go. (For easy access to the
  development environment, you can use "bun run dev" command. It will start without Docker or Kubernetes)

  GitHub : https://github.com/sano0007/healio


________________________________________________________________________________

  BEFORE YOU START — What you need on your machine (These are must-haves, not optional)
________________________________________________________________________________

  Make sure the following tools are installed before doing anything else:

  1. Docker Desktop  (v4.20 or later)
     -> https://www.docker.com/products/docker-desktop
     This is the backbone of everything. Both Docker Compose and the built-in
     Kubernetes cluster run through it. You can use minikube or something
     similar kubernetes orchestrators. But in this project we have used Docker Desktop's
     built-in Kubernetes for simplicity.

  2. Bun  (v1.1.38 or later)
     -> https://bun.sh
     We use Bun as the package manager and to run all project scripts.
       Install on Mac:  curl -fsSL https://bun.sh/install | bash (or npm install -g
       bun if you have Node.js installed)
       Install on Windows: You can easily install by using "npm install -g bun"
       if you have Node.js installed.

  3. kubectl
       Install on Mac:  brew install kubectl
       Install on Windows:  choco install kubernetes-cli (Chocolatey might be installed when you
       install Docker Desktop or NodeJs, so you can use that to get kubectl)

  4. At least 8 GB of RAM allocated to Docker Desktop
     → Docker Desktop → Settings → Resources → Memory → set to 8 GB or more


________________________________________________________________________________

  STEP 1 - Get the code
________________________________________________________________________________

  Clone the repo and install all dependencies:

    git clone https://github.com/sano0007/healio.git
    cd healio
    bun install

  That's it. Bun will install packages for all services in one go.


________________________________________________________________________________

  STEP 2 - Set up your environment variables
________________________________________________________________________________

  Healio needs a few API keys and secrets to run. These are stored in a file
  called .env in the project root. We have provided a .env file in the zip file,
  so you can just rename it to .env and fill in the values. If you want to create
  a new one,

  *  Keep .env in the project ROOT folder - not inside infra/ or anywhere else.

  Start by copying the example file:

    cp .env.example .env

  Now open .env in any text editor and fill in the values below.

  * You need to setup the webhook for Stripe to get payment notifications working.
  The URL should be: http://localhost:3001/api/payments/webhook
  (We have used ngrok to make a reliable tunnel to the localhost for testing the webhook.
  You can use ngrok, ultrahook or any similar tool to do this.
  -> https://medium.com/@spiredigital/working-with-stripe-webhooks-using-ngrok-5a526fec9774)

  ┌─────────────────────────┬───────────────────────────────────────────────────┐
  │ Variable                │ What it's for                                     │
  ├─────────────────────────┼───────────────────────────────────────────────────┤
  │ JWT_SECRET              │ Any long random string — used to sign login tokens │
  │ STRIPE_SECRET_KEY       │ Your Stripe secret key (starts with sk_test_...)  │
  │ STRIPE_WEBHOOK_SECRET   │ Your Stripe webhook secret (starts with whsec_...)│
  │ CLOUDINARY_CLOUD_NAME   │ Your Cloudinary cloud name                        │
  │ CLOUDINARY_API_KEY      │ Your Cloudinary API key                           │
  │ CLOUDINARY_API_SECRET   │ Your Cloudinary API secret                        │
  │ SMTP_HOST               │ Your email server  (e.g. smtp.gmail.com)          │
  │ SMTP_PORT               │ Usually 587                                       │
  │ SMTP_USER               │ The email address you're sending from             │
  │ SMTP_PASS               │ The app password for that email (not your login!) │
  │ SMTP_FROM               │ Display from-address  (e.g. noreply@healio.app)   │
  │ NOTIFY_LK_USER_ID       │ Your notify.lk user ID                            │
  │ NOTIFY_LK_API_KEY       │ Your notify.lk API key                            │
  │ NOTIFY_LK_SENDER_ID     │ Your notify.lk sender ID  (default: NotifyDEMO)  │
  │ GROQ_API_KEY            │ Your Groq API key — powers the AI symptom checker │
  │                         │ Get one free at https://console.groq.com          │
  └─────────────────────────┴───────────────────────────────────────────────────┘

  *  Keep .env in the project ROOT folder - not inside infra/ or anywhere else.


________________________________________________________________________________

  OPTION A - Docker Compose  (the easy way, great for local development)
________________________________________________________________________________

  This is the quickest way to get everything running. One command starts all
  nine services and the database together. We have added all the necessary
  scripts to package.json.

  ── First time, or after changing code ──────────────────────────────────────

  Run this to build fresh images and start everything:

    bun run docker:up:build

  Wait for the logs to settle - you'll see each service announce it's listening.
  Once you see "AI-service listening on port 5008" and "api-gateway listening on
  port 3001", you're ready.

  ── Already built, just want to start ───────────────────────────────────────

    bun run docker:up

  ── Something's broken and you want a completely clean rebuild ──────────────

    bun run docker:up:fresh

  This wipes Docker's build cache and rebuilds from scratch. Takes a few minutes
  but fixes most weird build-related issues.

  ── Watch the logs ──────────────────────────────────────────────────────────

  Open a second terminal and run:

    bun run docker:logs

  ── Stopping everything ─────────────────────────────────────────────────────

  When you're done, stop all containers (your database data is kept):

    bun run docker:down

  If you also want to wipe the database and start completely fresh next time:

    bun run docker:down:volumes

  ── Accessing the API ───────────────────────────────────────────────────────

  Once running, the API is available at:

    http://localhost:3001/api

  Import the Postman collection to test it:
    → Open Postman → Import → select:  docs/healio.postman_collection.json
    → Run requests in the numbered order (1. Auth, 2. Patients, … 7. AI, 8. Admin)
    → Tokens are saved automatically between requests — no manual copy-paste needed

* You can spin up the frontend separately by using "bun run web:dev" command,
but make sure the backend is running first. The frontend will be available at http://localhost:3000.


________________________________________________________________________________

  OPTION B — Kubernetes  (production-style, uses Docker Desktop's built-in K8s)
________________________________________________________________________________

  This runs the same services but orchestrated by Kubernetes. It takes a few
  more steps than Docker Compose but gets you much closer to a real deployment.

  ── One-time setup (you only do this once) ──────────────────────────────────

  1. Turn on Kubernetes inside Docker Desktop:
       → Open Docker Desktop
       → Go to Settings → Kubernetes
       → Tick "Enable Kubernetes"
       → Click "Apply & Restart"
       → Wait for the green Kubernetes icon to appear in the status bar
         (this can take 2–3 minutes the first time)

  2. Confirm it worked — open a terminal and run:

       kubectl cluster-info

     You should see something like "Kubernetes control plane is running at..."
     If you see an error, make sure Docker Desktop fully restarted.

  ── Deploying (run these three steps in order) ──────────────────────────────

  STEP B-1 · Build the Docker images

    bun run k8s:build

    This builds a local Docker image for each of the nine services
    (api-gateway, auth-service, ai-service, etc.). Give it a few minutes —
    it only needs to do the full build the first time; subsequent builds are
    much faster thanks to layer caching.

  STEP B-2 · Generate the Kubernetes Secrets file

    bun run k8s:gen-secrets

    This reads your .env file and writes the credentials into
    infra/k8s/01-secrets.yaml so Kubernetes can inject them into the pods.
    You need to re-run this whenever you change .env (e.g. a new API key).

  STEP B-3 · Apply everything to the cluster

    bun run k8s:apply

    This tells Kubernetes to create the namespace, load secrets, spin up
    MongoDB, and deploy all nine services. It usually takes 30–60 seconds for
    everything to settle.

  ── Check that everything is running ────────────────────────────────────────

    bun run k8s:status

  You should see all pods showing "1/1 Running" with 0 restarts:

    NAME                                   READY   STATUS    RESTARTS   AGE
    ai-service-xxx                         1/1     Running   0          1m
    api-gateway-xxx                        1/1     Running   0          1m
    appointment-service-xxx                1/1     Running   0          1m
    auth-service-xxx                       1/1     Running   0          1m
    doctor-service-xxx                     1/1     Running   0          1m
    mongodb-0                              1/1     Running   0          1m
    notification-service-xxx               1/1     Running   0          1m
    patient-service-xxx                    1/1     Running   0          1m
    payment-service-xxx                    1/1     Running   0          1m
    telemedicine-service-xxx               1/1     Running   0          1m

  ── Accessing the API ───────────────────────────────────────────────────────

    http://localhost:3001/api

  The API gateway is set up as a LoadBalancer service, so it's directly
  accessible on port 3001 — no port-forwarding commands needed.

  ── Most use Kubernetes commands ──────────────────────────────────────────

    bun run k8s:status      → See all pod statuses at a glance
    bun run k8s:restart     → Rolling restart of all deployments (good after
                               updating secrets or config)
    bun run k8s:logs        → Stream logs from all pods at once

    To watch a specific service:
      kubectl logs -n healio -l app=ai-service -f
      kubectl logs -n healio -l app=api-gateway -f

    To debug a pod that isn't starting:
      kubectl describe pod <pod-name> -n healio

  ── Tearing everything down ──────────────────────────────────────────────────

    bun run k8s:down

    This removes the entire healio namespace, all pods, services, and data.
    You'll need to run the three deploy steps again to bring it back up.
