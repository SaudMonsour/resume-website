# Portfolio Template

A professional open-source portfolio with a purpose-built mobile experience.  
Zero frameworks. Zero build tools. Pure HTML, CSS, and JavaScript — just ship it.

---

## What's included

| File | Purpose |
|---|---|
| `index.html` | Desktop portfolio — animated, spotlight cursor, scroll-reveal cards |
| `mobile.html` | Mobile portfolio — purpose-built for phones, auto-loaded on touch devices |
| `my-data/config.js` | **The only file you must edit** — your name, images, links, passwords |
| `my-data/portfolio_data.json` | Sample projects and certifications — replace with your own |
| `my-data/images/` | Put your profile photos here |

---

## Quick Start

### Step 1 — Get the files

Download or clone this `/template` folder. You only need these files:

```
template/
├── index.html
├── mobile.html
├── my-data/
│   ├── config.js          ← edit this
│   ├── portfolio_data.json
│   └── images/            ← put your photos here
└── README.md
```

### Step 2 — Edit `my-data/config.js`

This is the only file you need to touch to make the site yours:

```js
const MY_CONFIG = {
    name: "Jane Doe",
    title: "Full Stack Developer",
    pageTitle: "Jane Doe | Full Stack Developer",

    heroBaseImage: "./my-data/images/me.jpg",   // always visible
    heroHoverImage: "./my-data/images/me2.jpg", // shows on desktop hover / mobile tap

    socials: {
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourprofile",
        email: "you@example.com"   // just the address, no "mailto:"
    },

    githubUsername: "yourusername",  // for importing repos in the admin dashboard

    adminPassword: "ChangeMe123!",   // dashboard login password — keep it private
    adminUrlKey: "mysecretkey",      // visit /?admin=mysecretkey to open dashboard
};
```

### Step 3 — Add your photos

Copy your profile photos into `my-data/images/` and set the filenames in `config.js`.  
Both `heroBaseImage` and `heroHoverImage` can be the same photo if you only have one.

### Step 4 — Add your projects and certifications

**Option A — Edit the JSON file directly:**  
Open `my-data/portfolio_data.json` and replace the sample data with yours. The schema is self-explanatory.

**Option B — Use the admin dashboard (no code):**  
Open `index.html?admin=YOUR_ADMIN_URL_KEY` in your browser, enter your password, and add content through the UI. When done, click **Export JSON** and replace `portfolio_data.json` with the downloaded file to make changes permanent across devices.

### Step 5 — Deploy for free

**GitHub Pages (2 minutes):**
1. Push your files to a GitHub repository.
2. Go to **Settings → Pages**, set source to `main` branch, root `/`.
3. Your site is live at `https://yourusername.github.io/repo-name`.

**Netlify (under a minute):**  
Drag and drop the template folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Done.

**Vercel:**  
Import your GitHub repo at [vercel.com](https://vercel.com). Auto-deploys on every push.

---

## How content works

All portfolio content is read from `my-data/portfolio_data.json`:

```jsonc
{
    "bio": {
        "name": "Jane Doe",
        "title": "Full Stack Developer",
        "desc": "Your bio text here...",
        "img": "my-data/images/me.jpg",
        "loc": "San Francisco, CA",
        "exp": "Software Engineer"
    },
    "projects": [
        {
            "id": 1,
            "title": "My Project",
            "link": "https://github.com/yourusername/project",
            "img": "",          // URL, base64 image, or leave empty
            "learned": "What the project is and what you built.",
            "skills": "React, Node.js, PostgreSQL"
        }
    ],
    "certs": [
        {
            "id": 101,
            "title": "AWS Certified Developer",
            "link": "https://credly.com/badges/your-badge",
            "img": "",          // paste data:image/png;base64,... or data:application/pdf;base64,...
            "learned": "What this certification covers.",
            "skills": "AWS Lambda, DynamoDB, S3"
        }
    ]
}
```

The page loads this file at runtime and merges it with any data saved via the admin dashboard. Your admin edits always take priority over the file.

---

## How mobile/desktop works

When a visitor opens `index.html` on a phone or tablet, a small script at the top detects the device and instantly redirects to `mobile.html`:

- **Desktop** → `index.html` — animated scroll-reveal, spotlight cursor, modal overlays
- **Mobile** → `mobile.html` — single scrollable page, all content visible immediately, tap to toggle hero photo

Both pages read from the same `config.js` and `portfolio_data.json`, so your content is always in sync.

To view the desktop version on a phone (e.g. for testing), add `?forceDesktop=1` to the URL.

---

## How the admin dashboard works

1. Visit `https://yoursite.com/?admin=YOUR_ADMIN_URL_KEY`
2. Enter your password from `config.js`
3. You can now add/edit/delete your bio, projects, and certifications
4. Changes are saved instantly to `localStorage` — no server needed
5. Use **Export JSON** to download your data and commit it to the repo so it works on all devices

> The admin dashboard is only available on the desktop version. It is not shown on mobile.

---

## Customising the look

The colours and styles for each page are controlled by CSS variables at the top of each file.

**`mobile.html` variables:**

| Variable | Default | Purpose |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--fg` | `#000000` | Text and borders |
| `--muted` | `#888888` | Subdued labels |
| `--border` | `#eeeeee` | Card and divider borders |
| `--card-bg` | `#fafafa` | Card background |
| `--radius` | `12px` | Card corner radius |

**`index.html` (desktop)** uses the same black-and-white palette by design — clean, typographic, and timeless.

---

## Credits

- **Template by:** [Saud Alotaibi](https://github.com/SaudMonsour) — open source, use freely
- **Fonts:** [Google Fonts](https://fonts.google.com/) — Inter, Playfair Display
- **PDF rendering:** [pdf.js](https://mozilla.github.io/pdf.js/) by Mozilla
- **Hosting options:** [GitHub Pages](https://pages.github.com/), [Netlify](https://netlify.com), [Vercel](https://vercel.com)

---

*No frameworks. No build step. Just edit `config.js` and deploy.*
