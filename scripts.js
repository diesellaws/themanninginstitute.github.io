document.addEventListener("DOMContentLoaded", function () {
    // Load Header and Footer
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-component').innerHTML = data;

            // Initialize after header loads
            initHeader();
        })
        .catch(error => console.error('Error loading header:', error));

    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-component').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));

    // Function to handle all the header-related functionality
    function initHeader() {
        // Add IntersectionObserver for scrolling animations
		const threshold = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--observer-threshold'));
		const observerOptions = { threshold: threshold };
	
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.animate').forEach(el => observer.observe(el));

        // Handle scroll events for header changes
        const header = document.getElementById('header-component');
        const headerCTA = document.getElementById('header-cta');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Fade the header in/out on scroll
            if (scrollY > lastScrollY) {
                header.style.opacity = '0';
                header.style.pointerEvents = 'none';
            } else {
                header.style.opacity = '1';
                header.style.pointerEvents = 'all';
            }

            // Change header background based on scroll position
            if (scrollY < 150) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                headerCTA.style.opacity = '0';
            } else {
                header.style.backgroundColor = '#fff';
                headerCTA.style.opacity = '1';
            }

            lastScrollY = scrollY;
        });

        // Highlight active navigation link
        const currentPath = window.location.pathname;
        document.querySelectorAll('.header-nav .nav-option').forEach(link => {
            if (currentPath.startsWith(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });

        // Only run the testimonial slider on the homepage
        if (currentPath === '/') {
            initTestimonialSlider();
        }
		
		// copyable email
		if (currentPath === '/contact') {
			const emailElement = document.getElementById('copyable-email-address');
		    const copyConfirmation = document.getElementById('copy-confirmation');
			emailElement.addEventListener('click', () => {
				const emailText = emailElement.innerText;
		
				// Copy the email text to the clipboard
				navigator.clipboard.writeText(emailText).then(() => {
					// Show confirmation message
					copyConfirmation.style.display = 'inline';
					
					// Hide the confirmation message after 2 seconds
					setTimeout(() => {
						copyConfirmation.style.display = 'none';
					}, 2000);
				}).catch(err => {
					console.error('Failed to copy email: ', err);
				});
			});
		}
		
		// hamburger mobile
		const hamburgerButton = document.getElementById('hamburger-menu');
		
		hamburgerButton.addEventListener('click', function() {
			const nav = document.querySelector('.header-nav');
		    const navDisplay = window.getComputedStyle(nav).display;
		    nav.style.display = (navDisplay === 'none') ? 'flex' : 'none';
		});
    }

    // Function to handle the testimonial slider
    function initTestimonialSlider() {
        let currentSlide = 1;
        const totalSlides = 4;
        const slideInterval = 6000;
        let autoSlideInterval;

        function autoSlide() {
            currentSlide = (currentSlide % totalSlides) + 1;
            document.getElementById('slide' + currentSlide).checked = true;
        }

        autoSlideInterval = setInterval(autoSlide, slideInterval);

        document.querySelectorAll('input[name="testimonial"]').forEach(button => {
            button.addEventListener('click', () => {
                currentSlide = parseInt(button.id.replace('slide', ''), 10);
                clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(autoSlide, slideInterval); // Reset timer
            });
        });
    }
	
});
