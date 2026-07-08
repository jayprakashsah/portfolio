// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Core Feature Initializations
    initTheme();
    initMobileMenu();
    initTypingEffect();
    initScrollEffects();
    initProjectFilter();
    initContactForm();
    initParticleBackground();
    initTimelineTabs();
    initProjectModal(); // Initialize the dynamic details popup modal
});

/* ==========================================================================
   THEME TOGGLE STATE (DARK/LIGHT MODE)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply the active theme
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Re-draw Lucide icons since light/dark icon displays might need updates
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

/* ==========================================================================
   MOBILE NAVIGATION MENU TOGGLING
   ========================================================================== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Open/Close menu
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !mobileToggle.contains(e.target) && navbar.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('active');
        }
    });
}

/* ==========================================================================
   TYPING ANOMATION (HERO CONTENT)
   ========================================================================== */
function initTypingEffect() {
    const textTarget = document.getElementById('typing-text');
    if (!textTarget) return;

    const roles = [
        'Full-Stack Web Apps.',
        'IoT & Embedded Systems.',
        'AI/ML Algorithms.',
        'Software Architectures.'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Remove character
            textTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster than typing
        } else {
            // Add character
            textTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        // Typing logic boundaries
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at complete word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Small delay before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typewriter loop
    setTimeout(type, 1000);
}

/* ==========================================================================
   SCROLL AND ANIMATION REVEAL HANDLING (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollEffects() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollReveals = document.querySelectorAll('.scroll-reveal');

    // Scrolled header overlay transition
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll-reveals (fade-in, slide-up)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's the skills section, animate progress bars
                if (entry.target.id === 'skills') {
                    entry.target.classList.add('active-section');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Reveal slightly early before entering viewport center
    });

    scrollReveals.forEach(element => {
        revealObserver.observe(element);
    });

    // Also observe the Skills section specifically for progress bar animations
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        revealObserver.observe(skillsSection);
    }

    // ScrollSpy active link updates
    const scrollspyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId || 
                        (sectionId === 'home' && link.getAttribute('data-section') === 'home')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5, // Change active state when 50% of section is visible
        rootMargin: '-80px 0px -20% 0px' // Offset headers
    });

    sections.forEach(section => {
        scrollspyObserver.observe(section);
    });
}

/* ==========================================================================
   DYNAMIC PROJECT GRID FILTER
   ========================================================================== */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update button states
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Visual clean transitions using CSS classes
                card.classList.remove('fade-in-anim');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    // Trigger reflow to restart animations
                    void card.offsetWidth;
                    card.classList.add('fade-in-anim');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

/* ==========================================================================
   ABOUT TIMELINE TABS SWITCHER
   ========================================================================== */
function initTimelineTabs() {
    const tabBtns = document.querySelectorAll('.timeline-tab-btn');
    const tabContents = document.querySelectorAll('.timeline-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Toggle active classes on buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle active classes on contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('id') === `tab-${targetTab}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/* ==========================================================================
   PROJECT DETAILS DICTIONARY & MODAL HANDLER
   ========================================================================== */

const PROJECT_DETAILS = {
    'kisan-sathi': {
        title: 'Kisan Sathi Autonomous Agricultural Rover',
        date: 'March 2026 (Ongoing)',
        category: 'IoT & AI System',
        tech: ['Python', 'React', 'C++ (Arduino)', 'Jetson Nano', 'OpenCV', 'Visual SLAM', 'GSM Telemetry'],
        gitLink: 'https://github.com/jayprakashsah',
        liveLink: 'https://github.com/jayprakashsah',
        imgGrad: 'img-grad-1',
        icon: 'tractor',
        desc: `
            <p><strong>Kisan Sathi</strong> is a predictive plant protection ecosystem featuring an autonomous agricultural rover and a real-time digital advisory mobile dashboard application.</p>
            <p>It is designed to solve critical crop management and resource optimization issues faced by modern agricultural systems by automating field visual rows scouting.</p>
            <h4>Core Technical Implementations:</h4>
            <ul>
                <li><strong>Edge-Computed Vision Navigation</strong>: Employs a Nvidia Jetson Nano running OpenCV algorithms to detect crop visual rows in real-time, guiding the rover steering autonomously.</li>
                <li><strong>Precision Micro-Dosing</strong>: Implements visual computer vision models to execute targeted, height-adjusted micro-treatment spraying, reducing chemical footprint by up to 40%.</li>
                <li><strong>Visual SLAM Navigation</strong>: Employs 3D visual mapping algorithms to avoid obstacles and construct field coordinates.</li>
                <li><strong>GSM Telemetry Logging</strong>: Renders real-time telemetry reports directly to the user dashboard using low-latency serial nodes.</li>
            </ul>
        `
    },
    'personal-assistant': {
        title: 'Autonomous Personal Assistant',
        date: 'August 2025',
        category: 'Embedded Systems',
        tech: ['Python', 'Raspberry Pi 5', 'OpenCV', 'SIM800L', 'Speech Recog', 'React', 'PWM control'],
        gitLink: 'https://github.com/jayprakashsah',
        liveLink: 'https://github.com/jayprakashsah',
        imgGrad: 'img-grad-2',
        icon: 'bot',
        desc: `
            <p>An advanced multimodal physical assistant powered by a Raspberry Pi 5. It bridges intelligent high-level software logic with direct physical actuators control.</p>
            <p>The assistant provides interactive verbal communication, facial expressiveness, and remote alerting mechanisms designed for personal task automations.</p>
            <h4>Core Technical Implementations:</h4>
            <ul>
                <li><strong>AI Voice Speech Interface</strong>: Integrates neural speech-to-text algorithms and vocal text-to-speech output pipelines.</li>
                <li><strong>OLED Emotional expressions Matrix</strong>: Renders real-time expressions on a display matrix, dynamically shifting to represent active tasks states.</li>
                <li><strong>Wi-Fi-Independent GSM alerts</strong>: Integrates a SIM800L module to route critical alert SMS telemetry directly, ensuring failsafe notifications.</li>
                <li><strong>PWM Motor Control</strong>: Directly links high-level navigation decisions to low-level motor boards using pulse-width modulation.</li>
            </ul>
        `
    },
    'ecommerce': {
        title: 'MERN E-Commerce - Digital Marketplace',
        date: 'December 2025',
        category: 'Fullstack Web App',
        tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB Atlas', 'JWT Auth', 'Context API'],
        gitLink: 'https://github.com/jayprakashsah',
        liveLink: 'https://github.com/jayprakashsah',
        imgGrad: 'img-grad-3',
        icon: 'shopping-bag',
        desc: `
            <p>A secure digital commerce marketplace built using the MERN stack. Designed with performance and database scalability at its core.</p>
            <p>Includes a responsive shopping dashboard and an advanced administrative panel to manage inventory and track orders.</p>
            <h4>Core Technical Implementations:</h4>
            <ul>
                <li><strong>JWT Authorizations Vault</strong>: Implements JSON Web Token handlers inside cookies to secure session checks and user checkouts.</li>
                <li><strong>Database Optimization</strong>: Integrates indexed MongoDB search paths, ensuring sub-second response times for catalog lookups.</li>
                <li><strong>State Synchronization</strong>: Renders dynamic state updates across pages using the React Context API.</li>
                <li><strong>Production Deployment</strong>: Structured environment variables and deployed full-stack pipelines to scalable cloud nodes.</li>
            </ul>
        `
    },
    'smart-phr': {
        title: 'SmartPHR: Advanced AI Health OS',
        date: '2026 (Completed)',
        category: 'AI & Health OS',
        tech: ['React.js', 'Node.js', 'MongoDB', 'Python FastAPI', 'Gemini AI', 'OAuth 2.0', 'Google Fit API'],
        gitLink: 'https://github.com/jayprakashsah',
        liveLink: 'https://github.com/jayprakashsah',
        imgGrad: 'img-grad-4',
        icon: 'activity',
        desc: `
            <p><strong>SmartPHR</strong> is a fully-loaded, proactive Health Personal Health Record (PHR) operating system. It bridges static medical record data with real-time health intelligence.</p>
            <p>By connecting custom database vaults, wearable OAuth sensors, and Gemini AI vision agents, it acts as an intelligent medical assistant and lifestyle coordinator.</p>
            <h4>Core Technical Implementations:</h4>
            <ul>
                <li><strong>AI Medical Scanner & Vault</strong>: Extracts multi-page medical PDF reports (prescriptions, clinical metrics) into clean JSON. Uses vision intelligence to auto-crop X-Rays/MRIs for the patient gallery.</li>
                <li><strong>Wearable integration (Google Fit)</strong>: OAuth 2.0 bridge to fetch Heart Rate, SpO2, Steps, and Sleep logs from smartwatches.</li>
                <li><strong>Safety drug-drug Checker</strong>: Uses AI semantic processing to check newly added prescription lists against active records to flag chemical conflicts.</li>
                <li><strong>AI Diet & Lifestyle Engine</strong>: Custom 7-day meal plans and physical guides calculated from vitals histories. Includes automated text-to-speech audio report readouts.</li>
            </ul>
        `
    }
};

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const projectCards = document.querySelectorAll('.project-card');

    if (!modal || !closeBtn) return;

    // Open Modal
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent opening if clicking on other link buttons directly (if any)
            if (e.target.closest('.project-links')) return;

            const projectId = card.getAttribute('data-project-id');
            const data = PROJECT_DETAILS[projectId];

            if (!data) return;

            // Inject Content
            document.getElementById('modal-project-title').textContent = data.title;
            document.getElementById('modal-project-date').textContent = data.date;
            document.getElementById('modal-project-desc').innerHTML = data.desc;

            // Inject Media Placeholder
            const mediaWrap = document.getElementById('modal-project-media');
            mediaWrap.className = `modal-media-placeholder ${data.imgGrad}`;
            mediaWrap.innerHTML = `<i data-lucide="${data.icon}" class="placeholder-icon"></i>`;

            // Inject Tags
            const tagsContainer = document.getElementById('modal-project-tags');
            tagsContainer.innerHTML = '';
            data.tech.forEach(t => {
                const span = document.createElement('span');
                span.textContent = t;
                tagsContainer.appendChild(span);
            });

            // Set Button Links
            document.getElementById('modal-git-btn').setAttribute('href', data.gitLink);
            document.getElementById('modal-live-btn').setAttribute('href', data.liveLink);

            // Re-render Lucide icons in the modal
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Show Modal & disable body scroll
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    });

    // Close Modal Function
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    closeBtn.addEventListener('click', closeModal);

    // Close on clicking backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & RESPONSIVE FEEDBACK
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = [
        { id: 'form-name', errorId: 'name-error', check: val => val.trim().length > 0 },
        { id: 'form-email', errorId: 'email-error', check: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
        { id: 'form-subject', errorId: 'subject-error', check: val => val.trim().length > 0 },
        { id: 'form-message', errorId: 'message-error', check: val => val.trim().length > 0 }
    ];

    // Realtime error removal on input focus or typing
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group.classList.contains('error') && field.check(input.value)) {
                    group.classList.remove('error');
                }
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let hasErrors = false;

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const group = input.closest('.form-group');
            
            if (!field.check(input.value)) {
                group.classList.add('error');
                hasErrors = true;
            } else {
                group.classList.remove('error');
            }
        });

        if (!hasErrors) {
            const submitBtn = document.getElementById('submit-btn');
            const submitIcon = document.getElementById('submit-icon');
            const originalText = submitBtn.querySelector('span').textContent;
            
            // Set loading visual states
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Sending...';
            if (submitIcon && typeof lucide !== 'undefined') {
                submitIcon.setAttribute('data-lucide', 'loader-2');
                lucide.createIcons();
                submitIcon.classList.add('spin-icon');
            }

            // Simulate server network dispatch
            setTimeout(() => {
                showToast('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = originalText;
                if (submitIcon && typeof lucide !== 'undefined') {
                    submitIcon.setAttribute('data-lucide', 'send');
                    lucide.createIcons();
                    submitIcon.classList.remove('spin-icon');
                }
            }, 1800);
        }
    });
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on notification types
    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    
    toast.innerHTML = `
        <i data-lucide="${iconName}" class="toast-icon"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Auto removal transition
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

/* ==========================================================================
   INTERACTIVE CANVAS BACKGROUND PARTICLES
   ========================================================================== */
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const particleCount = 65; // Balanced performance threshold
    
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Keep size responsive
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse hover trackers
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Object setup
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // Subtle small nodes
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.baseX = this.x;
            this.baseY = this.y;
        }

        update() {
            // Screen boundaries wrap
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }

            this.x += this.speedX;
            this.y += this.speedY;

            // Interactive hover reaction (push away slightly)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = mouse.radius;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * 1.5;
                    const directionY = forceDirectionY * force * 1.5;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }

        draw() {
            // Dynamic color adapting to theme
            const isLightMode = document.body.classList.contains('light-mode');
            ctx.fillStyle = isLightMode ? 'rgba(79, 70, 229, 0.2)' : 'rgba(99, 102, 241, 0.25)';
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize list
    function init() {
        particlesArray = [];
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Connect node links dynamically
    function connect() {
        const maxLinkDist = 110;
        const isLightMode = document.body.classList.contains('light-mode');
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxLinkDist) {
                    // Node transparency drops based on distance
                    const alpha = (1 - dist / maxLinkDist) * 0.08;
                    ctx.strokeStyle = isLightMode 
                        ? `rgba(79, 70, 229, ${alpha})` 
                        : `rgba(20, 184, 166, ${alpha})`;
                    
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Render loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connect();
        requestAnimationFrame(animate);
    }

    init();
    animate();

    // Reinitialize on bounds change to distribute correctly
    window.addEventListener('resize', () => {
        init();
    });
}
