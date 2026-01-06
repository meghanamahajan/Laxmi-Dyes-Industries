document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('[data-header]');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const themeLabel = document.querySelector('[data-theme-toggle-label]');

    const THEME_STORAGE_KEY = 'ld-theme-preference';

    const getStoredTheme = () => {
        try {
            return localStorage.getItem(THEME_STORAGE_KEY);
        } catch (error) {
            console.warn('Theme storage unavailable', error);
            return null;
        }
    };

    const storeTheme = (theme) => {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Theme storage unavailable', error);
        }
    };

    const applyTheme = (theme) => {
        const isNight = theme === 'night';
        body.classList.toggle('theme-night', isNight);
        body.dataset.theme = theme;
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(isNight));
        }
        if (themeLabel) {
            themeLabel.textContent = isNight ? 'Night' : 'Day';
        }
    };

    const resolveInitialTheme = () => {
        const stored = getStoredTheme();
        if (stored) {
            return stored;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'night';
        }
        return 'day';
    };

    const setTheme = (theme, persist = true) => {
        applyTheme(theme);
        if (persist) {
            storeTheme(theme);
        }
    };

    const initialTheme = resolveInitialTheme();
    applyTheme(initialTheme);

    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSchemeChange = (event) => {
            if (getStoredTheme()) {
                return;
            }
            setTheme(event.matches ? 'night' : 'day', false);
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSchemeChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleSchemeChange);
        }
    }

    themeToggle?.addEventListener('click', () => {
        const nextTheme = body.classList.contains('theme-night') ? 'day' : 'night';
        setTheme(nextTheme);
    });

    const closeNav = () => {
        body.classList.remove('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = body.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    nav?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            closeNav();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            closeNav();
        }
    });

    window.addEventListener('scroll', () => {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 10);
    });

    const contactForm = document.querySelector('[data-form]');
    if (contactForm) {
        const honeypot = contactForm.querySelector('.hp-field');
        let statusNode = contactForm.querySelector('.form-status');
        if (!statusNode) {
            statusNode = document.createElement('p');
            statusNode.className = 'form-status';
            contactForm.appendChild(statusNode);
        }
        const endpoint = contactForm.dataset.endpoint || 'https://formspree.io/f/xgejbqed';

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            statusNode.textContent = '';

            if (honeypot && honeypot.value) {
                return;
            }

            if (!contactForm.reportValidity()) {
                return;
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (response.ok) {
                    statusNode.textContent = 'Thank you. Our team will reach out shortly.';
                    contactForm.reset();
                } else {
                    statusNode.textContent = 'Please email laxmidyes@gmail.com or call +91 70482 39718 to complete your request.';
                }
            } catch (error) {
                console.error(error);
                statusNode.textContent = 'Network issue. Use the email or phone fallback listed above.';
            }
        });
    }
});
