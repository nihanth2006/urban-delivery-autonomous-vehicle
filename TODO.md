# TODO: Integrate Frontend and Backend for Production

- [x] Update frontend/src/utils/api.js to use environment variable for API_BASE_URL
- [x] Create frontend/.env.production with REACT_APP_API_URL=https://urban-delivery-autonomous-vehicle-1.onrender.com/api
- [x] Update backend/app/main.py to add Vercel frontend domain to CORS allow_origins
- [ ] Fix profile fetching on login: update API calls to use /users/me, ensure profile details are fetched and stored in localStorage
- [ ] Update AuthenticationPage.jsx to use api.js for profile fetch instead of direct fetch
- [ ] Update ProfilePage.jsx to use correct API for profile update
- [ ] Handle case where user exists in Firebase but not in DB on login
