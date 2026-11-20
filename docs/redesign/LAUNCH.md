# Launch checklist

What you do, in this order, to put the new Cipher4 website live. Each step
says what to click or type, and what you should see. Do not skip ahead: each
step checks the one before it.

Everything is ready on your laptop on the `redesign` branch. Nothing has been
pushed to GitHub yet.

---

## Before you start

- Plug the laptop in.
- Close any running preview (`npx nuxi preview`): press Ctrl+C in its window.
- Have these ready: your GitHub login for **decobwebs**, your Vercel login,
  and your Web3Forms access key.
- Allow about an hour, with time to check things on your phone.

---

## Step 1. Fix the GitHub sign-in, so you can push as decobwebs

This laptop is signed in to GitHub as **afss-git**, which is not allowed to
push to `decobwebs/cipher4` (GitHub answers "403"). Sign that account out,
then sign in as decobwebs the next time you push.

1. Open a terminal in the project folder (`C:\Users\HP\Cipher4`).
2. Type:

   ```
   git credential-manager github logout afss-git
   ```

   If it says the account was not found, remove the saved login by hand
   instead: press the Windows key, type **Credential Manager**, open it,
   choose **Windows Credentials**, and remove every entry that starts with
   `git:https://github.com`.
3. Nothing else happens yet. You sign in during Step 2.

(Your commits will still show "afss-git" as their author name. That does not
stop the push and does not appear on the website.)

## Step 2. Push the redesign branch

1. In the same terminal, type:

   ```
   git push -u origin redesign
   ```

2. A browser window opens and asks you to sign in to GitHub. Sign in as
   **decobwebs** and allow access.
3. The terminal shows the upload finishing, ending with a line like
   `redesign -> redesign`.
4. Check: on github.com/decobwebs/cipher4, the branch list now shows
   **redesign**.

Only the saved commits are uploaded. Loose files on your laptop that were
never committed (such as `cipher4-handover.zip` and the `docs/profile`
folder) are not sent.

## Step 3. Add the form key in Vercel

The contact, Launchpad and Scholarships forms need the Web3Forms key. It lives
in Vercel's settings, never in the code.

1. Go to vercel.com, sign in, and open the **cipher4** project.
2. Open **Settings**, then **Environment Variables**.
3. Add a new variable:
   - **Key:** `NUXT_PUBLIC_WEB3FORMS_KEY`
   - **Value:** your Web3Forms access key
   - **Environments:** tick **Production** and **Preview**
4. Click **Save**.

A new key only reaches a build made after you save it. Step 4 makes sure of
that.

## Step 4. Check the Vercel preview

Pushing the branch (Step 2) makes Vercel build a preview of the new site.

1. In Vercel, open **Deployments**. Find the newest one for the branch
   **redesign**.
2. If it was built **before** you saved the key in Step 3, open its **...**
   menu and choose **Redeploy**. Wait until it says **Ready** (about 2 to 4
   minutes).
3. Click **Visit** to open the preview. It has its own address, ending in
   `.vercel.app`.
4. Check on the computer, then on your phone:
   - The home page loads, the words appear at once, and the road starts on
     the right within about 3 seconds.
   - The menu works, and every page in it opens.
   - The contact page shows **no** "Setup needed" box any more. If you still
     see it, the key did not reach this build: go back to point 2 and
     redeploy.
   - Send **one** test message from the contact form, with
     **TEST — please ignore** in the Organisation field. You should see "Thank
     you. Your message has reached us." and the message should arrive in the
     inbox that your Web3Forms key belongs to.
   - Open an old address on the preview, for example the preview address
     followed by `/solutions`. It should land on the Services page.

If anything looks wrong, stop here and tell me. Nothing is live yet.

## Step 5. Merge to main (this puts the site live)

When `main` changes, Vercel builds it and replaces the live site at
cipherfourai.com.

1. On github.com/decobwebs/cipher4, click **Pull requests**, then **New pull
   request**.
2. Set **base** to `main` and **compare** to `redesign`.
3. Click **Create pull request**, give it a title such as "New website", and
   create it.
4. Click **Merge pull request**, then **Confirm merge**.
5. In Vercel, open **Deployments**. A new **Production** deployment from
   `main` starts. Wait until it says **Ready** (about 2 to 4 minutes).
6. Write down the name of the **previous** Production deployment (the old
   site). You need it if you have to undo the launch.

## Step 6. Check the live site

Do these on https://cipherfourai.com once Step 5 says Ready. If a page still
shows the old site, refresh with Ctrl+F5.

### 6.1 The pages

- Home, a service page, a sector page, a case study, Contact, Youth and the
  legal pages all open. Privacy and Terms say "Last updated: 20 November
  2026".
- A made-up address, such as `cipherfourai.com/this-is-not-a-page`, shows
  "This page is not here".

### 6.2 Old addresses move to the new ones

Open each one. The address bar should change to the new address shown.

| Old address | Should land on |
|---|---|
| /solutions | /services |
| /solutions/software-platforms | /services/operational-platforms |
| /solutions/robotics | /services/iot-robotics |
| /solutions/technology-supply | /services/it-infrastructure |
| /industries | /sectors |
| /industries/transport | /sectors/logistics-and-transport |
| /industries/logistics | /sectors/logistics-and-transport |
| /industries/oil-and-gas | /sectors/oil-and-gas |
| /industries/supply-chain | /sectors/supply-chain-and-procurement |
| /projects | /work |

### 6.3 Sitemap and robots

- https://cipherfourai.com/sitemap.xml lists 30 addresses, all starting with
  `https://cipherfourai.com`.
- https://cipherfourai.com/robots.txt ends with the sitemap's address.
- If you use Google Search Console: open the cipherfourai.com property, go
  to **Sitemaps**, and submit `sitemap.xml`.

### 6.4 Contact form

- Send **one** test message on the live site, with **TEST — please ignore**
  in the Organisation field. Check that it arrives.
- Open `cipherfourai.com/contact?type=quote&sector=oil-and-gas`: the
  "Request a quote" tab should be open with Oil and gas chosen.

### 6.5 Share images

1. Open linkedin.com/post-inspector and paste `https://cipherfourai.com`.
   You should see the white blueprint card with the Cipher4 logo and
   "Intelligence for critical operations."
2. Do the same for a service page (for example
   `https://cipherfourai.com/services/operational-platforms`) and for
   `https://cipherfourai.com/contact`. Each shows its own card with its own
   title.

Social sites keep an old copy for a while. The post inspector fetches a fresh
one.

### 6.6 Speed

Open pagespeed.web.dev and test the home page, a service page and the contact
page. Note the **Mobile** scores and send them to me.

---

## If something goes wrong: undo the launch

### Fast: put the old site back in about a minute

1. In Vercel, open **Deployments**.
2. Find the previous **Production** deployment (the one you wrote down in
   Step 5, point 6).
3. Open its **...** menu and choose **Instant Rollback** (on some plans it
   is called **Promote to Production**). Confirm.
4. Refresh cipherfourai.com. The old site is back.

This changes only what is live. GitHub's `main` still holds the new site, so
**the next change merged to main would put the new site live again**. Use
this to buy time, then tell me what went wrong. We fix it on `redesign`,
check a preview, and merge again.

### Permanent: take the new site out of main

Only if you decide not to launch for now:

1. On GitHub, open the pull request you merged in Step 5.
2. Click **Revert**. GitHub makes a new pull request that undoes the merge.
3. Merge that pull request. Vercel builds `main` again, now with the old
   site.

The `redesign` branch keeps all the new work, so nothing is lost.

---

## After launch

- The internal share-card page (`/_og`) stays. It is hidden from search
  engines and linked from nowhere. It is how the share images are made again
  when a page title changes.
- Tell me when the site is live, and send me the PageSpeed scores from 6.6.
