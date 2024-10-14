# DogPile Solutions - GCP and Docker Deployment Guide

## Table of Contents
1. [Google Cloud Platform (GCP) Setup](#google-cloud-platform-gcp-setup)
    - [Install Google Cloud SDK](#install-google-cloud-sdk)
        - [Windows](#windows)
        - [Mac](#mac)
    - [Post-installation steps](#post-installation-steps)
    - [GCP Configuration](#gcp-configuration)
2. [Docker Setup](#docker-setup)
    - [Important for Windows Users](#important-for-windows-users)
3. [How to Redeploy After Code Changes](#how-to-redeploy-after-code-changes)
    - [Add Changes From Backend to GCP](#add-changes-from-backend-to-gcp)
    - [Add Changes From Frontend to GCP](#add-changes-from-frontend-to-gcp)
4. [Check Status of Pods and Services](#check-status-of-pods-and-services)
5. [Restart Services](#restart-services)
6. [Reset MySQL Pod](#reset-mysql-pod)
7. [Building from Scratch](#building-from-scratch)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Tag the Images for Artifact Registry](#tag-the-images-for-the-artifact-registry)
    - [Push the Images to Artifact Registry](#push-the-images-to-artifact-registry)
8. [Useful `kubectl` Commands](#useful-kubectl-commands)

---


## Google Cloud Platform (GCP) Setup

### Install Google Cloud SDK:
#### Windows:
- Run the following command in PowerShell:

  ```powershell
  (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
  & $env:Temp\GoogleCloudSDKInstaller.exe



## Mac:
- Download the SDK [here](https://cloud.google.com/sdk/docs/install#mac)

### Post-installation steps:
- Once installed, ensure the SDK runs and prompts you to sign in.
- Sign in with the GCP account provided.

### GCP Configuration:
Run the following commands in your terminal:

```bash
gcloud auth configure-docker
gcloud auth configure-docker us-south1-docker.pkg.dev
gcloud config set project possible-cocoa-438319-m0
gcloud services enable artifactregistry.googleapis.com
gcloud components install kubectl
gcloud container clusters get-credentials dogpile-cluster-1 --region us-central1
```

## Docker Setup

### Important for Windows Users:
Due to differences in line endings on Windows (`\r\n` vs `\n`), follow these steps:

1. Delete the repository from your machine (yes, really).
2. Navigate to the directory where you will clone the project.
3. Run the following command to fix the carriage return error:

    ```bash
    git config --global core.autocrlf input
    ```

   > This prevents line-ending issues that took hours to debug.

4. In IntelliJ, open `yarn.lock` and `package.json` in the front-end directory and ensure the line endings are set to `LF` (bottom right corner of IntelliJ).
5. Re-clone the repository and continue with the next steps.



# How to Redeploy After Code Changes
#### - Replace `"C:\Projects\pet-adoption-f24-team-5\docker\pet-adoption-api.Dockerfile"` with the path from your directory to the docker file found in `pet-adoption-f24-team-5\docker` of the project directory.

## Add Changes From backend to GCP:
```bash
docker build --no-cache -f "C:\Projects\pet-adoption-f24-team-5\docker\pet-adoption-api.Dockerfile" -t us-south1-docker.pkg.dev/possible-cocoa-438319-m0/dogpile-repo/spring-backend:latest .

docker push us-south1-docker.pkg.dev/possible-cocoa-438319-m0/dogpile-repo/spring-backend:latest

kubectl delete pods -l app=spring-backend
```


## Add Changes From Frontend to GCP:
```bash
docker build --no-cache -f "C:\Projects\pet-adoption-f24-team-5\docker\pet-adoption-frontend.Dockerfile" -t us-south1-docker.pkg.dev/possible-cocoa-438319-m0/dogpile-repo/react-frontend:latest .

docker push us-south1-docker.pkg.dev/possible-cocoa-438319-m0/dogpile-repo/react-frontend:latest

kubectl delete pods -l app=react-frontend
```


## Check Status of Pods and Services:
```bash
kubectl get pods
kubectl get services
```

##  To restart the services (You dont normally need to do this)
```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-deployment.yaml
```


## RESET MYSQL Pod
#### - Replace `"mysql-######-#####"` with the pod name and hash of mysql found from `kubectl get pods`

```bash
kubectl delete pods -l app=mysql

kubectl exec -it mysql-######-##### -- mysql -u root -p 

CREATE DATABASE petadoption;

kubectl delete pods -l app=spring-backend
````

## Building from Scratch
**Note:** Only rebuild from scratch if necessary (consult Peter W. if unsure).

Navigate to the backend and frontend directories and run the following commands:

### Backend:
```bash
docker build --no-cache -f "C:\Projects\pet-adoption-f24-team-5\docker\pet-adoption-api.Dockerfile" -t gcr.io/possible-cocoa-438319-m0/spring-backend:latest .
```

### Frontend:
```bash
docker build --no-cache -f "C:\Projects\pet-adoption-f24-team-5\docker\pet-adoption-frontend.Dockerfile" -t gcr.io/possible-cocoa-438319-m0/react-frontend:latest .
```

### Tag the images for the Artifact Registry:

#### Backend:
```bash
docker tag gcr.io/possible-cocoa-438319-m0/spring-backend us-south1-docker.pkg.dev/possible-cocoa-438319-m0/dogpile-repo/spring-backend:latest
```

#### Frontend:
```bash
docker tag gcr.io/possible-cocoa-438319-m0/react-frontend us-south1-docker.pkg.dev/possible-cocoa-438319-m0/dogpile-repo/react-frontend:latest
```

### Push the images to Artifact Registry:

#### Backend:
```bash
docker push us-south1-docker.pkg.dev/possible-cocoa-438319-m0/dogpile-repo/spring-backend:latest
```

#### Frontend:
```bash
docker push us-south1-docker.pkg.dev/possible-cocoa-438319-m0/dogpile-repo/react-frontend:latest
```



## Useful `kubectl` Commands

### Check Pods and Services:
```bash
kubectl get pods
kubectl get services
```

### Describe a Pod:
```bash
kubectl describe pod <pod-name>
```

### View Logs:
```bash
kubectl logs <pod-name>
```

### Restart Pods:
```bash
kubectl rollout restart deployment <deployment-name>
```
> This can also be done with `kubectl delete pod <pod name>`

### Execute a Command Inside a Pod:
```bash
kubectl exec -it <pod-name> -- <command>
```

### Scale a Deployment:
```bash
kubectl scale deployment <deployment-name> --replicas=<number>
```
