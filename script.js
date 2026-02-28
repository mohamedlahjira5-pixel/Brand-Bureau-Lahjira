document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LOADER ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });

    // --- 2. STICKY NAVBAR ---
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 3. MOBILE MENU ---
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    function openMobileMenu() {
        mobileMenuOverlay.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
    if (menuClose) menuClose.addEventListener('click', closeMobileMenu);

    // Expose to window for inline onclick use
    window.closeMobileMenu = closeMobileMenu;

    // --- 4. SMOOTH SCROLLING & ACTIVE LINKS ---
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('section');
    const navHeight = 70; // Matching CSS logic

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Close mobile menu if open
                if (mobileMenuOverlay.classList.contains('open')) {
                    closeMobileMenu();
                }

                // Scroll to target with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Active Nav Link
    const navObserverOptions = {
        root: null,
        rootMargin: `-${navHeight}px 0px -60% 0px`,
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Update both desktop and mobile links
                document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        if (section.id) {
            navObserver.observe(section);
        }
    });


    // --- 5. SCROLL ANIMATIONS (Fade-In & Slide-Up) ---
    const animElements = document.querySelectorAll('.scroll-anim');

    const animObserverOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1
    };

    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, animObserverOptions);

    animElements.forEach(el => {
        animObserver.observe(el);
    });


    // --- 6. BACK TO TOP & STICKY CTA ---
    const backToTopBtn = document.getElementById('backToTop');
    const stickyCta = document.getElementById('stickyCta');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            if (backToTopBtn) backToTopBtn.classList.add('visible');
            if (window.innerWidth <= 768 && stickyCta) {
                stickyCta.classList.remove('hide');
            }
        } else {
            if (backToTopBtn) backToTopBtn.classList.remove('visible');
            if (stickyCta) stickyCta.classList.add('hide');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // --- 7. COOKIE CONSENT BANNER ---
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const closeCookieBtn = document.getElementById('closeCookie');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        // Small delay to let user see site first
        setTimeout(() => {
            cookieBanner.classList.remove('hide');
        }, 2000);
    }

    function hideCookieBanner() {
        cookieBanner.classList.add('hide');
        localStorage.setItem('cookieConsent', 'true');
    }

    if (acceptCookiesBtn) acceptCookiesBtn.addEventListener('click', hideCookieBanner);
    if (closeCookieBtn) closeCookieBtn.addEventListener('click', hideCookieBanner);


    // --- 8. CONTACT MODAL ---
    const contactModal = document.getElementById('contactModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalForm = document.getElementById('modalForm');
    const modalServiceSelect = document.getElementById('mService');
    const modalSuccess = document.getElementById('modalSuccess');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');

    // Globals for external onclick
    window.openContactModal = function (serviceVal = 'Algemeen') {
        if (contactModal) {
            contactModal.classList.remove('hide');
            contactModal.classList.add('open');
            document.body.style.overflow = 'hidden';

            // Reset form if previously submitted
            if (modalSuccess && !modalSuccess.classList.contains('hide')) {
                modalSuccess.classList.add('hide');
                modalSubmitBtn.style.display = 'block';
                modalForm.reset();
            }

            if (modalServiceSelect) {
                // Find matching option, set selected
                for (let i = 0; i < modalServiceSelect.options.length; i++) {
                    if (modalServiceSelect.options[i].value === serviceVal) {
                        modalServiceSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    };

    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.remove('open');
            contactModal.classList.add('hide');
            document.body.style.overflow = '';
        }
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeContactModal);

    // Close on outside click
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
    }

    // Handle ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal && contactModal.classList.contains('open')) {
            closeContactModal();
        }
    });

    // Modal Form Submit
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Show loading state
            modalSubmitBtn.innerHTML = 'Bezig met verzenden...';
            modalSubmitBtn.disabled = true;

            // Collect the form data
            const formData = new FormData(modalForm);

            // Send the POST request to FormSubmit (updated to lahjira@icloud.com)
            fetch('https://formsubmit.co/ajax/lahjira@icloud.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Tells FormSubmit to respond with JSON instead of redirecting
                }
            })
                .then(response => {
                    if (response.ok) {
                        // Success handling
                        modalSubmitBtn.style.display = 'none';
                        modalSubmitBtn.innerHTML = 'Versturen';
                        modalSubmitBtn.disabled = false;

                        if (modalSuccess) modalSuccess.classList.remove('hide');

                        // Auto close after 3s
                        setTimeout(() => {
                            closeContactModal();
                        }, 3000);
                    } else {
                        // Error handling
                        modalSubmitBtn.innerHTML = 'Fout bij verzenden';
                        modalSubmitBtn.disabled = false;
                        alert('Er ging iets mis bij het verzenden van het formulier. Probeer het later opnieuw.');
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    modalSubmitBtn.innerHTML = 'Fout bij verzenden';
                    modalSubmitBtn.disabled = false;
                });
        });
    }


    // --- 9. EARLY ACCESS NEWSLETTER FORM ---
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Even geduld...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                newsletterForm.reset();

                if (newsletterSuccess) {
                    newsletterSuccess.style.display = 'block';
                    setTimeout(() => {
                        newsletterSuccess.style.display = 'none';
                    }, 4000);
                }
            }, 1500);
        });
    }

});
