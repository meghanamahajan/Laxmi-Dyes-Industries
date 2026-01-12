# Laxmi Dyes Industries – Static Website

World-class, responsive marketing site for Laxmi Dyes Industries covering products, solutions, industries, safety & compliance, and contact workflows.

## Getting Started
1. Clone or download this folder.
2. Serve the site with any static server (examples below) to ensure relative links load correctly:
   - **VS Code Live Server:** Right-click `index.html` → *Open with Live Server*.
   - **Node http-server:** `npx http-server .`
   - **Python:** `python -m http.server`
3. Visit `http://localhost:8080` (or the port shown) to explore all pages.

## File Map
```
index.html
products.html
solutions.html
industries.html
safety-compliance.html
contact.html
assets/
  css/style.css
  js/main.js
  js/manifest-loader.js
img/
  image-manifest.json
  IMAGE_SOURCES.md
```

## Image Management
- All visual assets load through `assets/js/manifest-loader.js`, which reads `img/image-manifest.json`.
- Update the manifest whenever you swap images so every page refresh picks up the new filenames without touching HTML.
- Keep proof of license for each asset. `img/IMAGE_SOURCES.md` lists recommended topics, sources, and filenames.
- **Logo requirement:** replace the placeholder `img/logo.jpg` with an official file that includes `laxmi` in the filename (for example `img/laxmi-logo.png`). Update the `logo` entry inside `image-manifest.json` accordingly.

## Contact Form (Formspree setup)
The contact form posts to Formspree. Configure it by:
1. Creating a new Formspree form and copying its endpoint URL (looks like `https://formspree.io/f/xxxxxx`).
2. Updating the `data-endpoint` attribute on the `<form>` tag or change the fallback value inside `assets/js/main.js` (`FORM_ENDPOINT`).
3. Adding the allowed domain within Formspree’s dashboard so submissions aren’t blocked.

### EmailJS alternative
If you prefer EmailJS:
1. Install EmailJS via `<script src="https://cdn.emailjs.com/sdk/3.2.0/email.min.js"></script>`.
2. Initialize the SDK in `assets/js/main.js` and send the form fields through `emailjs.send`.
3. Remove or disable the Formspree fetch block to avoid duplicate submissions.

### Fallback Channels
- Direct email: `mailto:laxmidyes@gmail.com`
- Phone: `tel:+917048239718` / `tel:+971552932497`
- WhatsApp: `https://wa.me/917048239718`
These are already linked inside `contact.html` and surface automatically if the JS request fails.

## Performance & Accessibility Notes
- Mobile-first CSS with breakpoints at 480px, 768px, 1024px, and 1280px.
- Sticky, accessible navigation with skip-link, focus styles, and aria attributes.
- Images lazy-load and can be swapped without touching HTML.
- Contact form includes validation and honeypot spam protection (field named `company`).

## Deployment Checklist
1. Optimize/replace imagery (WebP/AVIF) and update `image-manifest.json`.
2. Configure Formspree or EmailJS endpoint and test submission.
3. Run a static server preview (`npx http-server .`) and audit with Lighthouse (Performance, Accessibility, SEO, Best Practices >90 recommended).
4. Push to your hosting provider (Azure Static Web Apps, Netlify, Vercel, GitHub Pages, etc.).
