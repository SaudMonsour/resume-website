/* Published articles are maintained in blog/articles.json. No remote service is
 * required to read the blog. Run `node scripts/build-blog.js` after editing it. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'blog');
// Evaluate this site's public configuration at build time; no extra packages.
const vm = require('node:vm');
const config = vm.runInNewContext(fs.readFileSync(path.join(root,'my-data','config.js'),'utf8') + '\nMY_CONFIG', {}, {timeout:1000});
const origin = String(config.siteUrl || 'https://example.com').replace(/\/$/, '');
if (!/^https?:\/\//.test(origin)) throw new Error('siteUrl must be an HTTP(S) URL.');
const blog = config.blog || {};
const blogTitle = blog.title || 'My journal';
const author = config.name || 'Your Name';
const categories = (blog.topics || []).map(topic => topic.name);
const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const label = s => new Date(s + 'T12:00:00Z').toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric', timeZone:'UTC'});
const minutes = p => Math.max(1, Math.ceil(p.body.split(/\s+/).length / 210));
// Articles marked draft are excluded from generated pages, but the source JSON
// is still public on static hosting. Keep confidential drafts outside this repo.
const input = JSON.parse(fs.readFileSync(path.join(output, 'articles.json'), 'utf8'));
const posts = input.filter(p => p.status === 'published').sort((a, b) => b.date.localeCompare(a.date) || (b.order || 0) - (a.order || 0));
const seen = new Set();
for (const p of posts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || seen.has(p.slug)) throw new Error('Invalid or duplicate article slug');
  seen.add(p.slug);
  p.sources = p.sources || [];
  p.updated = p.updated || p.date;
  if (![p.date,p.updated].every(date => /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)))) throw new Error('Invalid article date: ' + p.slug);
  if (!p.title || !p.body || !categories.includes(p.category) || p.sources.some(s => !s.url.startsWith('https://'))) throw new Error('Invalid published article: ' + p.slug);
}
const articleUrl = p => '/blog/articles/' + p.slug;
function inline(value, sources = []) {
  return esc(value).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+|\/blog\/[^\s)]+)\)/g, '<a href="$2">$1</a>').replace(/\[S(\d+)\]/g, (m, n) => sources.some(s => new RegExp('^S' + n + '\\b').test(s.label)) ? '<a class="source-ref" href="#source-S' + n + '">' + m + '</a>' : m);
}
function markdown(text, sources = []) {
  const lines = text.split('\n'); let html = '', para = [], list = [], code = [], inCode = false;
  const flush = () => { if (para.length) { html += '<p>' + inline(para.join(' '), sources) + '</p>'; para = []; } if (list.length) { html += '<ul>' + list.map(x => '<li>' + inline(x, sources) + '</li>').join('') + '</ul>'; list = []; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) { flush(); if (inCode) { html += '<pre><code>' + esc(code.join('\n')) + '</code></pre>'; code = []; } inCode = !inCode; continue; }
    if (inCode) { code.push(line); continue; }
    const image = line.match(/^!\[([^\]]{1,600})\]\((\/figures\/[a-z0-9-]+\.(?:png|svg|jpg|webp))\)$/);
    if (image) { flush(); const file = image[2].slice('/figures/'.length); if (!fs.existsSync(path.join(output, 'figures', file))) throw new Error('Missing figure ' + file); const src = '/blog/figures/' + file; html += '<figure class="article-figure"><a href="' + src + '"><img src="' + src + '" alt="' + esc(image[1]) + '" loading="lazy" decoding="async"></a><figcaption>' + esc(image[1]) + ' <a href="' + src + '">Open full size</a></figcaption></figure>'; continue; }
    if (line.startsWith('|') && /^\|[\s:|-]+\|$/.test(lines[i + 1] || '')) {
      flush(); const cells = s => s.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim()); const head = cells(line); i++; const rows = []; while (lines[i + 1]?.startsWith('|')) rows.push(cells(lines[++i]));
      html += '<div class="table-scroll" tabindex="0" aria-label="Comparison table"><table><thead><tr>' + head.map(x => '<th scope="col">' + inline(x, sources) + '</th>').join('') + '</tr></thead><tbody>' + rows.map(r => '<tr>' + head.map((_, j) => '<td>' + inline(r[j] || '', sources) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>'; continue;
    }
    if (/^##?\s/.test(line)) { flush(); const title = line.replace(/^##?\s/, ''); html += '<h2 id="' + slugify(title) + '">' + inline(title, sources) + '</h2>'; }
    else if (line.startsWith('### ')) { flush(); html += '<h3>' + inline(line.slice(4), sources) + '</h3>'; }
    else if (line.startsWith('- ')) { if (para.length) flush(); list.push(line.slice(2)); }
    else if (!line.trim()) flush();
    else { if (list.length) flush(); para.push(line); }
  }
  flush(); if (inCode) html += '<pre><code>' + esc(code.join('\n')) + '</code></pre>'; return html;
}
// Emit explicit .html links and relative assets so the built pages also work on
// GitHub Pages, plain static hosts, and deployments under a repository subpath.
function route(url) {
  if (url === '/') return '/index.html';
  if (url === '/blog') return '/blog/index.html';
  const [pathname, hash] = url.split('#');
  return (path.extname(pathname) ? pathname : pathname + '.html') + (hash ? '#' + hash : '');
}
const absolute = url => origin + route(url);
function relativeLinks(html, url) {
  const current = path.posix.dirname(route(url));
  return html.replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (_, attr, target) => {
    const [file, hash] = route(target).split('#');
    const relative = path.posix.relative(current, file) || path.posix.basename(file);
    return attr + '="' + relative + (hash ? '#' + hash : '') + '"';
  });
}
function shell(title, description, body, url, schema = null) {
  const nav = [['Home','/index.html'],['Experience','/index.html#experience'],['Projects','/index.html#projects'],['Certifications','/index.html#certificates'],['Blog','/blog']];
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>' + esc(title) + ' · ' + esc(author) + '</title><meta name="description" content="' + esc(description) + '"><meta name="robots" content="index,follow"><link rel="canonical" href="' + esc(absolute(url)) + '"><meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(description) + '"><meta property="og:url" content="' + esc(absolute(url)) + '"><meta property="og:type" content="' + (schema ? 'article' : 'website') + '"><link rel="stylesheet" href="/blog/style.css"><link rel="alternate" type="application/rss+xml" title="' + esc(blogTitle) + '" href="/blog/feed.xml">' + (schema ? '<script type="application/ld+json">' + JSON.stringify(schema).replace(/</g, '\\u003c') + '</script>' : '') + '</head><body><a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="site-name" href="/index.html">' + esc(author) + '</a><nav class="main-nav" aria-label="Main navigation">' + nav.map(([name, href]) => '<a href="' + href + '"' + (name === 'Blog' ? ' aria-current="page"' : '') + '>' + name + '</a>').join('') + '</nav></div></header><main class="container" id="main">' + body + '</main><footer class="site-footer"><div class="container footer-inner"><div><div class="footer-title">' + esc(blogTitle) + '</div><p class="copyright">' + esc(blog.description || '') + '<br>© ' + new Date().getUTCFullYear() + ' ' + esc(author) + '</p></div><nav class="footer-links" aria-label="Footer navigation"><a href="/index.html">Portfolio</a><a href="/blog/about">About the journal</a><a href="/blog/editorial-policy">Editorial policy</a><a href="/blog/privacy">Privacy</a><a href="/blog/contact">Contact</a><a href="/blog/terms">Terms</a><a href="/blog/feed.xml">RSS</a></nav></div></footer><script src="/blog/search.js" defer></script></body></html>';
  return relativeLinks(html, url);
}
function topicLinks(active = '') { return '<nav class="topics" aria-label="Blog topics"><a href="/blog"' + (!active ? ' aria-current="page"' : '') + '>All articles</a>' + categories.map(c => '<a href="/blog/topics/' + slugify(c) + '"' + (active === c ? ' aria-current="page"' : '') + '>' + esc(c) + '</a>').join('') + '</nav>'; }
function card(p) { return '<article class="post-card" data-search="' + esc((p.title + ' ' + p.excerpt + ' ' + p.category).toLowerCase()) + '"><span class="eyebrow">' + esc(p.category) + '</span><h2><a href="' + articleUrl(p) + '">' + esc(p.title) + '</a></h2><div class="meta"><span>' + label(p.date) + '</span><span>' + esc(p.kind || 'Article') + '</span><span>' + minutes(p) + ' min read</span></div><p>' + esc(p.excerpt) + '</p><a class="read-link" href="' + articleUrl(p) + '">Read article</a></article>'; }
function listing(items, title = 'All articles') { return '<section class="listing"><div class="listing-header"><div><h2>' + esc(title) + '</h2><p class="count" id="search-status" role="status" aria-live="polite">' + items.length + ' articles</p></div><label class="search">Search this collection<input type="search" id="article-search" placeholder="Search articles…"></label></div><div class="post-grid">' + (items.length ? items.map(card).join('') : '<p class="empty">Articles in this topic are coming soon.</p>') + '</div></section>'; }
function write(file, html) { const dest = path.join(output, file); fs.mkdirSync(path.dirname(dest), {recursive:true}); fs.writeFileSync(dest, html); }
// Remove only files generated by an earlier build, using a bounded manifest.
const manifest = path.join(output,'.generated.json');
if (fs.existsSync(manifest)) for (const file of JSON.parse(fs.readFileSync(manifest,'utf8'))) {
  if (/^(?:articles|topics)\/[a-z0-9-]+\.html$/.test(file)) fs.rmSync(path.join(output,file),{force:true});
}
const topicSlugs = categories.map(slugify);
if (topicSlugs.some(s => !s) || new Set(topicSlugs).size !== topicSlugs.length) throw new Error('Topic names must generate unique, nonempty slugs.');
const featured = posts.find(p => p.featured) || posts[0];
const feature = featured ? '<section class="featured" aria-label="Featured article"><div><span class="eyebrow">Featured article</span><h2><a href="' + articleUrl(featured) + '">' + esc(featured.title) + '</a></h2><p>' + esc(featured.excerpt) + '</p><a class="read-link" href="' + articleUrl(featured) + '">Read article</a></div><div class="featured-note"><span class="eyebrow">From the journal</span><h3>' + esc(blog.label || 'Notes & ideas') + '</h3><p>' + esc(blog.description || '') + '</p></div></section>' : '';
write('index.html', shell(blogTitle, blog.description || '', '<header class="intro"><span class="eyebrow">' + esc(blog.label || 'Journal') + '</span><h1>' + esc(blogTitle) + '</h1><p class="deck">' + esc(blog.description || '') + '</p></header>' + topicLinks() + feature + listing(posts), '/blog'));
for (const category of categories) write('topics/' + slugify(category) + '.html', shell(category, category + ' articles by ' + author, '<header class="intro"><span class="eyebrow">' + esc(blogTitle) + '</span><h1>' + esc(category) + '</h1></header>' + topicLinks(category) + listing(posts.filter(p => p.category === category), category), '/blog/topics/' + slugify(category)));
for (const p of posts) {
  const headings = p.body.split('\n').filter(x => x.startsWith('## ')).map(x => x.slice(3));
  const sources = p.sources.length ? '<section class="sources" id="sources"><h2>Sources &amp; further reading</h2><ul>' + p.sources.map((s,i) => '<li id="source-' + (s.label.match(/^S\d+\b/)?.[0] || i+1) + '"><a href="' + esc(s.url) + '" rel="noopener noreferrer">' + esc(s.label) + '</a></li>').join('') + '</ul></section>' : '';
  const body = '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/blog">Blog</a> / <a href="/blog/topics/' + slugify(p.category) + '">' + esc(p.category) + '</a></nav><header class="article-head"><span class="eyebrow">' + esc(p.kind || 'Article') + '</span><h1>' + esc(p.title) + '</h1><p class="deck">' + esc(p.excerpt) + '</p><div class="meta"><span>By ' + esc(author) + '</span><span>Published ' + label(p.date) + '</span><span>' + minutes(p) + ' min read</span>' + (p.updated !== p.date ? '<span>Updated ' + label(p.updated) + '</span>' : '') + (p.eventDate ? '<span>Event ' + label(p.eventDate) + '</span>' : '') + (p.sourceChecked ? '<span>Sources checked ' + label(p.sourceChecked) + '</span>' : '') + '</div></header><div class="article-layout"><aside class="toc"><details open><summary>In this article</summary>' + headings.map(h => '<a href="#' + slugify(h) + '">' + esc(h) + '</a>').join('') + (sources ? '<a href="#sources">Sources &amp; further reading</a>' : '') + '</details></aside><article class="prose">' + (p.takeaway ? '<div class="takeaway"><span class="eyebrow">The takeaway</span><p>' + esc(p.takeaway) + '</p></div>' : '') + markdown(p.body, p.sources) + sources + '</article></div><section class="related"><h2>Keep reading</h2><div class="post-grid">' + posts.filter(x => x.slug !== p.slug).sort((a,b) => (b.category === p.category) - (a.category === p.category)).slice(0,3).map(card).join('') + '</div></section>';
  write('articles/' + p.slug + '.html', shell(p.title, p.excerpt, body, articleUrl(p), {'@context':'https://schema.org','@type':'BlogPosting',headline:p.title,description:p.excerpt,datePublished:p.date,dateModified:p.updated,author:{'@type':'Person',name:author,url:absolute('/')},publisher:{'@type':'Person',name:author},mainEntityOfPage:absolute(articleUrl(p)),inLanguage:'en'}));
}
// Policy bodies are trusted author-written HTML. Replace sample text before use.
const policies = JSON.parse(fs.readFileSync(path.join(output,'policies.json'),'utf8'));
for (const [slug,p] of Object.entries(policies)) {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid policy slug');
  write(slug + '.html', shell(p.title, p.label + ' for ' + blogTitle, '<header class="intro"><span class="eyebrow">' + esc(p.label) + '</span><h1>' + esc(p.title) + '</h1></header><article class="prose policy">' + p.body + '</article>', '/blog/' + slug));
}
const urls = ['/blog', ...categories.map(c => '/blog/topics/' + slugify(c)), ...Object.keys(policies).map(k => '/blog/' + k), ...posts.map(articleUrl)];
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.map(u => '<url><loc>' + esc(absolute(u)) + '</loc></url>').join('') + '</urlset>');
write('feed.xml', '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>' + esc(blogTitle) + '</title><link>' + esc(absolute('/blog')) + '</link><description>' + esc(blog.description || '') + '</description>' + posts.map(p => '<item><title>' + esc(p.title) + '</title><link>' + esc(absolute(articleUrl(p))) + '</link><guid>' + esc(absolute(articleUrl(p))) + '</guid><pubDate>' + new Date(p.date + 'T12:00:00Z').toUTCString() + '</pubDate><description>' + esc(p.excerpt) + '</description></item>').join('') + '</channel></rss>');
write('.generated.json', JSON.stringify([...posts.map(p => 'articles/' + p.slug + '.html'), ...categories.map(c => 'topics/' + slugify(c) + '.html')],null,2) + '\n');
console.log('Built ' + posts.length + ' published articles.');
