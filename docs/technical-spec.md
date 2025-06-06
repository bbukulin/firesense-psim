# FireSense PSIM Web Application Technical Specification

FireSense PSIM is a Physical Security Information Management web application. It integrates various physical security systems (surveillance cameras, fire/gas sensors, alarms, etc.) into a unified platform for real-time monitoring, alerts, and response. This document details the technical design and specifications of FireSense, covering architecture, feature workflows, data models, and implementation strategies using the chosen tech stack (Next.js, Tailwind CSS + Shadcn/UI + Framer Motion on the frontend; PostgreSQL (Supabase) + Drizzle ORM + Next.js Server Actions on the backend; NextAuth for authentication; RESTful APIs). Each section provides a breakdown of components, workflows, challenges, edge cases, and solutions, serving as a blueprint for engineers or code generation systems to implement the system.

# 1 - Core System Architecture and Key Workflows
Architecture Overview: FireSense follows a modern Next.js full-stack architecture. The Next.js 15 App Router serves both the frontend (React components) and backend (API routes and Server Actions) in one project. The application is structured as follows:

- Client Frontend: A Next.js React app served to users. It uses Tailwind CSS and Shadcn/UI for a responsive, consistent UI, and Framer Motion for animations. Pages are mostly rendered on the server for initial load (SSR), enhancing performance and SEO, then hydrated on the client for interactivity.
- Server (Backend) Layer: Next.js handles server-side functionality via Route Handlers (for REST API endpoints under /api/*) and Server Actions within React components for direct server calls. This layer contains the core application logic (fetching/saving data, authentication, real-time event handling). It runs in a Node.js environment and interacts with the database.
- Database: A PostgreSQL database (hosted on Supabase) stores persistent data: user accounts, camera info, sensor readings, incident logs, etc. We use Drizzle ORM in the Next.js backend for type-safe database queries and migrations. Drizzle provides compile-time checked SQL queries, a fluent builder syntax, and robust transaction support, reducing runtime errors in database operations.
- Authentication: NextAuth (Auth.js) is integrated for user authentication and session management. NextAuth is configured to use the Supabase Postgres database (with its own next_auth schema/tables for users, sessions, accounts). This means user credentials and sessions are stored securely in our database, separate from Supabase’s built-in auth (we are using NextAuth as a standalone auth provider). NextAuth issues encrypted HTTP-only cookies for sessions and supports JWT tokens, ensuring secure auth without client-side credential storage.
- Real-Time Communication: FireSense provides real-time fire alerts and sensor updates via WebSockets. We leverage Supabase Realtime channels (or a similar WebSocket service) to broadcast events to connected clients with low latency. The frontend subscribes to a channel (e.g., "firesense-alerts") and listens for broadcast messages like new sensor readings or alert triggers. This decouples real-time data flow from the request/response cycle and enables instantaneous updates on the dashboard when critical events occur.

# 2 - Project Structure and Organization
We will organize the Next.js codebase in a clear, feature-oriented structure. Key aspects of the project structure include:
- Next.js App Router Layout: We use the Next.js 13+ App directory (/app) for routing. The hierarchy under app/ will reflect our main pages and features:
    - app/dashboard/page.tsx – Dashboard overview page (sensor data, sensor status, active cameras, last 10 incident logs, etc.) 
	- app/incident-logs/page.tsx – Incident log page (list of historical alerts).
	- app/monitoring/page.tsx – Page to view all camera feeds (for operator).
	- app/admin/users/page.tsx – Admin page for user management (protected route).
	- app/admin/monitoring/page.tsx – Admin page for camera management.
	- We may define an app/admin/layout.tsx to wrap all admin pages with a simple navigation, and similarly a main layout for operator pages. Next.js allows nested layouts, which we will leverage to separate admin UI from regular UI.
	- We will utilize Next.js Route Groups or folder conventions to co-locate related components. For example, the dashboard page might have its own folder with components: app/dashboard/CameraGrid.tsx, app/dashboard/SensorChart.tsx, etc., to keep dashboard-specific code organized.

- API Routes and Server Actions: Under app/api/, we implement RESTful endpoints as needed:
    - app/api/incident-logs/route.ts might handle GET (list incidents) and POST (create incident – though incidents are mainly created internally by server logic).
	- app/api/monitoring/route.ts for GET (list cameras) and POST (add camera).
	- app/api/monitoring/[id]/route.ts for DELETE or PUT (update camera).
	- app/api/admin/users/route.ts for GET (list users, admin only) and POST (create user).
	- app/api/admin/users/[id]/route.ts for PATCH/DELETE to modify or remove a user.
	- NextAuth will occupy app/api/auth/[...nextauth]/route.ts – this dynamic route handles all auth requests (login, callback, etc.) as per NextAuth’s configuration.
    - These route handler files will use Next.js Request/Response Web APIs to implement REST semantics. They are kept thin if possible, delegating to internal service functions or the ORM.

- Shared Components and Utilities: We maintain a components/ directory (or multiple, possibly grouping by UI and domain):
    - components/ui/ will contain the Shadcn/UI components (as installed by shadcn’s CLI). For example, we’ll have components/ui/button.tsx, components/ui/dialog.tsx, etc. These are the base UI building blocks (buttons, modals, inputs) that are styled consistently. They can be imported anywhere in the app.
    -  components/icons/ (if needed) for any custom SVG icons or icon library usage.
    - components/chart/ (if using custom chart wrappers) for visualization components.
    - We strive for reusability: for example, a modal dialog component from Shadcn can be used for both confirming deletions and showing incident details, just passed different props.

- Database and ORM Layer: We keep all Drizzle ORM definitions and database utilities in a dedicated area -- Please reference backend.mdc rules when working with database and ORM layer. 

- Middleware: We implement a global middleware.ts at the project root (Next.js automatically uses this). This middleware runs for every request (or for specified patterns) to enforce auth. We will configure it to protect routes like /admin/* – it will read the NextAuth session token from cookies using getToken() and check the user’s role. If the user is not allowed, it will redirect to a login or an “Unauthorized” page. The project structure will include this file at the root, and possibly an app/unauthorized/page.tsx for the page shown on access denial.

- Project Organization Best Practices: We will maintain modularity – for example, keep business logic separated from presentation where possible. Complex logic (like alert evaluation, data parsing) can go in utility functions (e.g., a utils/ folder or inside lib/). We aim for each file to have a single clear purpose, and use TypeScript interfaces/types to define the shape of data (for instance, define types for User, Incident, etc., to use throughout the app for consistency). This aids both human developers and code generation tools by providing a clear contract for each part.

# 3 - Detailed Feature Specifications
This section dives into each major feature of FireSense PSIM, describing functionality, requirements, and implementation details. For each feature, we outline how it will work, including UI elements, backend logic, and data interactions, along with edge cases and error handling.

## 3.1. - Live Camera Feeds (Video Surveillance)
Description: Display live video feeds from security cameras in the web UI. Initially, this will use simulated or static feeds (since actual camera integration is out of scope), but the design should allow plugging in real streams later.

Frontend Implementation: 
-  We will create a Camera Feed component (e.g., <CameraFeed />) that encapsulates the video display for one camera. It will accept props like camera name and streamUrl. The component renders a video element. If using an HTML5 <video> tag, we can preload a sample MP4/WebM video (perhaps a few seconds loop) to simulate motion. The video tag will have controls disabled (for continuous play) and auto-play muted (to not require user interaction for autoplay).
- Multiple <CameraFeed> components can be arranged in a grid layout using Tailwind CSS (responsive grid that wraps feeds). We will ensure this grid is scrollable or paginated if there are many cameras. This multiple camera feed grid layout is located on the Monitoring page. 
- Each feed might display the camera name overlay (e.g., a label at the bottom of the frame) and status LED (green dot for “online”). For simulation, status will always be online; in real integration, we might set status via heartbeat checks from cameras.
- The component will be a client component because it deals with potentially dynamic media and maybe interactive features (like full-screen on click). We may integrate Framer Motion to animate the appearance of video feeds (e.g., fade-in each feed tile when it loads, or animate on reordering).
- We handle errors: e.g., if the video fails to load (onerror event), the component can show an error overlay (“Camera offline”) and perhaps try reconnecting after a delay. For images, if an endpoint fails, we catch the fetch error and display a placeholder.

Backend Implementation: 
- We maintain a Camera database table with fields: an ID, name, stream URL (or path), location/description, and maybe an “active” flag.
- For now, the stream URL might point to a static asset (like a video file URL in public folder or an external placeholder stream). In a real scenario, it could be an RTSP URL or a link to a streaming service (like a MUX or WebRTC gateway).
- No heavy backend processing is needed for the simulated feed (we’re not actually transcoding or proxying video). 
- Role-based access: Both Admin and Operator roles can view camera feeds. We’ll enforce that only authenticated users can access the monitoring page. The middleware.ts will redirect unauthenticated users to login if they try to access these routes. 
- Future extensibility: The architecture should accommodate real feeds. That might involve integrating a streaming server or third-party video service. The spec’s placeholder approach means we are not handling video codecs or real-time transport; but we note that to integrate RTSP, one might use a proxy that converts RTSP to HLS/DASH or WebRTC. The front-end could then play those (with a library or built-in video tag for HLS). We aren’t implementing this now, but the code is structured so that switching the streamUrl to a real endpoint is straightforward.

### Edge cases & Error handling (Camera Feeds):
- Camera Offline: If a camera feed is unreachable (e.g., URL 404 or timeout), the UI should catch this. We can listen for <video> onstalled or onerror events. The error handler will display a user-friendly message on that tile. Possibly, it could attempt reconnection (e.g., reload video after 30 seconds) in case it was a transient issue.
- Slow Network / Video Lag: If the network is slow, video may lag or buffer. We can provide a loading spinner overlay on each feed until it starts playing. Shadcn Skeleton component can show a placeholder.
- Authorization: Ensure that camera endpoints cannot be accessed by non-users. This includes direct access to the video URL if it’s public.
- Number of Cameras: If a large number of camera feeds (say > 16 on one screen), browsers may struggle. We would then implement pagination (e.g., view 8 at a time) or require user to select which camera to view. For now, assume a manageable number (maybe up to 8-12 concurrently). The admin UI could let admin categorize cameras (by location or priority) to help manage this if needed.

## 3.2. - Real-Time Fire Alerts and Sensor Data
Description: Monitor multiple sensors (smoke, gas, temperature, moisture) in real-time and generate alerts for potential fire incidents. This includes streaming sensor readings to the UI (for display in gauges/charts) and pushing immediate alerts when thresholds are exceeded.

Sensor Data Model: 
- We conceptualize each sensor as an entity with a type (e.g., “Temperature Sensor #1 in Server Room”, type = temperature) and possibly a location or associated area. In the database we have a Sensor table: e.g., id, name, type, location. Types might be an enum of { temperature, smoke, gas } for clarity.
- Continuous readings from sensors are stored in a SensorReading table (or possibly separate tables per type, but a unified table is simpler). A reading record would include: id, sensor_id (FK), timestamp, value. For temperature sensors, value could be in °C; for smoke, it might be a particulate density or just a binary (detected/not detected); for gas, maybe concentration in PPM. For now, treat all as numeric values with an interpretation based on sensor type.

Backend Alert Generation: 
- For each sensor type, define threshold rules that indicate danger. E.g., if temperature > 80°C and smoke > 0 (detected) or gas > some ppm, we declare a fire alert. The logic could be simple threshold for each or a combination. For now, we can assume any sensor individually triggering beyond a critical threshold will create an alert of that sensor’s type (e.g., “High Temperature Alert”).
- Once an alert condition is detected:
    - Create an Incident entry in DB (type “fire” or more specific like “Temperature Threshold Exceeded”, sensor reference, timestamp, etc.).
    - Possibly also update the related sensor record (e.g., flag it as “in alarm” state).
    - The incident’s severity could be derived from how many sensors triggered (for example, if both smoke and heat sensors go off, mark as higher severity).
    - Immediately notify clients: We use the Realtime channel as described to broadcast a 'fire-alert' event with payload including incident ID, type, location. The payload might also include current readings or relevant info (e.g., “Temperature=85°C, Smoke detected”).
- WebSocket (Realtime) Setup: In the client code (likely in a context provider or in a top-level component on the dashboard), we initialize the Supabase client with our URL and anon key. We then subscribe to the channel. We ensure to handle the subscription status and reconnections. Supabase channels automatically try to reconnect if the socket is interrupted. We might still add some UI indication if the realtime connection is lost (e.g., a warning icon that real-time updates are paused).
- The sensor data updates (event 'sensor-update') allow us to animate gauges or charts smoothly. For example, a dashboard gauge showing current temperature will receive new values and we can use a nice animation via Framer Motion. 

Frontend Display: 
- In addition to charts described in the dashboard workflow, we might show numeric readouts or gauges for each sensor type:
    - A temperature widget (with current temp and maybe an icon).
	- A smoke indicator (simple text “Smoke Detected: Yes/No” or a colored icon).
	- A gas level bar or similar.
- Fire alert notifications on UI: When a 'fire-alert' event arrives, aside from adding to the list, we want a prominent UI cue:
    - Possibly a modal or pop-up saying “Fire Alert at [Location]!” with options to acknowledge. The modal can contain a button that navigates the user to the incident details or opens a camera view of that location.
    - We also highlight relevant UI: if the incident is linked to a particular camera, the camera feed tile could get a red border or flash to draw attention.

## 3.3. - Dashboard and Data Visualizations
Description: A comprehensive dashboard providing at-a-glance status of the system. It includes visual components such as charts, gauges, active alert list, and possibly a mini camera view. This is the main screen operators will monitor.

Features on Dashboard: 
- Active Alerts Panel: A component (likely top or side of dashboard) listing currently active incidents (unresolved alerts). Each entry might show the type (fire, etc.), location, time of alert, and an indicator if it’s acknowledged. The operator can click an entry to acknowledge or view details. We might color-code severity (e.g., red for critical alerts, yellow for warnings).
- Sensor Status Overview: We will show current values of key sensors, possibly as cards or small widgets:
	- e.g., “Temperature: 72°C” (with an icon and maybe a min/max of the day),
	- “Smoke: None” or “Smoke: Detected!”,
	- “Gas: 350 ppm (Normal)” etc.
- These might update live. For visualization, if applicable, a simple colored icon (green check vs red warning) can convey status (smoke present or not).
- Historical charts: For trends, we include charts: 
    - A line chart for temperature over time (e.g., last 1 hour or 24 hours). This could be implemented with a library like Chart.js or Recharts. We can integrate it in a React component that is a client component. On initial render, it uses data fetched from server (as prop or via a fetch on mount) and then subscribes to updates to append new points.
	- Perhaps a similar chart for gas levels, or a bar chart if that makes sense (like gas level vs time).
	- If multiple sensors of same type (like multiple temperature sensors in different rooms), we could overlay them or have separate charts. To keep it simple, maybe one representative sensor per type for now.
- Cameras on Dashboard: Optionally, a small selection of camera feeds can be shown (e.g., the 2 most important cameras). This could be a subset of the Camera Grid described earlier, possibly in a minimized form. For now, we assume either the dashboard shows 2 most important cameras (in small form) and link to a full cameras page (Monitoring page). 
- Navigation & Layout: The dashboard page likely has a header (with app title, maybe a logout button), and then a layout of panels. Tailwind CSS grid or flex can be used to arrange them. We ensure responsiveness: on smaller screens, panels stack vertically; on large screens, they can be side by side. The design system (shadcn) provides pre-built styles for cards and separators we can use for nice visuals.

Interactions on the Dashboard: 
- The dashboard is mostly read-only monitoring, except for responding to alerts. So interactions are primarily clicking an alert to handle it. We will implement that such that clicking an alert either opens the Incident detail (maybe a modal showing more info and an acknowledge button) or directly triggers an acknowledge confirmation.
- If we have charts, user might want to zoom or see details on hover. We can enable tooltip on chart points (most chart libs have this)
- Possibly allow filtering timeframe on charts (like a dropdown “Last 1h, 24h, 7d”).
- Possibly allow exporting the data in the view as some format. 

Data Fetching Strategy:
- Use Next.js Server Components to preload as much as possible:
    - E.g., the list of active incidents can be fetched in the server component for the dashboard (just querying incidents where status = active). That way, the initial HTML already contains current alerts.
	- Basic sensor current values can also be fetched server-side (like latest reading per sensor).
	- Chart historical data can be fetched server-side (like a small JSON timeseries embedded in the page or passed as props to the client chart component).
	- Camera list can be fetched if needed.
- After hydration, the client subscribes to realtime for any new data. We merge that with the initial state. For example, if a new alert comes in, it gets added to the active alerts state. We may use a state management approach for this:
    - Possibly a React Context (e.g., AlertContext) that holds an array of active alerts and provides methods to update (add alert, mark acknowledged). The realtime callback would call the context’s add method. Components like ActiveAlertsPanel subscribe to this context to re-render when it changes.
    - Alternatively, use a library like SWR (Stale-While-Revalidate) for the incident list, and then call mutate() on new events to append. But context or useState is fine for moderate complexity.
- Visualization components (charts) might internally manage their data state as well (like storing an array of points). The realtime subscription could feed into that.

- Accessibility: Ensure that visualizations also have textual indicators for screen readers if needed. For example, an active alert could be announced via an ARIA live region. We might add role="alert" on the alert toast so screen readers announce it as it appears. Non-visual users should still be able to navigate incidents (maybe as a list of text items).
- Alternate Displays: If an operator uses a tablet or phone, the dashboard should still function (though perhaps with a simpler layout due to smaller screen). Tailwind’s responsive utilities will help stack panels. We test that interactions like acknowledging still work on touch devices.

## 3.4. - Incident Logs (Historical Alerts Page)
Description: A page where all past incidents (alerts) are recorded and can be reviewed by date. It serves as a historical log of security events, with filtering, search and details for each incident. 

Display and Features:
- The Incident Log will be a table or list view. Each row includes: Date/Time of incident, Type (e.g., Fire, or specifically “Smoke Alarm” vs “Overheat”), Location/Associated device (if applicable), Status (acknowledged/resolved or unresolved), and the user who acknowledged (if any).
-  At the top, we can provide filters:
    - Date range picker (to show incidents within certain dates).
	- Filter by type (maybe checkboxes or dropdown for fire, smoke, etc.).
	- Filter by status (active vs resolved).
    - These filters will alter the query used to fetch incidents.
- If many incidents, pagination controls at bottom (like “Showing 1-50 of 200, [Next]”).
- Clicking on an incident entry could expand or navigate to a detail view:
	- Detail might show a longer description, the exact readings that triggered it
	- Also any notes or follow-up actions (if we implement adding notes, not in initial scope).
	- We might implement this detail as either a separate page (e.g., /incidents/[id]) or as an expand/collapse row or modal on the same page. For simplicity, perhaps a modal showing details when clicking a row.
- Design: Shadcn’s Table component (if available in the library) can be utilized for nice styling. We ensure alternating row colors or lines for readability. On mobile, tables can be tricky; we might stack fields or make it scrollable horizontally.

Data and Backend: 
- The Incident table in DB holds these records. Fields we expect: id (PK), timestamp, type (string or enum), sensor_id or camera_id (nullable references, depending on what triggered it or area involved), description (text maybe combining info like “Temp 85C, Smoke detected in Warehouse”), acknowledged_by (FK to users, nullable if not acknowledged), acknowledged_at, resolved (boolean or maybe an enum status). Possibly severity level too.
- Sorting: default sort by timestamp desc (latest first). Could allow user to sort by different columns if needed (not primary, but maybe by type).
- We ensure only authorized users access this page. Operators and Admins likely both can see it (since it’s part of their job).
- Acknowledgement on Log Page: If an incident is still open/unacknowledged by the time someone views the log, we might allow acknowledging from here as well. We can mark those with a button “Acknowledge”. The action behind it is same as from the dashboard – call the API or server action to update. Once acknowledged, the UI should update that row’s status and ack user. We should also broadcast if needed, but since this page will likely be reloaded on view, it might not have realtime subscriptions. We could consider having this page also subscribe to incident updates to reflect changes if others acknowledge incidents in real time. 
- We will not implement deletion in general for audit integrity, unless perhaps for test data cleanup.

Edge Cases & Error handling (Incident Log):
- Filtering UI: Need to handle cases where filter yields no results (show “No incidents found for criteria”). If an invalid filter combination is given (e.g., start date after end date), either correct it or show a message.
- Date/Time Precision: All timestamps are stored as UTC. When displaying, convert to local time or a chosen standard. Possibly include timezone in display to avoid confusion if users in different zones (could be just one site though).

## 3.5. - Role-Based Access Control (RBAC)
Description: The system defines two main roles – Admin and Security Operator – with different permissions. RBAC is enforced both in the UI (to show/hide features) and on the server (to protect routes and data).

Role Definitions: 
- Admin: Has full access to all features. Can manage (create/edit/delete) users and cameras, view all pages (dashboard, incidents, admin panel), acknowledge incidents, etc. Essentially superuser for this app.
- Security Operator: Has access to operational dashboards and logs, but not to admin management sections. Operators cannot create new users or cameras. They focus on monitoring and responding to incidents.

Implementation via NextAuth & App Logic:
- The users table in the DB includes a role field (likely a enum with values 'admin' or 'operator'). When a user logs in via NextAuth, we include this role in their session as noted earlier. This allows both frontend and backend to easily check role from the session.
- We will implement Next.js Middleware in middleware.ts to guard routes:
    - Configure matcher for all admin routes (e.g., "/admin/:path*"). In the middleware function, retrieve the token: const token = await getToken({ req, secret: NEXTAUTH_SECRET }); ￼. If no token (user not logged in), redirect to /login (NextAuth provides a default login page or we can have a custom).
    - If logged in but token.role !== 'admin', then block access. We can redirect them to /unauthorized or just / with a warning. We might have an unauthorized page saying “Access Denied”.
    - Allow the request to continue only if admin. This ensures even if an operator manually types an admin URL, they cannot access it
- Similarly, we protect API endpoints. NextAuth middleware runs on API routes as well (the same middleware covers /api/admin/*). Additionally, inside each admin API handler or server action, we can double-check session role. 

Frontend Conditional Rendering: 
- The UI will tailor navigation and content based on role:
    - The layout component can read session.user.role. If role is operator, it will not show the “Admin” menu section or links. If admin, show links to User Management, Camera Management.
	- Use of hooks: NextAuth provides a useSession() hook that returns session with role, or we can use SessionProvider and then session?.user.role.
	- This is convenient for experience but never relied on for security (since one could manipulate front-end). The true enforcement is on backend as described.

NextAuth Configuration for Roles:
- We will use NextAuth’s JWT strategy (the default) and include role in the token. This way, the middleware (which uses getToken to decode JWT) has the role readily
- We have to provide user.role in the first place when calling NextAuth. If using credentials, in the authorize() we will fetch the user from DB and return an object that includes the role.

Edge cases & challenges (RBAC)
- Public vs Auth Routes: Some routes (like the NextAuth sign-in, or a public home page if any) should be accessible without auth. Our middleware will be configured to skip those (e.g., not match /api/auth/** or the root if we allow a landing page). We’ll carefully set the matcher in middleware to include all protected paths and exclude others. The default NextAuth behavior also protects pages with useSession etc., but middleware is a stronger approach.

## 3.6. - User Management (Admin Feature)
Description: Admins can create, edit, and manage user accounts in the system.

UI and Workflow: 
- The User Management page (/admin/users) displays a list of all users. We can show in a table with columns: Name, Email, Role, Status, Actions (edit/delete).
- The list is fetched from DB via an admin API or server action on page load. We will likely create a server action like getAllUsers() that queries the users table and returns a list of users (excluding sensitive fields like password hash).
- Add User: A button “Add User” opens a form (either in-page or modal). Fields: Name, Email, Role (dropdown between Admin/Operator), and Password. If we prefer, we could generate a password automatically and email the user, but since no email service specified, we might just let admin input a temporary password. We enforce some password policy (min length etc.).
- On submission, the form triggers an action createUser (server action) which:
    1. Checks that the requester is admin (redundant if UI only shows to admin, but double-check on server).
    2. Validates inputs. Particularly, email must be unique. We handle this by catching DB unique constraint error or doing a pre-check if (await db.select().from(users).where(eq(users.email, email))).length > 0 then return error.
    3. Hashes the password. We can use a library like bcrypt. Since Next.js server environment can handle that, we will integrate bcrypt (or Node’s crypto if simpler). e.g., const hash = await bcrypt.hash(password, 10).
    4. Inserts into users table via Drizzle
    5. If insertion succeeds, return success. If fails (e.g., DB error), catch and return appropriate error message.
- After creation, the UI adds the new user to the list (we can either re-fetch the whole list or optimistically append the returned user to state).
- Edit User: Possibly allow editing name or role. This could be inline or via an edit form. Role change is the main one. Implemented with a similar approach: an action updateUserRole(userId, newRole) that admin triggers. This updates the DB (and ideally should cause the affected user’s session to update or invalidate as discussed).
- Disable/Delete User: We might allow disabling (soft deleting) accounts instead of permanent deletion (to preserve incident assignments). A simple approach: add a boolean active field to user. If an account is deactivated, they cannot login (we modify NextAuth authorize to check active flag, or we could even remove their NextAuth sessions). The UI would show inactive users with a different style. The admin could click “Disable” on a user, and the server action sets active=false. If we want permanent delete (maybe allowed if the user never did anything), we can also implement delete. But careful: if user has references (e.g., acknowledged incidents), deleting might orphan those. Probably better to never fully delete. We clarify that in our design: use a soft-delete strategy.

Backend implementation: 
- We have a User table defined (or NextAuth’s default plus extension). Using Drizzle, define columns:
    - id (uuid or serial),
	- username (varchar),
	- email (varchar, unique),
	- password_hash (varchar),
	- role (enum),
	- active (boolean, default true),
	- maybe created_at and updated_at timestamps.
- Ensure a unique index on email at DB level (to prevent duplicates).
- Provide functions or use Drizzle query methods for create, update, etc., as described.
- We log certain actions: user creation, deletion, role change, etc., to AuditLog table. Fields might be: action (“create_user”/“update_user”/“disable_user”), target user id, admin user id who performed it, timestamp. This is separate from incidents, likely only admin can see this log if at all.
- Authentication integration: When a new user is created, how can they login? If using NextAuth credentials:
    - The credentials authorize will simply find the user by email and check password hash. So once we insert them, they can login.
- We need to initialize at least one Admin user so that there’s an admin to manage others. Possibly via a database seed or environment variable. (We could treat the first registered user as admin by default, but since there’s no public registration, maybe the dev or DB must insert an initial admin.)

Edge Cases & error handling (user management): 
- Duplicate Emails: As mentioned, handle the case gracefully. The action should return an error that the UI displays near the email field (“Email already exists”).
- Weak Password: If we enforce password rules, the form should validate and show error if not met (client-side validation can catch length, but do server-side too in case).
- No Role Selected: If the form somehow doesn’t have a role (maybe our UI default to operator if not chosen). But ensure a role is always set. If not, default to ‘operator’.
- Permissions: Only Admin sees the user page and only Admin actions call these endpoints. If a non-admin somehow triggers createUser, the server will reject (session role check).
- Editing Self: If an admin edits their own account (e.g., change their role – which doesn’t make sense to remove their own admin, we should prevent removing one’s own admin status). Also maybe prevent an admin from deactivating themselves or deleting themselves. That could lead to no admin left if done accidentally. We ensure at least one admin remains active in the system. This can be done by checking: if trying to change the last admin to operator or disabling the last admin, abort with an error. We need a query to count current active admins.
- Audit Trail: For compliance, every addition or change in user accounts should be auditable. We will ensure audit log entries for create/update/disable as described. This helps if we need to investigate admin actions. 

## 3.7. - Camera Management (Admin Feature)
Description: Admins can add, edit, or remove camera entries that define which video streams are available in the system.

UI and Workflow:
- The Camera Management page (/admin/cameras) lists all cameras in the system with fields: Name, Location (if provided), Stream URL, and maybe an “Active” status (if we want to allow temporarily disabling a feed).
- A button “Add Camera” opens a form (in-page or modal). Fields: Name (string), Location/Area (string, optional), Stream URL (string). The stream URL could be an IP address or RTSP URL. We might also include a field for a camera ID or code if needed, but name should suffice as an identifier in UI.
- On submission, an action createCamera runs on server:
    1. Validate: ensure name is not empty; URL format is somewhat valid (maybe regex for a URL). We might allow duplicate names if two cameras at different locations have same name – better to encourage unique name but not strictly enforce unless required.
    2. Insert into cameras table (via Drizzle). Fields: name, location, url, created_by (admin’s user id, if we track who added it), created_at.
    3. Return the created record (or at least the new ID).
- The UI updates the list with new camera (optimistically or via re-fetch).
- Edit Camera: Possibly clicking a camera or an “Edit” button allows changing its fields (name, URL). Implementation: an updateCamera(id, newData) action. Similar pattern: update DB record, handle errors. For example, if the URL is updated to an invalid link, we should warn. Editing might not be heavily used, so we can also consider just deleting and re-adding if simpler, but better to support update.
- Remove Camera: The list might have a delete icon on each row. Clicking it prompts “Are you sure?”. On confirmation, calls deleteCamera(id) action.
- The UI then removes the camera row. We may also want to update any front-end state – e.g., if the dashboard is currently showing that camera feed, it should be removed. That could require the dashboard to listen to camera list changes or simply reload next time. For simplicity, requiring a page refresh to update cameras on dashboards is acceptable in an admin operation context.

Database: 
- Camera table fields: id (PK), name, location, stream_url, created_at, created_by (FK to users). Possibly active flag if we want to temporarily disable a camera without deleting (e.g., under maintenance).
- Cameras are not associated with the sensors at this stage of the project. 

Integration: 
- The new cameras should reflect in the operator UI. Since operators fetch camera list on load, a newly added camera will appear on their dashboard next time they load it. 

## 3.8. - Audit and Access Logging
Description: Behind the scenes, the system logs critical actions and access events for security auditing. This ensures traceability of who did what and when, which is vital in a security system.

What to log: 
- User Authentication events: Successful logins (with timestamp and user ID). We can at least log successful login times in the user table (update a last_login_at field).
- User Management actions: Creation of a user, deletion/disable, role changes – with admin’s ID and timestamp. The audit entry would contain the target user and details of change.
- Camera Management actions: Addition, removal, edit of camera – with admin ID and timestamp, and what changed.
- Incident management: Acknowledgment of an incident by an operator – log which user acknowledged incident X at time Y. Also if an incident is auto-resolved or timed out, log that (if we do such logic).

Implementation: 
- AuditLog Table: A table in DB to store logs. Schema: id (PK), timestamp, user_id (who did it, nullable if system), action_type (string or enum), description (text). Alternatively, break description into structured fields: e.g., entity_type (‘user’,‘camera’,‘incident’), entity_id (if applicable, e.g., user id that was changed), action (‘create’,‘update’,‘delete’,‘acknowledge’), details (maybe JSON or text for any extra info like old vs new values). For simplicity, we can keep a freeform description text that combines everything, plus maybe some coded fields for filtering.
- Whenever one of the above events happens in server code, we insert an audit log entry. For example:
    - In createUser action (after success): insert log: user_id = current admin’s ID, action = ‘create_user’, description = Created user ${newUser.email} with role ${newUser.role}.
    - In updateUserRole: description = Changed role of user ${user.email} from X to Y.
    - In deleteCamera: description = Removed camera ${cam.name}.
    - In acknowledgeIncident: user_id = operator’s ID, action = ‘ack_incident’, description = Incident ${incident.id} acknowledged by ${operator.name}.
    - For logins: We can hook into NextAuth events. NextAuth has an event callback events.signIn where we get user and can log login. 
- Secure Storage: The audit logs are in the main DB; ensure proper permissions (only admin queries it if UI provided). The data might contain sensitive info (like user emails, etc.), but it’s internal.
