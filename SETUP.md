# SETUP GUIDE: Launching Lotus in 7 Click-by-Click Steps

Follow these exact numbered steps to deploy Lotus to your free GitHub Pages site. No credit card or paid subscription is required at any point.

---

### Step 1: Create a free GitHub account
*(If you already have a GitHub account, skip directly to Step 2.)*
1. Go to [https://github.com/join](https://github.com/join).
2. Enter your email, create a secure password, and pick a username.
3. Verify your email address to activate your account.

---

### Step 2: Create a new public repository & push files
1. Log in to GitHub and click the **`+`** icon in the upper right corner, then select **New repository**.
2. Set the repository name to: **`daily-brief`**.
3. Under privacy, ensure **Public** is selected (GitHub Pages is 100% free for public repositories).
4. Leave "Add a README file" unchecked and click the green **Create repository** button.
5. In your project workspace, push your codebase to this new repository:
   ```bash
   git remote add origin https://github.com/<your-username>/daily-brief.git
   git branch -M main
   git push -u origin main
   ```
   *(Alternatively, use the web interface: click **Add file** → **Upload files**, drag the project folder contents, and commit to `main`.)*

---

### Step 3: Generate a free Gemini API key
1. Navigate to Google AI Studio at [https://aistudio.google.com/](https://aistudio.google.com/).
2. Sign in with your Google account.
3. In the top navigation or left sidebar, click the **Get API key** button.
4. Click **Create API key** (or **Create API key in new project**).
5. Copy the generated key to your clipboard. **No credit card is required.**

---

### Step 4: Add the API key to GitHub Secrets
1. In your GitHub repository, click on the **Settings** tab near the top.
2. In the left sidebar, click **Secrets and variables**, then click **Actions**.
3. Under the *Repository secrets* section, click the green **New repository secret** button.
4. Set the **Name** field to: `GEMINI_API_KEY` *(exact uppercase spelling required)*.
5. Paste your API key from Step 3 into the **Secret** box.
6. Click **Add secret**.

---

### Step 5: Enable GitHub Pages deployment
1. While still in repository **Settings**, click on **Pages** in the left sidebar under the "Code and automation" section.
2. Under **Build and deployment**, look at the **Source** dropdown.
3. Change the dropdown from "Deploy from a branch" to: **`GitHub Actions`**.
4. You will see a banner confirming GitHub Actions is now authorized to publish Pages.

---

### Step 6: Trigger the first automated run
1. Click on the **Actions** tab at the top of your GitHub repository.
2. In the left sidebar under "All workflows", click on **Daily Brief Pipeline & Deploy**.
3. On the right side, click the **Run workflow** dropdown button.
4. Keep the branch set to `main` and click the green **Run workflow** button.
5. Watch the workflow execute (takes approximately 1 to 2 minutes to fetch sources, query Gemini, validate items, build the static site, and deploy).

---

### Step 7: Verify your live website
1. Open your browser and navigate to: `https://<your-username>.github.io/daily-brief/`
2. Confirm that today's date appears in the masthead.
3. Verify that the **DEMO DATA** badge has disappeared, replaced by today's fresh verified edition.

---

## How to Confirm It Is Working Properly

1. **GitHub Actions green checkmark:** In your repository's **Actions** tab, the workflow run will have a green checkmark icon.
2. **Committed JSON:** In the `data/editions/` folder, you will see a newly committed JSON file named with today's date (`YYYY-MM-DD.json`).
3. **Daily schedule:** The workflow will automatically fire every morning at **05:00 UTC** without needing any manual triggers.

---

## Troubleshooting First Run Failures

If your workflow run displays a red cross, click into the run and examine the log. The 3 most common causes and fixes:

1. **Missing or misspelled Secret:**
   - *Error:* `GEMINI_API_KEY is not defined` or `401 Unauthorized`.
   - *Fix:* Ensure the secret name is exactly `GEMINI_API_KEY` in Settings → Secrets and variables → Actions.
2. **Pages Source not set to GitHub Actions:**
   - *Error:* `Deployment failed: Pages not enabled for GitHub Actions`.
   - *Fix:* Go to Settings → Pages → Source, and choose **GitHub Actions**.
3. **Gemini Free-Tier Rate Limit (429):**
   - *Error:* `ResourceExhausted: 429 Rate limit exceeded`.
   - *Fix:* The pipeline contains automatic exponential backoff. Simply re-run the workflow after 60 seconds; cached items will not be re-queried.

---

## How to Edit an Edition (Corrections) in GitHub Web Editor

To correct a typo or update an item after publication:
1. In your GitHub repository, open `data/editions/YYYY-MM-DD.json`.
2. Click the pencil icon (**Edit this file**) in the top right.
3. Locate the item by ID or headline, update the text, and add:
   ```json
   "correctedDate": "2026-10-26",
   "correctionNote": "Updated funding lead investor following company confirmation."
   ```
4. Click **Commit changes...**. GitHub Actions will automatically rebuild and deploy the corrected edition with a visible "Corrected" tag.

---

## Optional: Custom Domain Setup (Free)
If you own a custom domain (e.g., `dailybrief.yourdomain.com`):
1. In repository **Settings** → **Pages**, enter your domain in the **Custom domain** box.
2. In your DNS provider (Cloudflare, Namecheap, Google Domains), add a CNAME record pointing to `<your-username>.github.io`.
3. Check the **Enforce HTTPS** box in GitHub Pages.
