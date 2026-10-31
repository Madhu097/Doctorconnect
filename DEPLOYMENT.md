# DoctorConnect Deployment Guide

This guide deploys DoctorConnect using free-tier services:

- **Patient frontend:** Vercel
- **Admin and doctor frontend:** Vercel
- **Node/Express API:** Render
- **Database:** MongoDB Atlas M0
- **Images:** Cloudinary

The application currently uses a **demo payment flow**. It looks like a checkout but does not charge real money.

## 1. Prepare the project

Before deploying:

1. Make sure the project builds locally.
2. From `frontend`, run:

   ```powershell
   npm install
   npm run build
   ```

3. From `admin`, run:

   ```powershell
   npm install
   npm run build
   ```

4. From `backend`, run:

   ```powershell
   npm install
   npm start
   ```

5. Confirm the backend health endpoint works:

   ```text
   http://localhost:4000/health
   ```

Do not upload `.env` files or commit passwords, JWT secrets, MongoDB credentials, or Cloudinary secrets.

### Keep the backend running locally

Use the development command from the `backend` directory:

```powershell
npm run dev
```

Nodemon watches the backend source files and automatically restarts the server after code changes or a recoverable crash. Keep this terminal open. Closing the terminal or pressing `Ctrl+C` intentionally stops the server.

For a long-running production process, use the hosting platform's Node start command:

```text
npm start
```

Free Render services may sleep after inactivity; this cannot be disabled on the free tier. Use a paid always-on instance or another always-on host if the API must never sleep.

## 2. Create a MongoDB Atlas database

1. Open [MongoDB Atlas](https://www.mongodb.com/atlas) and create an account.
2. Create a free **M0** shared cluster.
3. Choose a region near your users.
4. Create a database user and generate a strong password.
5. In **Network Access**, add the backend server access:
   - For a simple free deployment, add `0.0.0.0/0`.
   - Use a strong database password because this allows connections from any IP.
6. Select **Connect > Drivers**.
7. Copy the connection string.
8. Replace the password placeholder and use it as `MONGODB_URI`.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doctorconnect
```

## 3. Create a Cloudinary account

1. Open [Cloudinary](https://cloudinary.com/) and create an account.
2. Open the Cloudinary dashboard.
3. Copy:
   - Cloud name
   - API key
   - API secret
4. Add them to the Render environment variables as shown below.

Cloudinary stores uploaded patient profile images and doctor images used by the backend.

## 4. Deploy the backend to Render

1. Open [Render](https://render.com/) and sign in with GitHub.
2. Push the DoctorConnect project to a GitHub repository.
3. Select **New > Web Service**.
4. Select the repository.
5. Configure the service:

   | Setting | Value |
   |---|---|
   | Root Directory | `backend` |
   | Runtime | `Node` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Health Check Path | `/health` |
   | Instance Type | Free |

6. Add these environment variables:

   | Variable | Value |
   |---|---|
   | `PORT` | `4000` |
   | `MONGODB_URI` | MongoDB Atlas connection string |
   | `CLOUDINARY_NAME` | Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Cloudinary API key |
   | `CLOUDINARY_SECRET_KEY` | Cloudinary API secret |
   | `ADMIN_EMAIL` | Production admin email |
   | `ADMIN_PASSWORD` | Strong production admin password |
   | `JWT_SECRET` | Long random secret |
   | `CORS_ORIGINS` | Add the patient and admin URLs after deploying them |

7. Deploy the service.
8. Copy the Render URL, for example:

   ```text
   https://doctorconnect-api.onrender.com
   ```

9. Open:

   ```text
   https://doctorconnect-api.onrender.com/health
   ```

The response must show:

```json
{
  "success": true,
  "database": "connected"
}
```

The free Render service may sleep after inactivity. The first request after sleeping can take several seconds.

## 5. Deploy the patient frontend to Vercel

1. Open [Vercel](https://vercel.com/) and sign in with GitHub.
2. Select **Add New > Project**.
3. Import the DoctorConnect repository.
4. Configure:

   | Setting | Value |
   |---|---|
   | Root Directory | `frontend` |
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

5. Add this environment variable:

   ```env
   VITE_BACKEND_URL=https://doctorconnect-api.onrender.com
   ```

6. Deploy and copy the patient URL.

## 6. Deploy the admin and doctor frontend to Vercel

The admin and doctor login are in the `admin` application.

1. Create another Vercel project from the same repository.
2. Configure:

   | Setting | Value |
   |---|---|
   | Root Directory | `admin` |
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

3. Add:

   ```env
   VITE_BACKEND_URL=https://doctorconnect-api.onrender.com
   ```

4. Deploy and copy the admin URL.

## 7. Configure CORS

Return to the Render backend service and update `CORS_ORIGINS` with the exact Vercel URLs:

```env
CORS_ORIGINS=https://doctorconnect-patient.vercel.app,https://doctorconnect-admin.vercel.app
```

Do not add a trailing slash. If you add a custom domain later, replace or append the exact custom domain.

After changing environment variables, redeploy or restart the Render service.

## 8. SPA routing

Both Vercel projects are React single-page applications. If refreshing a nested route shows a 404, configure a rewrite to send application routes to `index.html`.

Create `vercel.json` inside both `frontend` and `admin`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Redeploy the affected Vercel project after adding the file.

## 9. Verify the deployment

### Backend

- Open `/health`.
- Confirm the database status is `connected`.
- Confirm the Render logs contain no missing environment variable errors.

### Patient application

- Register a new patient.
- Log in and log out.
- Confirm doctors load.
- Confirm unavailable doctors cannot be booked.
- Book an available appointment.
- Confirm the appointment appears in **My appointments**.
- Test cancellation.
- Test the demo card and UPI checkout.
- Confirm the appointment changes to **Paid**.

### Admin application

- Log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Confirm the doctor list loads.
- Edit a doctor.
- Change doctor availability.
- Confirm the patient frontend reflects availability.
- Open the appointments list and confirm newest appointments appear first.

### Doctor application

- Log in with a doctor account.
- Confirm the dashboard and profile load.
- Change availability.
- Confirm appointments are visible.
- Mark an appointment completed.

## 10. Common problems

### CORS error in the browser

Check `CORS_ORIGINS` on Render. It must contain both frontend URLs exactly, with no trailing slash. Restart the backend after changing it.

### Frontend says it cannot connect to the API

Check the Vercel environment variable:

```env
VITE_BACKEND_URL=https://doctorconnect-api.onrender.com
```

Redeploy after changing environment variables. Do not include `/api` at the end; the application adds the API paths itself.

### Backend returns 503 from `/health`

Check:

- `MONGODB_URI`
- MongoDB database user and password
- Atlas network access
- Render logs

### Cloudinary errors

Check all three Cloudinary variables and confirm the API secret was copied correctly.

### Nested frontend URL returns 404

Add the `vercel.json` rewrite described above and redeploy.

### First backend request is slow

This is expected when the free Render service has gone to sleep.

### Login works locally but not after deployment

Check that both frontends use the deployed Render URL and that the backend has the correct `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET`.

## 11. Security checklist

- Use a unique production `JWT_SECRET`.
- Use a strong production admin password.
- Never commit `.env` files.
- Do not expose Cloudinary API secrets in frontend variables.
- Do not put `MONGODB_URI` in Vercel.
- Rotate credentials that were used during development.
- Review MongoDB Atlas access rules before public production use.
- Monitor free-tier limits on Render, Vercel, MongoDB Atlas, and Cloudinary.

## 12. Updating the application

After deployment:

1. Make changes locally.
2. Run the patient and admin builds.
3. Run backend syntax checks.
4. Push changes to GitHub.
5. Vercel and Render automatically deploy the new commit.
6. Repeat the verification checklist.

The deployment uses separate services, so a frontend change normally redeploys only its Vercel project, while backend changes redeploy the Render service.
