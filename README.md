# Movie / Show Watchlist — Full-Stack Django + React Project

## Project Overview
This project is a private Movie / Show Watchlist application built with Django and React. Authenticated users can keep track of movies and TV shows they want to watch, mark them as watched, and rate them using a 5-star rating system.

## Features
* **JWT authentication**: Secure login and registration using DRF SimpleJWT.
* **Private watchlists**: Every user's data is isolated; you can only see your own media.
* **Movie/TV classification**: Track media as either a Movie or a TV Show.
* **To Watch/Watched tabs**: Easily organize media between what you plan to watch and what you have already watched.
* **Status updates**: Mark media as watched and optionally move it back to 'To Watch'.
* **Five-star ratings**: Rate watched media from 1 to 5 stars.
* **Delete functionality**: Remove media you no longer wish to track with a confirmation prompt.

## Tech Stack
* **Backend**: Django, Django REST Framework (DRF), `djangorestframework-simplejwt`, `django-cors-headers`, SQLite.
* **Frontend**: React (Vite), React Router DOM, Axios, Vanilla CSS.

## Project Structure
```text
movie-watchlist/
├── backend/                  # Django backend
│   ├── movie_project/        # Django project settings and URLs
│   ├── watchlist/            # Django app for models, views, and APIs
│   ├── manage.py             # Django management script
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React frontend
│   ├── public/               # Static public assets
│   ├── src/                  # React source code
│   │   ├── api/              # Axios configuration with interceptors
│   │   ├── components/       # Reusable UI components (MediaCard, etc.)
│   │   ├── context/          # Global AuthContext
│   │   ├── pages/            # View components (Login, Register, Watchlist)
│   │   ├── App.jsx           # Router configuration
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Styling and design system
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
└── README.md                 # Project documentation
```

## Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd movie-watchlist/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```

## Frontend Setup
1. Open a terminal and navigate to the frontend directory:
   ```bash
   cd movie-watchlist/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
This project does not require any environment variables for local development. SQLite is used out-of-the-box and the SECRET_KEY is included in settings for local use.

## API Endpoints
* `POST /api/token/` - Obtain JWT tokens.
* `POST /api/token/refresh/` - Refresh access token.
* `POST /api/register/` - Register a new user.
* `GET /api/media/` - List user's media (supports `?status=watched` and `?status=unwatched`).
* `POST /api/media/` - Create new media.
* `GET /api/media/<id>/` - Retrieve a media item.
* `PATCH /api/media/<id>/` - Update a media item (e.g., status or rating).
* `DELETE /api/media/<id>/` - Delete a media item.

## Authentication Architecture
Authentication is managed via `djangorestframework-simplejwt`. 
* **Access token**: Short-lived token used to authenticate API requests.
* **Refresh token**: Longer-lived token used to silently renew the access token when it expires.
* **Axios interceptor**: A centralized interceptor automatically catches `401 Unauthorized` responses, retrieves a new access token using the refresh token, and retries the failed request.
* **Protected routes**: React routing ensures that unauthenticated users are seamlessly redirected to the login page.

## Data Isolation
Ownership is strictly enforced at the database and viewset level. The `Media` model requires an `owner` (ForeignKey to User). The `MediaViewSet` filters all querysets using `Media.objects.filter(owner=self.request.user)`, guaranteeing that a user can never access, edit, or delete another user's data.

## Running Locally
1. Start the Django backend (in one terminal):
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py runserver 8000
   ```
2. Start the Vite frontend (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`.

## Testing
### Backend Tests
The Django tests verify authentication behavior, data isolation, invalid input handling, and endpoint functionality.
To run tests:
```bash
cd backend
source venv/bin/activate
python manage.py test
```

### Browser Testing
Browser testing ensures real-world usability and UI verification. It covers all core flows including registration, login/logout, CRUD operations, and responsive behavior.
- Use a browser automation script or interact manually following the test checklist below.

## Browser Test Checklist
- [x] Register page loads and allows user registration.
- [x] Login page authenticates valid users and handles errors.
- [x] Unauthenticated users are redirected from the dashboard.
- [x] Main dashboard displays 'To Watch' and 'Watched' tabs.
- [x] 'Add Media' modal opens, captures input (title, type, status), creates item, and closes smoothly.
- [x] Media items appear correctly in the 'To Watch' tab.
- [x] Clicking 'Mark as Watched' dynamically moves media to the 'Watched' tab.
- [x] 5-star rating component is interactive and successfully sends updates to the backend.
- [x] Ratings persist correctly after a page reload.
- [x] 'Delete' button triggers a confirmation dialog.
- [x] Confirming deletion removes the item from the UI and backend.
- [x] User B cannot see User A's media.
- [x] Layout is responsive on desktop, tablet, and mobile views.
- [x] Logout correctly ends the session and returns to the login screen.

## Troubleshooting
* **CORS Errors**: Ensure the frontend is running on `localhost:5173` or add your origin to `CORS_ALLOWED_ORIGINS` in `settings.py`.
* **Refresh token failing**: Clear localStorage or log in again to reset the token state.
* **Port conflicts**: Make sure no other service is occupying port `8000` (Django) or `5173` (Vite).

## Future Deployment
Deployment is intentionally not part of this project. However, the stack is deployment-ready:
* **Frontend**: Can be built via `npm run build` and hosted on Vercel, Netlify, or Firebase Hosting.
* **Backend**: Can be hosted on Heroku, Render, or Railway with a managed PostgreSQL database, using WhiteNoise to serve static files and `gunicorn` as the WSGI server.
