const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const currentYear = document.querySelector('#current-year');
const formNext = document.querySelector('#form-next');
const formSuccess = document.querySelector('#form-success');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href') || '';
            const opensInNewTab = link.getAttribute('target') === '_blank';

            // Keep mobile menu state for external links; iOS can ignore first tap otherwise.
            if (opensInNewTab || !href.startsWith('#')) {
                return;
            }

            nav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}

if (formNext) {
    const returnUrl = new URL(window.location.href);
    returnUrl.searchParams.set('odeslano', '1');
    returnUrl.hash = 'kontaktujte-nas';
    formNext.value = returnUrl.toString();
}

if (formSuccess) {
    const params = new URLSearchParams(window.location.search);

    if (params.get('odeslano') === '1') {
        formSuccess.hidden = false;
    }
}

const compareCards = document.querySelectorAll('[data-compare]');

compareCards.forEach((card) => {
    const range = card.querySelector('.ba-range');

    if (!range) {
        return;
    }

    const renderPosition = () => {
        card.style.setProperty('--pos', `${range.value}%`);
    };

    range.addEventListener('input', renderPosition);
    range.addEventListener('change', renderPosition);
    renderPosition();
});

// iOS Safari can ignore the first tap on links with target="_blank" (the hover
// state or a menu re-render moves the element). On touch devices we therefore
// navigate in the same tab, which always works; desktop keeps the new tab.
const touchOnly = window.matchMedia('(hover: none)').matches;
const externalLinks = document.querySelectorAll('.google-badge, .nav-social, .social-card');

if (touchOnly) {
    externalLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (event.defaultPrevented || !link.href) {
                return;
            }

            event.preventDefault();
            window.location.href = link.href;
        });
    });
}