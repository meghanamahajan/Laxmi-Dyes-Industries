document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('[data-header]');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    const navOverlay = document.querySelector('[data-nav-overlay]');
    const navClose = document.querySelector('[data-nav-close]');
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
        const wasOpen = body.classList.contains('nav-open');
        body.classList.remove('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            if (wasOpen) {
                requestAnimationFrame(() => navToggle.focus());
            }
        }
    };

    const focusFirstNavLink = () => {
        const firstNavLink = nav?.querySelector('a');
        if (firstNavLink) {
            requestAnimationFrame(() => firstNavLink.focus());
        }
    };

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = body.classList.contains('nav-open');
            if (isOpen) {
                closeNav();
                return;
            }
            body.classList.add('nav-open');
            navToggle.setAttribute('aria-expanded', 'true');
            focusFirstNavLink();
        });
    }

    navOverlay?.addEventListener('click', closeNav);
    navClose?.addEventListener('click', closeNav);

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

    const forms = document.querySelectorAll('[data-form]');
    const focusFullNameField = () => {
        const nameField = document.getElementById('fullName');
        if (nameField) {
            nameField.focus({ preventScroll: true });
        }
    };

    if (forms.length) {
        forms.forEach((form) => {
            const honeypot = form.querySelector('.hp-field');
            let statusNode = form.querySelector('.form-status');
            if (!statusNode) {
                statusNode = document.createElement('p');
                statusNode.className = 'form-status';
                form.appendChild(statusNode);
            }
            const endpoint = form.dataset.endpoint || 'https://formspree.io/f/xgejbqed';

            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                statusNode.textContent = '';

                if (honeypot && honeypot.value) {
                    return;
                }

                if (!form.reportValidity()) {
                    return;
                }

                const formData = new FormData(form);

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
                        form.reset();
                    } else {
                        statusNode.textContent = 'Please email laxmidyes@gmail.com or call +91 70482 39718 to complete your request.';
                    }
                } catch (error) {
                    console.error(error);
                    statusNode.textContent = 'Network issue. Use the email or phone fallback listed above.';
                }
            });
        });

        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            const focusIfHashMatches = () => {
                if (window.location.hash === '#contact-form') {
                    focusFullNameField();
                }
            };

            focusIfHashMatches();
            window.addEventListener('hashchange', focusIfHashMatches);
            document.querySelectorAll('a[href="#contact-form"]').forEach((link) => {
                link.addEventListener('click', () => {
                    requestAnimationFrame(() => focusFullNameField());
                });
            });
        }
    }

    const docModal = document.querySelector('[data-doc-modal]');
    let lastFocusedTrigger = null;

    const closeDocModal = () => {
        if (!docModal?.classList.contains('is-open')) {
            return;
        }
        docModal.classList.remove('is-open');
        docModal.setAttribute('aria-hidden', 'true');
        body.classList.remove('modal-open');
        if (lastFocusedTrigger) {
            lastFocusedTrigger.focus();
        }
    };

    const openDocModal = (trigger) => {
        if (!docModal) {
            return;
        }
        lastFocusedTrigger = trigger || document.activeElement;
        docModal.classList.add('is-open');
        docModal.setAttribute('aria-hidden', 'false');
        body.classList.add('modal-open');
        const focusTarget = docModal.querySelector('input, select, textarea, button:not([data-doc-modal-close])');
        requestAnimationFrame(() => focusTarget?.focus());
    };

    document.querySelectorAll('[data-doc-modal-open]').forEach((btn) => {
        btn.addEventListener('click', () => openDocModal(btn));
    });

    docModal?.querySelectorAll('[data-doc-modal-close]').forEach((btn) => {
        btn.addEventListener('click', closeDocModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDocModal();
            closeProductModal();
        }
    });

    const productModal = document.querySelector('[data-product-modal]');
    const productTitleElement = document.querySelector('[data-product-title]');
    const productFieldElement = document.querySelector('[data-product-field]');
    let lastProductTrigger = null;

    const closeProductModal = () => {
        if (!productModal?.classList.contains('is-open')) {
            return;
        }
        productModal.classList.remove('is-open');
        productModal.setAttribute('aria-hidden', 'true');
        body.classList.remove('modal-open');
        if (lastProductTrigger) {
            lastProductTrigger.focus();
        }
    };

    const openProductModal = (trigger, productName) => {
        if (!productModal) {
            return;
        }
        lastProductTrigger = trigger || document.activeElement;
        
        if (productTitleElement) {
            productTitleElement.textContent = productName || 'Product Enquiry';
        }
        if (productFieldElement) {
            productFieldElement.value = productName || '';
        }
        
        productModal.classList.add('is-open');
        productModal.setAttribute('aria-hidden', 'false');
        body.classList.add('modal-open');
        const focusTarget = productModal.querySelector('input:not([type="hidden"]):not(.hp-field)');
        requestAnimationFrame(() => focusTarget?.focus());
    };

    document.querySelectorAll('[data-product-modal-open]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const productName = btn.dataset.productName || 'Product';
            openProductModal(btn, productName);
        });
    });

    productModal?.querySelectorAll('[data-product-modal-close]').forEach((btn) => {
        btn.addEventListener('click', closeProductModal);
    });
});
