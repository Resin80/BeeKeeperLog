# BeeKeeper's Log App

A web application for beekeepers to log inspections, harvests, and track hive health.

## 🏗️ Architecture
- **Monorepo**: Managed with npm workspaces.
- **Backend (`packages/api`)**: Node.js, Express, TypeScript, Prisma, SQLite.
- **Frontend (`packages/ui`)**: React, Vite, TypeScript, Leaflet.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository.
2. Install dependencies at the root:
   ```bash
   npm install
   ```
### Running on Unraid (Recommended)
To run BeeKeeper's Log on your Unraid server so it's accessible from the internet and your phone:

1.  **Build the Container:**
    Open the terminal in your project folder and run:
    ```bash
    docker build -t bee-keeper-log .
    ```

2.  **Launch with Persistence:**
    Run this command to start the app. It will save your data in `/mnt/user/appdata/bee-keeper-log` so you don't lose it when the container restarts:
    ```bash
    docker run -d \
      --name=bee-keeper-log \
      -p 3001:3001 \
      -v /mnt/user/appdata/bee-keeper-log:/data \
      --restart unless-stopped \
      bee-keeper-log
    ```

3.  **Link to the Internet (HTTPS):**
    For your phone's GPS to work, you **must** use HTTPS. On Unraid, the best way to do this is:
    - Install **Nginx Proxy Manager** (from the Unraid App Tab).
    - Create a "Proxy Host" for a domain you own (e.g., `bees.yourdomain.com`).
    - Point it to your Unraid IP on port `3001`.
    - Enable **SSL** (Let's Encrypt).

Once you visit your new HTTPS link on your iPhone, you can tap "Add to Home Screen" and use the GPS "Get Current Location" button!

### Running the App (One-Click)
...
The easiest way to start the app is using the provided start script. This will automatically handle installation, building, and database setup:
```bash
./start.sh
```
Once running, access the app at: **http://localhost:3001**

### Manual Development
If you want to run the API and UI separately with hot-reloading:
```bash
npm run dev
```
- **API**: [http://localhost:3001](http://localhost:3001)
- **UI**: [http://localhost:5173](http://localhost:5173)

### Database Management
To migrate or seed the database:
```bash
cd packages/api
npx prisma db push
npm run seed
```

## 📝 Features
- **Dashboard**: Stats on hives and apiaries, plus a yard map.
- **Hive Management**: List and view details for each hive.
- **Inspection Logging**: Detailed forms to track colony health.
- **Map View**: Visualize your apiaries using Leaflet.

## 🎨 Visual Strategy
Nature-inspired palette:
- **Honey Gold**: `#FFB900`
- **Leaf Green**: `#4CAF50`
- **Background**: `#FFFDF5` (Cream)
