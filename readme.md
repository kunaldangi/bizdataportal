# BizDataPortal
A centralized data management web app that manages data using dynamic tables with various permission controls.

## Features
- Whitelist Email: Only whitelisted email users can register and use the app.
- Permissions: You can assign different permissions to users, granting them rights to perform various tasks and actions such as managing user accounts, user permissions, whitelists, creating tables, reading tables, and managing tables.
- You can add users to a specific table and grant them certain permissions within that table.
- Tables are fully dynamic, allowing you to add or remove fields at any time.
- Export tables as XLSX files.

## Documentation
Please head to [here](https://github.com/kunaldangi/bizdataportal/blob/3efb4093663f404cb3d21b4ab99706333490a01b/docs/readme.md)


## How to run?

### NextJs Server

Setup environment variable
```env
# ----- BACKEND CONFIGURATION -----
BACKEND_URL=
BACKEND_HOST=
BACKEND_PORT=
# ----- TOKEN CONFIGURATION -----
JWT_SESSION_SECRET=
```

```bash
git clone https://github.com/kunaldangi/bizdataportal.git
cd bizdataportal/client
npm i
npm run dev # to start development server
# OR
npm run build
npm run start # to start production server
```

### Backend Server

Setup environment variable
```env
SERVER_RUN_MODE="development"

# ----- DATABASE CONFIGURATION -----
DATABASE_HOST=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=

# ----- MAIL CONFIGURATION -----
GMAIL_ID=
GMAIL_KEY=

# ----- TOKEN CONFIGURATION -----
JWT_OTP_SECRET=
JWT_SESSION_SECRET=
```
```bash
cd bizdataportal/server
npm i
npm run dev # to start development server (typescript watch mode)
# OR
npm run build
npm run start # to start production server (javascript compiled mode)
```
Open http://localhost with your browser to see the result.
