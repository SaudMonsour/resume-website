# Portfolio Template

A customizable portfolio, printable résumé, and optional journal built with HTML, CSS, and JavaScript. Desktop and mobile share the same configuration and portfolio data. The template includes neutral image placeholders and fictional sample content.

## Start locally

Use a current Node.js LTS release. From this folder:

```sh
npm run dev
```

Open `http://localhost:5000`. The server uses only Node’s built-in modules; no package installation is required. Use an HTTP server rather than opening the HTML files directly, because the pages fetch JSON.

## Make it yours

1. Edit `my-data/config.js`: name, title, social links, portrait filenames, and site URL. Its comments explain each setting.
2. Replace the placeholder portraits in `my-data/images/` with your own photos. One photo can serve both portrait settings.
3. Edit `my-data/portfolio_data.json`: experience, projects, certificates, and optional résumé details. All supplied entries are examples.
4. Customize the journal settings and articles, or set `blog.enabled` to `false` to hide its portfolio links.
5. Run `npm run build:blog` after changing your identity, site URL, journal settings, articles, or journal policy pages. Commit the generated files with your source changes.

There is no public About Me section. Biography data is retained for the printable résumé and editor.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Desktop layout, reveal animation, custom cursor, certificate preview, local editor |
| `mobile.html` | Mobile layout, portrait toggle, certificate preview, résumé modal |
| `site.js` | Shared journal customization and desktop résumé viewer |
| `resume.html` | Data-driven résumé with an A4 print / Save as PDF action |
| `my-data/config.js` | Commented site settings |
| `my-data/portfolio_data.json` | Portfolio content and résumé details |
| `blog/articles.json` | Journal source articles |
| `blog/policies.json` | Sample journal information pages to customize |
| `scripts/build-blog.js` | Generates articles, topics, search listings, RSS, and sitemap |
| `scripts/sync_github_projects.py` | Optional public GitHub project importer |
| `server.js` / `vercel.json` | Local preview and optional clean blog routes |
| `tests/` | Checks for configuration, links, script syntax, and journal generation |

## Content and images

Experience, projects, and certificates use arrays of entries:

```json
{
  "id": 1001,
  "title": "My project",
  "learned": "What I built, who it helps, and the result.",
  "skills": "HTML, CSS, JavaScript",
  "link": "https://example.com",
  "img": ""
}
```

Keep IDs unique within each collection. The template accepts numeric IDs and older string IDs. An empty image hides the project or experience thumbnail. Project actions distinguish GitHub repositories from live sites. Descriptions retain their full text.

For an experience date, use `date` for display and optional `sDate`, `eDate` (`YYYY-MM`), and `isPresent` for the editor’s date controls.

Image fields accept a URL or a path such as `my-data/images/project.png`. Certificate fields also accept a filename from `my-data/images/certs/`. Missing certificate images use a local placeholder. The desktop editor supports uploaded image and PDF data URLs; desktop PDFs render through PDF.js and mobile PDFs provide an open-document action.

The `resume` object supports `phone`, `summary`, `skills` (label/value pairs), `education` (title/institution/date/description), and `languages`. Experience, projects, and certificates automatically appear in the résumé. Identity comes from `config.js`; location and the fallback summary come from `bio`. Adjust content length before printing.

## Local editor and publishing

Open `index.html?admin=admin` and enter the example password `demo`. Configure the convenience gate in `config.js`. The editor opens the desktop layout, including on a touch device.

The dashboard is a browser-only editor, and its password is visible in the public configuration. It provides no server authentication and cannot change the deployed files. Its draft is stored under `storageKey + ':draft'` in the current browser.

- Add, edit, delete, or import portfolio entries in the dashboard.
- Reload the admin URL to continue the same draft.
- Use `?preview=1` to preview that draft on the portfolio or résumé in the same browser.
- Ordinary visitors see the published JSON, including when a local draft exists.
- Export JSON and replace `my-data/portfolio_data.json` with the exported file, then commit/deploy it to publish the changes.

Use a unique storage key for each fork sharing the same domain. Storage can be unavailable or full; export your changes before closing the editor. The optional GitHub token input stays in the current page and is sent only to GitHub API requests; never commit tokens. The Python importer requires Python 3 and runs from any working directory using `python scripts/sync_github_projects.py`.

## Journal

The supplied articles show headings, lists, code, tables, source references, and a figure. Replace their content and dates with your own writing. Each article has:

```json
{
  "slug": "my-first-post",
  "title": "My first post",
  "category": "Notes",
  "status": "published",
  "date": "2026-01-01",
  "updated": "2026-01-01",
  "excerpt": "A short introduction.",
  "takeaway": "The main idea.",
  "body": "## Introduction\n\nYour article text.",
  "sources": []
}
```

The category must match a topic name in `MY_CONFIG.blog.topics`. Optional fields include `kind`, `featured`, `eventDate`, and `sourceChecked`. Source entries have a `label` and HTTPS `url`; use `[S1]` in the body to link a source whose label starts with S1.

Put figures in `blog/figures/` and use `![Description](/figures/filename.svg)` in the body. PNG, SVG, JPG, and WebP figures are supported. Policy bodies in `blog/policies.json` are trusted author-written HTML; replace the sample pages with information describing your site.

Run `npm run build:blog` to regenerate all published pages. A manifest removes stale article/topic pages from earlier builds. Articles with another status are excluded from generated pages, but their source JSON remains public. Keep confidential drafts outside the deployed folder.

Set `siteUrl` to your real origin, including any repository path, before building RSS, canonical links, and the sitemap. Navigation uses explicit relative HTML links so it also works without hosting rewrites.

Disabling the journal hides its portfolio navigation; to omit journal files from deployment, remove the `blog/` folder from your published copy as well.

## Deploy

Publish the **contents of this template folder** as your site root.

- **Vercel:** import the repository and set Root Directory to `template`. Use the static/Other preset; the committed HTML is ready to serve. The supplied configuration supports extensionless blog URLs as an option.
- **Netlify or another static host:** publish `template/`. Generated HTML is committed, so a build step is optional.
- **GitHub Pages:** copy the template contents into the root of your own site repository and publish that root with Pages. Set `siteUrl` to `https://yourusername.github.io/repo-name` and rebuild the journal. Relative links also work on this repository’s `/template/index.html` path if its repository root is published.

Both layouts support `?forceDesktop=1`; mobile visitors normally redirect automatically, preserving portfolio section anchors. The optional server runs on port 5000, or the `PORT` environment setting.

## Customize and check

Colors and typography are defined by CSS variables at the start of each page. Journal styles live in `blog/style.css`. Source comments identify the configuration, renderer, preview, and draft-saving code.

Run `npm test` to validate scripts, generated local links, and journal behavior. Fonts load from Google Fonts and desktop PDF previews use PDF.js from a CDN. Core content, images, and journal search are served from this template.

Template originally created by [Saud Alotaibi](https://github.com/SaudMonsour).

