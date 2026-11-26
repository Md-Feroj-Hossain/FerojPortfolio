# Md Feroj Hossain — Portfolio Website

A mobile-first portfolio website with a Supabase-powered admin panel. Built with plain HTML, CSS and vanilla JavaScript (no build tool required).

## Project files

- `index.html` — public portfolio
- `style.css` — responsive styles and theme variables
- `script.js` — public rendering and Supabase content loading
- `config.js` — Supabase URL and public publishable/anon key
- `admin/index.html` — private admin interface (`noindex`)
- `admin/admin.js` — Supabase Auth, editing, uploads and publishing
- `admin/admin.css` — admin styles
- `supabase_schema.sql` — database, RLS and storage policies
- `assets/` — SVG placeholders and favicon

## Important email check

The email supplied during the interview was `feroj8954@gmail`. It appears incomplete because it has no domain ending such as `.com`. Before creating the Supabase Auth admin user, confirm and use the correct, valid email address. The public portfolio email is also prefilled with the supplied text; update it in Admin → Site after confirming the correct address. Do not share your password in chat.

## 1. Create a Supabase project

1. Open [https://supabase.com](https://supabase.com) and sign in or create an account.
2. Create a new project and choose an organization, project name, database password and region.
3. Save the database password somewhere private. It is not the website login password.
4. Wait for the project to finish provisioning.

## 2. Run the SQL schema

1. In the Supabase project dashboard, open **SQL Editor**.
2. Choose **New query**.
3. Open this project's `supabase_schema.sql`, copy all its contents and paste into the SQL Editor.
4. Click **Run**.
5. Check **Table Editor** for the `portfolio` table.
6. Open **Storage** and check that the `portfolio-media` bucket exists.

The table allows public SELECT. INSERT, UPDATE and DELETE are limited by RLS to the authenticated user whose UUID is in `owner_id`. Storage object paths must begin with the authenticated user's UUID, which the admin upload code does automatically.

## 3. Create the admin user and disable public sign-ups

1. In Supabase, open **Authentication → Users**.
2. Choose **Add user** / **Create new user**.
3. Enter your confirmed, valid admin email and set a strong password.
4. Confirm the user if the dashboard offers an email-confirmation option.
5. Open **Authentication → Settings** (the exact label may vary by dashboard version).
6. Disable **Allow new users to sign up** / public sign-ups.
7. Keep your admin credentials private. Do not add a password to any project file.

Only the account you create should be used as the portfolio owner. The RLS policies check the authenticated user's UUID, not an email string.

## 4. Configure the public Supabase keys

1. Open **Project Settings → API** (or **API Settings**).
2. Copy the **Project URL**.
3. Copy the **publishable key**. If your project shows the older `anon` public key instead, that key can also be used in a browser.
4. Open `config.js` and replace the placeholders:

```js
window.PORTFOLIO_CONFIG = {
  supabaseUrl: "https://YOUR-REAL-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_PUBLISHABLE_OR_ANON_KEY",
  tableName: "portfolio",
  storageBucket: "portfolio-media"
};
```

5. Save the file and upload the updated project to GitHub.

### Which key is public?

- The Supabase **publishable** key (or legacy **anon** key) is designed to be used in browser applications. It is visible to visitors, so database and storage security must come from RLS and storage policies.
- The **service_role** key is secret and bypasses RLS. NEVER put it in `config.js`, HTML, JavaScript, GitHub, or any browser-accessible file.
- Never put database passwords, SMTP credentials, or admin passwords in this repository.

## 5. First admin login and initial publish

1. Open your deployed site at `/admin/`.
2. Sign in using the Supabase admin user's valid email and password.
3. Edit the fields and choose **Save & Publish**.
4. On the first publish, the admin inserts the single portfolio row with its own `owner_id`.
5. The public homepage reads that row from Supabase.

If you have not configured Supabase yet, the public site displays its built-in sample content.

## 6. Uploading images and CV

1. Sign in to `/admin/`.
2. Open **Media** to upload a profile photo, logo, CV PDF or hero background image.
3. Open **Site → Projects** to upload an image for an individual project.
4. The uploaded files are stored under a folder named with your Supabase Auth user UUID.
5. Public URLs are used in the portfolio content. Because the bucket is public, anyone with a file URL can view that file. Do not upload private documents.

The CV is a public PDF in this starter. Only upload a CV you are comfortable making public.

## 7. Deploy on Vercel

### Upload project to GitHub

Option A — GitHub website:
1. Create a new repository at [https://github.com/new](https://github.com/new).
2. Choose a repository name such as `feroj-portfolio`.
3. Keep it public or private as you prefer.
4. Use **Add file → Upload files** and upload the project files and folders.
5. Commit the changes.

Option B — GitHub Desktop:
1. Install GitHub Desktop from [https://desktop.github.com](https://desktop.github.com).
2. Choose **Add an Existing Repository** and select this project folder.
3. If needed, choose **Create a repository**.
4. Commit to main and click **Publish repository**.

### Import into Vercel

1. Open [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Choose **Add New → Project**.
3. Import the `feroj-portfolio` repository.
4. Framework Preset: **Other**.
5. Build Command: leave blank.
6. Output Directory: `.` (repository root).
7. Click **Deploy**.
8. When deployment finishes, open the generated Vercel URL.
9. Check the homepage and then visit `https://YOUR-VERCEL-DOMAIN/admin/`.

No build command is needed because this is a static HTML/CSS/JavaScript project.

## 8. Custom domain (optional)

1. In Vercel, open your project → **Settings → Domains**.
2. Add your domain.
3. Follow the DNS records Vercel provides at your domain registrar.
4. Wait for DNS verification and HTTPS provisioning.

## 9. How updates work

- Content, colours, project details and uploaded media can be updated from `/admin/`; after **Save & Publish**, the public website reads the new Supabase content without a new Vercel deployment.
- Code, layout or CSS changes require a Git commit and push to the connected GitHub branch. Vercel then builds/deploys automatically.
- Keep a JSON backup before major content changes.

## 10. Common errors and fixes

### Blank page
- Confirm `index.html`, `style.css`, `script.js` and `config.js` are at the repository root.
- Check browser developer tools → Console for errors.
- Confirm the Vercel output directory is `.` and there is no incorrect framework build command.

### Images do not appear
- Check that the upload completed and the bucket name is exactly `portfolio-media`.
- Confirm the image URL is a valid HTTPS URL and the object is in the public bucket.
- Try opening the public URL in a private browser tab.
- If an image fails, the public page uses a placeholder.

### Login fails
- Confirm the admin user exists under Authentication → Users.
- Use the correct, valid email address and password.
- Check that `config.js` has the correct project URL and publishable/anon key.
- Check that the browser can load the Supabase CDN library.
- Make sure you did not disable sign-in itself; disable public sign-ups, not existing-user sign-in.

### RLS error / permission denied
- Run `supabase_schema.sql` in the correct Supabase project.
- Confirm the admin is signed in and `owner_id` matches that Auth user's UUID.
- Do not use the service_role key in the browser to bypass RLS.
- For uploads, the object path must start with the authenticated user's UUID. The supplied admin upload code does this.

### CORS / network error
- Check the project URL, internet connection and Supabase project status.
- Ensure the URL is copied exactly, including `https://`.

## 11. Launch checklist — check these 10 items

- [ ] 1. Confirm the correct full name: **Md Feroj Hossain**.
- [ ] 2. Replace the incomplete email `feroj8954@gmail` with the correct valid email.
- [ ] 3. Add your real profile photo and check its crop.
- [ ] 4. Review your bio, education, skills and volunteering details.
- [ ] 5. Add project descriptions and real project images.
- [ ] 6. Add correct social profile URLs and test each link.
- [ ] 7. Create the Supabase admin user and disable public sign-ups.
- [ ] 8. Run the SQL schema and verify RLS and storage policies.
- [ ] 9. Confirm `config.js` contains only the public URL and publishable/anon key — never service_role.
- [ ] 10. Test the public site, `/admin/`, mobile layout, uploads, JSON backup and Save & Publish.

## Security notes

- Frontend input is rendered as text or HTML-escaped before insertion.
- Links are restricted to HTTP, HTTPS and mailto schemes.
- The admin route is marked `noindex`; this is not access control. Supabase Auth and RLS provide the actual protection.
- This starter is intended for one trusted admin. Keep the admin password private and use a strong password.
