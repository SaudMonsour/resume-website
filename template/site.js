/* Shared customization for both layouts. Identity and optional sections live in
 * my-data/config.js. Relative links support domain roots and repository paths. */
(() => {
    const config = MY_CONFIG.blog || {};
    const slugify = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const isMobile = !!document.getElementById('m-hero-name');
    const section = document.getElementById(isMobile ? 'm-blog' : 'blog');
    if (config.enabled === false) {
        section.hidden = true;
        document.querySelectorAll('a[href="#blog"], a[href="#m-blog"]').forEach(link => link.hidden = true);
    } else {
        section.querySelector('[data-blog-label]').textContent = config.label || 'Notes & ideas';
        section.querySelector('.blog-title, .m-blog-title').textContent = config.title || 'My journal';
        section.querySelector('.blog-description, .m-blog-description').textContent = config.description || 'Projects, lessons, and ideas from my work.';
        const topics = section.querySelector('.blog-topics, .m-blog-topics');
        for (const topic of config.topics || []) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = isMobile ? 'm-blog-topic' : 'blog-topic hover-target';
            a.href = 'blog/topics/' + slugify(topic.name) + '.html';
            const strong = document.createElement('strong');
            strong.textContent = topic.name;
            const description = document.createElement('span');
            description.textContent = topic.description || '';
            a.append(strong, description);
            li.append(a);
            topics.append(li);
        }
    }
    if (!isMobile) {
        // Both layouts open the same printable, data-driven resume.
        const button = document.createElement('button');
        button.id = 'view-resume';
        button.className = 'nav-link hover-target';
        button.textContent = 'RESUME';
        button.style.cssText = 'border:0;background:none;font:inherit;cursor:pointer;';
        document.querySelector('.header-nav').append(button);
        const dialog = document.createElement('dialog');
        dialog.id = 'resume-dialog';
        dialog.setAttribute('aria-label', 'Resume viewer');
        dialog.innerHTML = '<div class="resume-toolbar"><span>Resume</span><button type="button" aria-label="Close resume">Close</button></div><iframe title="Resume"></iframe>';
        document.body.append(dialog);
        const style = document.createElement('style');
        style.textContent = '#resume-dialog{width:min(1000px,95vw);height:92vh;margin:auto;padding:0;border:0;border-radius:12px;overflow:hidden}#resume-dialog::backdrop{background:rgba(0,0,0,.75)}#resume-dialog iframe{width:100%;height:calc(100% - 52px);border:0}.resume-toolbar{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;background:#000;color:#fff;height:52px}.resume-toolbar button{background:#fff;color:#000;border:0;padding:8px 12px;cursor:pointer}';
        document.head.append(style);
        button.addEventListener('click', () => {
            dialog.querySelector('iframe').src = 'resume.html' + (new URLSearchParams(location.search).has('admin') || new URLSearchParams(location.search).get('preview') === '1' ? '?preview=1' : '');
            dialog.showModal();
        });
        dialog.querySelector('button').addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    } else if (new URLSearchParams(location.search).get('preview') === '1') {
        document.getElementById('m-resume-frame').dataset.src = 'resume.html?preview=1';
    }
})();
