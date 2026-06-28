# AdminPortal | User Management Dashboard

A modern, fully responsive user directory management application built with **React**, **Axios**, and **Vanilla CSS**. This dashboard interacts with the mock REST API **JSONPlaceholder** to perform complete CRUD operations (Create, Read, Update, Delete) on user profiles, supplemented with local search, sorting, filtering, and pagination.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- npm (Node Package Manager)

### Installation & Run

1. Clone or extract the project source code.
2. Navigate to the project root directory:
   ```bash
   cd user-management-dashboard
   ```
3. Install the project dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
   *The application will boot, typically accessible at `http://localhost:5173/`.*

### Running Automated Tests

Run the Vitest unit test suite to verify code correctness:
```bash
npm run test
```

### Production Build

To compile a minified production bundle:
```bash
npm run build
```
Verify the build output:
```bash
npm run preview
```

---

## 📁 Project Directory Structure

```text
user-management-dashboard/
├── dist/                          # Compiled production bundles
├── public/                        # Static assets (favicons, logos)
├── src/
│   ├── api/
│   │   └── userService.js         # Axios API layer for CRUD commands
│   ├── components/
│   │   ├── ConfirmDelete.jsx      # Safety prompt modal
│   │   ├── FilterPopup.jsx        # Granular popup filters
│   │   ├── Header.jsx             # Title, stats, and add action
│   │   ├── Pagination.jsx         # Navigation and limit selectors
│   │   ├── SearchBar.jsx          # Real-time search query box
│   │   ├── UserForm.jsx           # Input modal for Add & Edit profiles
│   │   ├── UserRow.jsx            # Individual table row render
│   │   └── UserTable.jsx          # Table grid containing table headers
│   ├── hooks/
│   │   └── useUsers.js            # Core custom hook for state & async hooks
│   ├── utils/
│   │   ├── constants.js           # Shared lists (departments, limits)
│   │   ├── helpers.js             # Data-mapping name splitters & department indices
│   │   └── validators.js          # Client-side input error checkers
│   ├── __tests__/
│   │   ├── helpers.test.js        # Unit tests for data-mappers
│   │   ├── userService.test.js    # Unit tests for Axios request format
│   │   └── validators.test.js     # Unit tests for form validators
│   ├── App.css                    # Discarded boilerplate stylesheet
│   ├── App.jsx                    # Root layout controller
│   ├── index.css                  # Custom HSL design system stylesheet
│   └── main.jsx                   # React bootloader script
├── index.html                     # Main HTML template loading Inter/Outfit fonts
├── package.json                   # Configurations and script commands
├── vite.config.js                 # Vite compiler configurations
└── README.md                      # Documentation (This file)
```

---

## 🛠️ Libraries Used

| Library | Version | Purpose |
| --- | --- | --- |
| **React** | `^19.2.7` | UI library for component composition and states. |
| **Axios** | `^1.18.1` | HTTP client for reliable Promise-based REST requests. |
| **Vitest** | `^4.1.9` | High-performance unit test runner. |
| **Vite** | `^8.1.0` | Next-generation build tool and dev server. |

---

## ⚙️ Engineering Assumptions

1. **First Name & Last Name Extraction:**
   The mock API returns a single `name` string (e.g. `"Leanne Graham"`). To translate this into the required `firstName` and `lastName` fields, we split the string at the first space character.
   - Example: `"Mrs. Dennis Schulist"` maps to:
     - `firstName`: `"Mrs."`
     - `lastName`: `"Dennis Schulist"`
2. **Department Mapping:**
   Since JSONPlaceholder does not have department fields, we assign each fetched profile a department consistently using their ID indexed against a predefined list (`id % DEPARTMENTS.length`).
   - Predefined departments: *Engineering, Marketing, Sales, Human Resources, Finance, Design, Customer Support, Information Technology*.
3. **Local Action Simulation:**
   Because JSONPlaceholder is read-only and does not persist changes to its server, we replicate server additions, edits, and deletions in the React local state (`useUsers` state) so updates show immediately in the user interface.

---

## 🧩 Challenges & Resolutions

1. **Duplicate ID Returns (POST):**
   *Challenge:* The mock API returns `id: 11` for any successful `POST` request. If an administrator adds multiple users, they would all be assigned `id: 11`, breaking key listings and React rendering logic.
   *Resolution:* When adding a user, we check if `11` (or the returned ID) is already present. If it is, we calculate a new unique ID in the state using `Math.max(...currentIds, 0) + 1` to ensure unique keys.

2. **Network 404 Errors on Local IDs (PUT/DELETE):**
   *Challenge:* When attempting to edit or delete a newly added local user (e.g. `id: 11`, `id: 12`), the mock API throws a `404 Not Found` error because these IDs do not exist on the mock server database.
   *Resolution:* In the API triggers, if the user's ID is greater than 10 (the initial dataset size), we skip calling the remote server endpoint and perform the state updates locally. If it is $\le 10$, we proceed with the remote REST request.

3. **Complex Form State and Error Handling:**
   *Challenge:* Direct form submissions without validation can break backend models.
   *Resolution:* Built an on-the-fly validation system. It tracks which fields have been "touched" or "blurred" to provide clean visual error markers without annoying users when they first start typing. On submit, it runs comprehensive checks and focuses the first invalid element automatically.

---

## 🔮 Future Architectural Improvements

If given more time, the following features would be added:
1. **Real Database Integration:**
   Connect to a real Node.js/Express backend coupled with MongoDB or PostgreSQL to persist CRUD operations permanently.
2. **Router Deep Linking:**
   Incorporate `react-router-dom` to support deep linking for pagination and filters (e.g. `/users?page=2&dept=Engineering&search=john`). This allows administrators to share links with active filtered views directly.
3. **Advanced Filtering Overlay:**
   Support range filters (e.g., date registered, age) and multi-select tags for departments rather than single selection dropdowns.
4. **Bulk Selection & Actions:**
   Allow administrators to select multiple users using checkmarks to perform bulk deletion or bulk department updates.
5. **Secure Authentication:**
   Implement a login portal and Role-Based Access Control (RBAC) separating "Viewer", "Moderator", and "Administrator" privileges.
