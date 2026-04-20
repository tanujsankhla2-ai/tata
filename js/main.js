document.addEventListener("DOMContentLoaded", () => {
    
    // Mobile Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other accordions
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.nextElementSibling.style.maxHeight = null;
            });

            // Toggle current accordion
            if (!isActive) {
                item.classList.add('active');
                const answer = item.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Booking Form WhatsApp Integration
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default page reload
            
            const inputs = bookingForm.querySelectorAll('input');
            const select = bookingForm.querySelector('select');
            
            const name = inputs[0].value;
            const phone = inputs[1].value;
            const service = select.options[select.selectedIndex].text;
            const date = inputs[2].value;
            const time = inputs[3].value;

            // APNA WHATSAPP NUMBER YAHAN DAALEIN (Country code ke saath, bina + ke)
            // Example for India: 919876543210
            const whatsappNumber = "918949853554"; 
            
            const message = `Hello Juju Beauty Parlour! I want to book an appointment:%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A*Date:* ${date}%0A*Time:* ${time}`;
            
            // Open WhatsApp link in a new tab
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            
            // Reset the form after sending
            bookingForm.reset();
            alert('Redirecting to WhatsApp to confirm your booking!');
        });
    }

    // 3. GSAP Animations
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry Animation
    const tl = gsap.timeline();
    tl.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    })
    .from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.5")
    .from(".hero-buttons", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.4");

    // Scroll Reveal for Sections
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { 
                y: 50, 
                opacity: 0 
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // Triggers when the top of the element hits 85% of the viewport height
                    toggleActions: "play none none none" 
                }
            }
        );
    });

    // Slight floating motion for service cards
    gsap.to(".service-card", {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2
    });

    // 4. Hero Canvas Animation
    const canvas = document.getElementById("hero-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");

        // 1. Setup & Responsive Resizing
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // 2. Animation Configuration
        const frameCount = 50; // UPDATE THIS: The total number of images in your @hero folder
        const fps = 30;        // Playback speed (adjust for smoother/faster playback)

        // Function to get the correct file path
        const getImagePath = (index) => `./@hero/ezgif-frame-${index.toString().padStart(3, '0')}.png`;

        const images = [];
        let imagesLoaded = 0;
        let currentFrame = 0;

        // 3. Preload Images
        let animationInitialized = false;
        const playhead = { frame: 0 };

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = getImagePath(i);
            img.onload = () => {
                imagesLoaded++;
                // Draw the very first frame immediately once it loads
                if (imagesLoaded === 1) {
                    renderFrame(0);
                }
                // Initialize Scroll Animation once all images load
                if (imagesLoaded === frameCount && !animationInitialized) {
                    startScrollAnimation();
                    animationInitialized = true;
                }
            };
            images.push(img);
        }

        // 4. Render Logic (mimics 'background-size: cover')
        function renderFrame(index) {
            index = Math.round(index); // Ensure we grab a whole number index
            if (images[index] && images[index].complete) {
                const img = images[index];
                const canvasRatio = canvas.width / canvas.height;
                const imgRatio = img.width / img.height;
                
                let drawWidth = canvas.width;
                let drawHeight = canvas.height;
                let offsetX = 0;
                let offsetY = 0;

                if (canvasRatio > imgRatio) {
                    drawHeight = canvas.width / imgRatio;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = canvas.height * imgRatio;
                    offsetX = (canvas.width - drawWidth) / 2;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        }

        // 5. ScrollTrigger Animation
        function startScrollAnimation() {
            gsap.to(playhead, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "+=" + window.innerHeight, // 1x window height scrolling duration
                    scrub: 1, // Smooth scrub effect
                    pin: true // Pins the section so the user sees the full animation before continuing
                },
                onUpdate: () => renderFrame(playhead.frame)
            });
        }
    }
});
