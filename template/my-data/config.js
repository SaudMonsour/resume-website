/**
 * Start here: replace the example identity, portraits and links with your own.
 * Portfolio entries and resume details live in portfolio_data.json.
 * Blog articles live in blog/articles.json; rebuild them after editing.
 * This file is public. Never put real secrets here.
 */
const MY_CONFIG = {
    name: 'Jane Doe',
    title: 'Full Stack Developer',
    pageTitle: 'Jane Doe | Full Stack Developer',

    // Canonical blog links, RSS and sitemap. Include the repository path for
    // GitHub Pages: https://username.github.io/repo. Rebuild after changing it.
    siteUrl: 'https://example.com',

    // Replace these neutral placeholders. Both may use the same photo.
    // Desktop hover reveals the alternate portrait; mobile tap toggles it.
    heroBaseImage: './my-data/images/hero-base.svg',
    heroHoverImage: './my-data/images/hero-hover.svg',
    // Empty values hide optional social links. Use a bare email address.
    socials: { github: 'https://github.com/yourusername', linkedin: '', email: 'you@example.com' },
    githubUsername: 'yourusername', // Repository imports use public repos.

    // Convenience gate for the browser editor, NOT authentication.
    // Anyone can read these values. Edits are browser drafts until you export
    // JSON and commit it. Never add an access token to this file or repository.
    adminPassword: 'demo',
    adminUrlKey: 'admin', // Open index.html?admin=admin, including on mobile.
    dataFile: './my-data/portfolio_data.json',
    certImageBaseUrl: '', // Optional hosted certificate image folder.
    storageKey: 'my_portfolio_v4', // Choose a unique key for each site on the same origin.

    // Set enabled:false to hide journal navigation in the portfolio.
    // Rebuild the blog after editing these fields. Topic names must be unique.
    blog: {
        enabled: true,
        title: 'Jane’s Journal',
        label: 'Projects & lessons',
        description: 'Ideas, project notes, and lessons from building useful software.',
        topics: [
            { name: 'Projects', description: 'How I approach and build my projects.' },
            { name: 'Guides', description: 'Practical explanations and useful examples.' },
            { name: 'Notes', description: 'Short reflections and things I have learned.' }
        ]
    }
};

