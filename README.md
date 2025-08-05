# mfe-home

[![Angular](https://img.shields.io/badge/Angular-16+-dd0031?logo=angular)](https://angular.io/)
[![Micro Frontend](https://img.shields.io/badge/Micro--Frontend-Architecture-blue)]()
[![Azure](https://img.shields.io/badge/Hosted%20on-Azure-blue?logo=microsoft-azure)]()

`mfe-home` is a remote micro frontend built with Angular and integrated into a modular micro-frontend architecture using **Module Federation**.

It is deployed on **Azure** and serves as the **navigation bar** for the host application.

---

## 🌐 Live Application

## Access the live version via:
### host-app:
🔗 [https://mfe-host-b2cccjaqedbmb6c8.canadacentral-01.azurewebsites.net](https://mfe-host-b2cccjaqedbmb6c8.canadacentral-01.azurewebsites.net)

### mfe-home:
🔗 [https://mfe-home-hwcqe3hgg4avhbbe.canadacentral-01.azurewebsites.net](https://mfe-home-hwcqe3hgg4avhbbe.canadacentral-01.azurewebsites.net)

---

## 🧩 Architecture Overview

The project follows a **micro-frontend architecture**. Each major section of the application is split into an independent micro frontend.

### Structure

- Host App (mfe-host)
  ├─ Navbar App (mfe-navbar)
  └─ Home App (mfe-home)

### Design Principles

- Domain-driven route ownership
- Independent deployment pipelines
- Shared state via state controllers
- Lazy loading via Module Federation

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- Angular CLI v16+
- Host app (`mfe-host`) running locally

### Install Dependencies

```bash
npm install
````

### Run mfe-navbar
```bash
npm start
````
## This will start the mfe-navbar at:
➡️ http://localhost:4202
⚠️ You will need the host application (mfe-host) running simultaneously to see the navbar rendered and working within the full app.  
🔗 [https://github.com/GuilhermeFontanella/POS-TECH-MODULO-2-host-app](https://github.com/GuilhermeFontanella/POS-TECH-MODULO-2-host-app)  
🔗 [https://github.com/GuilhermeFontanella/POS-TECH-MODULO-2-mfe-navbar](https://github.com/GuilhermeFontanella/POS-TECH-MODULO-2-mfe-navbar)ce](https://angular.io/cli) page.
