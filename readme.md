<div align="center">
  <img src="https://github.com/kunaldangi/bizdataportal/blob/3efb4093663f404cb3d21b4ab99706333490a01b/docs/Logo/biz-logo.png" alt="Logo" width="150" height="150" />
</div>

# [BizDataPortal](https://bizdataportal.kunaldangi.me/)
A centralized data management web app that manages data using dynamic tables with various permission controls.

## Features
- Whitelist Email: Only whitelisted email users can register and use the app.
- Permissions: You can assign different permissions to users, granting them rights to perform various tasks and actions such as managing user accounts, user permissions, whitelists, creating tables, reading tables, and managing tables.
- You can add users to a specific table and grant them certain permissions within that table.
- Tables are fully dynamic, allowing you to add or remove fields at any time.
- Export tables as XLSX files.

### Demo
[Video](https://youtu.be/r1s8Clwv8R0)
## Documentation
Please head to [here](https://github.com/kunaldangi/bizdataportal/blob/3efb4093663f404cb3d21b4ab99706333490a01b/docs/readme.md)


## How to run?

### Server

Setup environment variable
```env
SERVER_RUN_MODE=

DATABASE_HOST=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=

# Create a app in google account
GMAIL_ID=
GMAIL_KEY=

JWT_OTP_SECRET=
JWT_SESSION_SECRET=

BACKEND_URL=
BACKEND_HOST=
BACKEND_PORT=

# For adding some default users
NORMALUSER_NAME=
NORMALUSER_PASSWORD=
ADMINUSER_NAME=
ADMINUSER_PASSWORD=
```

```bash
git clone https://github.com/kunaldangi/bizdataportal.git
cd bizdataportal
npm i
npm run dev # to start development server
# OR
npm run build
npm run start # to start production server
```
Open http://localhost with your browser to see the result.
