document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element Selection ---
    const header = document.getElementById('header');
    const hero = document.querySelector('.hero');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    // --- State ---
    let isScrolling;

    // --- Functions ---

    /**
     * Handles header style changes on scroll.
     */
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 25, 47, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 25, 47, 0.85)';
            header.style.boxShadow = 'none';
        }
    }

    /**
     * Applies a parallax effect to the hero section background.
     */
    function handleParallax() {
        if (hero) {
            const scrollY = window.scrollY;
            // Using transform for better performance
            hero.style.backgroundPositionY = `${-scrollY * 0.5}px`;
        }
    }

    /**
     * Highlights the current section in the navigation.
     */
    function updateActiveSection() {
        let currentSectionId = '';
        const headerOffset = header.offsetHeight + 20; // Add a little buffer

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Fallback to the first section if no section is active (e.g., at the top)
        if (!currentSectionId && window.pageYOffset < sections[0].offsetTop) {
            currentSectionId = sections[0].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active-section');
            // Check if the link's href corresponds to the current section
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active-section');
            }
        });
    }

    /**
     * Handles all scroll-related events.
     * Uses a timeout to avoid running functions too often.
     */
    function onScroll() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                handleParallax();
                updateActiveSection();
            });
        }, 10); // A small delay to debounce
    }

    /**
     * Toggles the mobile navigation menu.
     */
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    /**
     * Closes the mobile menu if it's open.
     */
    function closeMobileMenu() {
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    /**
     * Handles smooth scrolling to anchor links.
     * @param {Event} e - The click event.
     */
    function handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu on navigation
            closeMobileMenu();
        }
    }

    // --- Event Listeners ---
    window.addEventListener('scroll', onScroll, { passive: true });
    hamburger.addEventListener('click', toggleMobileMenu);
    smoothScrollLinks.forEach(link => link.addEventListener('click', handleSmoothScroll));

    // --- Clickable Portfolio Cards ---
    // Makes the entire portfolio item clickable for better UX, especially on mobile.
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        const link = item.querySelector('a');

        // Only add listeners if a link exists inside the card
        if (link) {
            item.style.cursor = 'pointer';
            item.setAttribute('tabindex', '0');

            item.addEventListener('click', (event) => {
                // Let the browser handle clicks on the link itself
                if (event.target.closest('a')) {
                    return;
                }
                link.click();
            });

            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    link.click();
                }
            });
        }
    });

    // Initial calls on page load
    handleHeaderScroll();
    updateActiveSection();
});