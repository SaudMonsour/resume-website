/**
 * Portfolio Configuration File
 * 
 * This is the ONLY file you need to edit to personalise the portfolio.
 * Fill in your own details below and save — the site will update automatically.
 */

const MY_CONFIG = {

    // Your full name — displayed in the hero, nav, and footer.
    // Example: "Jane Doe"
    name: "Jane Doe",

    // Your job title or tagline shown beneath your name on the hero section.
    // Example: "Full Stack Developer"
    title: "Full Stack Developer",

    // The browser tab title.
    // Example: "Jane Doe | Full Stack Developer"
    pageTitle: "Jane Doe | Full Stack Developer",

    // Paths to your profile/hero images.
    // Place your images inside my-data/images/ and update the filenames below.
    // heroBaseImage is always visible; heroHoverImage swaps in on desktop hover.
    heroBaseImage: "./my-data/images/hero-base.jpeg",
    heroHoverImage: "./my-data/images/hero-hover.jpeg",

    // Social links — leave any value as "" to hide that button entirely.
    // github   → your GitHub profile URL
    // linkedin → your LinkedIn profile URL
    // email    → your email address (without "mailto:", just the address)
    socials: {
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        email: "jane@example.com"
    },

    // Your GitHub username — used by the admin dashboard to import repositories.
    // Example: "yourusername"
    githubUsername: "yourusername",

    // Admin dashboard password — keep this private, choose something strong.
    // The dashboard is only accessible on the desktop version.
    adminPassword: "yourpassword",

    // Secret URL key used to open the admin dashboard.
    // Visit /?admin=YOUR_KEY to open the dashboard login prompt.
    // Example: "myportfoliokey"
    adminUrlKey: "admin",

    // Path to the JSON file that stores your projects and certifications.
    // You normally do not need to change this.
    dataFile: "./my-data/portfolio_data.json",

    // (Optional) Base URL for certificate images hosted on GitHub.
    // Leave as "" if you are not using this feature.
    certImageBaseUrl: "",

    // Local-storage key for caching your portfolio data in the browser.
    // Change this to a new unique string to reset all locally saved data.
    storageKey: "portfolio_v3"
};
