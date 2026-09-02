# User Portal — Frontend

Next.js 14 (App Router) client for the User Portal.

## Running

```bash
npm install
npm run dev
```

Opens on `http://localhost:3000`. The backend must be running on
`http://localhost:8080` first.

If port 3000 is already in use, start on another port with `npm run dev -- -p 3001`.
The backend URL is hardcoded in the components, so changing the backend port means
editing `API_BASE_URL` in `app/login/page.js`, `app/dashboard/AddUserForm.js`, and
`app/dashboard/AllUsersTable.js`.

Sign in with the seeded administrator account: `admin` / `password`.

## Screens

- `/login` — sign-in form
- `/dashboard` — the single post-login screen, with two sections:
  - **Users** — an add-user form (user details plus a repeatable family-details
    section) above a table of every user with their family members
  - **Family Members** — an add-family-member form (pick an existing user, add one
    or more rows) above a table of every family member with its owning user

Adding in either section refreshes both tables, so a family member added under
**Family Members** shows up against its user under **Users**.

## Layout

```
app/
├── layout.js
├── globals.css
├── page.js                  # redirects to /login
├── login/page.js
└── dashboard/
    ├── page.js                   # section shell + session handling
    ├── AddUserForm.js            # POST /api/users
    ├── AllUsersTable.js          # GET  /api/users
    ├── AddFamilyMemberForm.js    # POST /api/family-members (+ /bulk)
    └── AllFamilyMembersTable.js  # GET  /api/family-members
```

## Notes

The backend base URL is written directly into the components that call the API.
Session state is kept in `localStorage` and read on the client after mount.
