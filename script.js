const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const currentYear = document.querySelector('#current-year');
const carousels = document.querySelectorAll('[data-carousel]');
const galleryModal = document.querySelector('[data-gallery-modal]');
const galleryModalImage = document.querySelector('[data-gallery-modal-image]');
const galleryModalPrev = document.querySelector('.gallery-modal-prev');
const galleryModalNext = document.querySelector('.gallery-modal-next');
const galleryModalClose = document.querySelector('.gallery-modal-close');
const formNext = document.querySelector('#form-next');
const formSuccess = document.querySelector('#form-success');
const facebookLinks = document.querySelectorAll('.facebook-link[data-facebook-id]');

let modalSlides = [];
let modalIndex = 0;

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

if (facebookLinks.length) {
    const isIOSDevice = /iPhone|iPad|iPod/.test(window.navigator.userAgent)
        || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    facebookLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (!isIOSDevice) {
                return;
            }

            const profileId = link.getAttribute('data-facebook-id');
            const webUrl = link.href;

            if (!profileId || !webUrl) {
                return;
            }

            event.preventDefault();

            const fallbackTimer = window.setTimeout(() => {
                window.location.href = webUrl;
            }, 900);

            window.addEventListener('pagehide', () => {
                window.clearTimeout(fallbackTimer);
            }, { once: true });

            window.location.href = `fb://profile/${profileId}`;
        });
    });
}

carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll('[data-slide]');
    const dots = carousel.querySelectorAll('[data-dot]');
    const prevButton = carousel.querySelector('.gallery-arrow-prev');
    const nextButton = carousel.querySelector('.gallery-arrow-next');

    if (!slides.length || !dots.length || !prevButton || !nextButton) {
        return;
    }

    let activeIndex = 0;

    const renderSlide = (index) => {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
    };

    slides.forEach((slide, index) => {
        const image = slide.querySelector('img');

        if (image) {
            image.addEventListener('click', () => {
                if (!galleryModal || !galleryModalImage) {
                    return;
                }

                modalSlides = Array.from(slides).map((carouselSlide) => carouselSlide.querySelector('img'));
                modalIndex = index;
                galleryModal.hidden = false;
                document.body.style.overflow = 'hidden';

                const modalImage = modalSlides[modalIndex];
                galleryModalImage.src = modalImage.src;
                galleryModalImage.alt = modalImage.alt;
            });
        }
    });

    prevButton.addEventListener('click', () => {
        renderSlide(activeIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        renderSlide(activeIndex + 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            renderSlide(index);
        });
    });
});

const renderModalSlide = (direction) => {
    if (!galleryModalImage || !modalSlides.length) {
        return;
    }

    modalIndex = (direction + modalSlides.length) % modalSlides.length;
    galleryModalImage.src = modalSlides[modalIndex].src;
    galleryModalImage.alt = modalSlides[modalIndex].alt;
};

if (galleryModal && galleryModalImage && galleryModalPrev && galleryModalNext && galleryModalClose) {
    galleryModalPrev.addEventListener('click', () => {
        renderModalSlide(modalIndex - 1);
    });

    galleryModalNext.addEventListener('click', () => {
        renderModalSlide(modalIndex + 1);
    });

    galleryModalClose.addEventListener('click', () => {
        galleryModal.hidden = true;
        document.body.style.overflow = '';
    });

    galleryModal.addEventListener('click', (event) => {
        if (event.target === galleryModal) {
            galleryModal.hidden = true;
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (galleryModal.hidden) {
            return;
        }

        if (event.key === 'Escape') {
            galleryModal.hidden = true;
            document.body.style.overflow = '';
        }

        if (event.key === 'ArrowLeft') {
            renderModalSlide(modalIndex - 1);
        }

        if (event.key === 'ArrowRight') {
            renderModalSlide(modalIndex + 1);
        }
    });
}