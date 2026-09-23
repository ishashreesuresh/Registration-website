/* =========================================================
   ARACHNEX '26 — CYBERPUNK SPIDER SYMPOSIUM
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BASIC ELEMENTS
    ===================================================== */

    const canvas = document.getElementById("webCanvas");
    const ctx = canvas.getContext("2d");

    const cursorCore = document.querySelector(".cursor-core");
    const cursorWeb = document.querySelector(".cursor-web");

    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");

    const modal = document.getElementById("eventModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalClose = document.querySelector(".modal-close");
    const modalRegister = document.getElementById("modalRegister");

    const registrationForm = document.getElementById("registrationForm");
    const successMessage = document.getElementById("successMessage");

    /* =====================================================
       DEVICE CHECK
    ===================================================== */

    const isTouchDevice =
        window.matchMedia("(pointer: coarse)").matches;

    /* =====================================================
       CUSTOM CURSOR
    ===================================================== */

    const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        active: false
    };

    const cursor = {
        x: mouse.x,
        y: mouse.y
    };

    if (!isTouchDevice && cursorWeb) {

        /* Create actual mini spider web inside cursor */

        cursorWeb.innerHTML = `
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >

                <!-- Radial web lines -->
                <g
                    fill="none"
                    stroke="rgba(255,45,75,0.85)"
                    stroke-width="0.8"
                >
                    <line x1="50" y1="50" x2="50" y2="2"/>
                    <line x1="50" y1="50" x2="84" y2="16"/>
                    <line x1="50" y1="50" x2="98" y2="50"/>
                    <line x1="50" y1="50" x2="84" y2="84"/>
                    <line x1="50" y1="50" x2="50" y2="98"/>
                    <line x1="50" y1="50" x2="16" y2="84"/>
                    <line x1="50" y1="50" x2="2" y2="50"/>
                    <line x1="50" y1="50" x2="16" y2="16"/>
                </g>

                <!-- Irregular outer web -->
                <polygon
                    points="50,4 83,17 96,50 82,83 50,96 17,82 4,50 18,17"
                    fill="none"
                    stroke="rgba(255,45,75,0.9)"
                    stroke-width="0.8"
                />

                <!-- Middle web -->
                <polygon
                    points="50,18 72,28 82,50 72,72 50,82 28,72 18,50 28,28"
                    fill="none"
                    stroke="rgba(0,174,255,0.8)"
                    stroke-width="0.8"
                />

                <!-- Inner web -->
                <polygon
                    points="50,31 63,37 69,50 63,63 50,69 37,63 31,50 37,37"
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    stroke-width="0.7"
                />

                <!-- Center -->
                <circle
                    cx="50"
                    cy="50"
                    r="2"
                    fill="#ff2d4d"
                />

            </svg>
        `;

        document.addEventListener("mousemove", (event) => {

            mouse.x = event.clientX;
            mouse.y = event.clientY;
            mouse.active = true;

            if (cursorCore) {
                cursorCore.style.left = `${mouse.x}px`;
                cursorCore.style.top = `${mouse.y}px`;
            }
        });

        document.addEventListener("mouseleave", () => {
            mouse.active = false;
        });

        function animateCursor() {

            cursor.x += (mouse.x - cursor.x) * 0.14;
            cursor.y += (mouse.y - cursor.y) * 0.14;

            if (cursorWeb) {
                cursorWeb.style.left = `${cursor.x}px`;
                cursorWeb.style.top = `${cursor.y}px`;

                const rotation =
                    Math.sin(Date.now() * 0.0015) * 3;

                cursorWeb.style.transform =
                    `translate(-50%, -50%) rotate(${rotation}deg)`;
            }

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

    } else {

        /* Hide desktop cursor effects on touch devices */

        if (cursorCore) {
            cursorCore.style.display = "none";
        }

        if (cursorWeb) {
            cursorWeb.style.display = "none";
        }
    }


    /* =====================================================
       CANVAS BACKGROUND
    ===================================================== */

    let particles = [];
    let ripples = [];

    const particleCount =
        window.innerWidth < 768 ? 45 : 85;

    function resizeCanvas() {

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();

    function createParticles() {

        particles = [];

        for (let i = 0; i < particleCount; i++) {

            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,

                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,

                size: Math.random() * 1.6 + 0.5,

                alpha: Math.random() * 0.6 + 0.2
            });
        }
    }

    createParticles();


    /* =====================================================
       DRAW BACKGROUND WEB
    ===================================================== */

    function drawBackgroundWeb() {

        const maxDistance =
            window.innerWidth < 768 ? 110 : 150;

        for (let i = 0; i < particles.length; i++) {

            const p1 = particles[i];

            for (let j = i + 1; j < particles.length; j++) {

                const p2 = particles[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {

                    const opacity =
                        (1 - distance / maxDistance) * 0.28;

                    ctx.beginPath();

                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);

                    ctx.strokeStyle =
                        `rgba(255,45,75,${opacity})`;

                    ctx.lineWidth = 0.6;

                    ctx.stroke();
                }
            }
        }
    }


    /* =====================================================
       DRAW PARTICLES
    ===================================================== */

    function drawParticles() {

        particles.forEach((particle) => {

            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < -20)
                particle.x = window.innerWidth + 20;

            if (particle.x > window.innerWidth + 20)
                particle.x = -20;

            if (particle.y < -20)
                particle.y = window.innerHeight + 20;

            if (particle.y > window.innerHeight + 20)
                particle.y = -20;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(255,45,75,${particle.alpha})`;

            ctx.fill();
        });
    }


    /* =====================================================
       CURSOR WEB ON CANVAS
    ===================================================== */

    function drawCursorWeb() {

        if (isTouchDevice || !mouse.active)
            return;

        const x = mouse.x;
        const y = mouse.y;

        const radius = 65;

        ctx.save();

        ctx.translate(x, y);

        /* radial lines */

        for (let i = 0; i < 8; i++) {

            const angle =
                (Math.PI * 2 / 8) * i;

            const endX =
                Math.cos(angle) * radius;

            const endY =
                Math.sin(angle) * radius;

            ctx.beginPath();

            ctx.moveTo(0, 0);
            ctx.lineTo(endX, endY);

            ctx.strokeStyle =
                "rgba(255,45,75,0.18)";

            ctx.lineWidth = 0.6;

            ctx.stroke();
        }

        /* irregular web rings */

        for (let ring = 1; ring <= 3; ring++) {

            const r = radius * (ring / 3);

            ctx.beginPath();

            for (let i = 0; i <= 8; i++) {

                const angle =
                    (Math.PI * 2 / 8) * i;

                const variation =
                    1 + Math.sin(
                        angle * 3 +
                        performance.now() * 0.001
                    ) * 0.06;

                const px =
                    Math.cos(angle) * r * variation;

                const py =
                    Math.sin(angle) * r * variation;

                if (i === 0)
                    ctx.moveTo(px, py);
                else
                    ctx.lineTo(px, py);
            }

            ctx.closePath();

            ctx.strokeStyle =
                ring === 2
                    ? "rgba(0,174,255,0.16)"
                    : "rgba(255,45,75,0.16)";

            ctx.lineWidth = 0.7;

            ctx.stroke();
        }

        ctx.restore();
    }


    /* =====================================================
       CLICK WEB RIPPLE
    ===================================================== */

    document.addEventListener("click", (event) => {

        if (isTouchDevice)
            return;

        ripples.push({
            x: event.clientX,
            y: event.clientY,
            radius: 5,
            alpha: 0.8
        });
    });


    function drawRipples() {

        ripples.forEach((ripple, index) => {

            ripple.radius += 1.8;
            ripple.alpha -= 0.015;

            if (ripple.alpha <= 0) {
                ripples.splice(index, 1);
                return;
            }

            ctx.save();

            ctx.translate(
                ripple.x,
                ripple.y
            );

            for (let ring = 0; ring < 2; ring++) {

                const radius =
                    ripple.radius - ring * 14;

                if (radius <= 0)
                    continue;

                ctx.beginPath();

                for (let i = 0; i <= 8; i++) {

                    const angle =
                        (Math.PI * 2 / 8) * i;

                    const px =
                        Math.cos(angle) * radius;

                    const py =
                        Math.sin(angle) * radius;

                    if (i === 0)
                        ctx.moveTo(px, py);
                    else
                        ctx.lineTo(px, py);
                }

                ctx.closePath();

                ctx.strokeStyle =
                    ring === 0
                        ? `rgba(255,45,75,${ripple.alpha})`
                        : `rgba(0,174,255,${ripple.alpha * 0.7})`;

                ctx.lineWidth = 0.8;

                ctx.stroke();
            }

            ctx.restore();
        });
    }


    /* =====================================================
       CANVAS ANIMATION LOOP
    ===================================================== */

    function animateCanvas() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        drawBackgroundWeb();
        drawParticles();
        drawCursorWeb();
        drawRipples();

        requestAnimationFrame(animateCanvas);
    }

    animateCanvas();


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener("resize", () => {

        resizeCanvas();
        createParticles();
    });


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (!navbar)
            return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("active");

            menuBtn.classList.toggle("active");
        });

        navLinks.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");
                menuBtn.classList.remove("active");
            });
        });
    }


    /* =====================================================
       SMOOTH NAVIGATION
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#")
                return;

            const target =
                document.querySelector(targetId);

            if (!target)
                return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".section, .event-card, .workshop-card, .timeline-item, .prize-card, .network-node"
        );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(
                            entry.target
                        );
                    }
                });

            },
            {
                threshold: 0.12
            }
        );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* =====================================================
       HERO MOUSE PARALLAX
    ===================================================== */

    const heroOrbit =
        document.querySelector(".hero-web-orbit");

    const heroContent =
        document.querySelector(".hero-content");

    if (!isTouchDevice) {

        document.addEventListener("mousemove", (event) => {

            const x =
                (event.clientX / window.innerWidth - 0.5);

            const y =
                (event.clientY / window.innerHeight - 0.5);

            if (heroOrbit) {

                heroOrbit.style.marginLeft =
                    `${x * 16}px`;

                heroOrbit.style.marginTop =
                    `${y * 16}px`;
            }

            if (heroContent) {

                heroContent.style.transform =
                    `translate(${x * -5}px, ${y * -5}px)`;
            }
        });
    }


    /* =====================================================
       EVENT DATA
    ===================================================== */

    const eventData = {

        "WEB HACK": {
            description:
                "Build a futuristic web experience using modern frontend technologies. Participants will create responsive interfaces with creative interactions and cyber-inspired visuals."
        },

        "CODE CRAWL": {
            description:
                "A fast-paced programming challenge covering logical thinking, algorithms, debugging and problem solving."
        },

        "NEURAL NET": {
            description:
                "Explore artificial intelligence, machine learning concepts and practical AI-powered solutions through an interactive technical challenge."
        },

        "CIRCUIT SPIN": {
            description:
                "An electronics challenge focused on circuits, components, embedded concepts and rapid technical problem solving."
        },

        "PIXEL WEB": {
            description:
                "Design a creative UI/UX experience with strong visual hierarchy, interaction and futuristic interface concepts."
        },

        "CYBER HUNT": {
            description:
                "A cybersecurity-inspired puzzle challenge involving clues, logical reasoning, digital awareness and problem solving."
        }
    };


    /* =====================================================
       EVENT MODAL
    ===================================================== */

    const eventButtons =
        document.querySelectorAll(
            ".event-card button, .event-card .event-btn"
        );

    function openModal(eventName) {

        if (!modal)
            return;

        const data =
            eventData[eventName] || {
                description:
                    "Explore this technical event and demonstrate your skills through an exciting symposium challenge."
            };

        if (modalTitle)
            modalTitle.textContent = eventName;

        if (modalDescription)
            modalDescription.textContent =
                data.description;

        modal.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    function closeModal() {

        if (!modal)
            return;

        modal.classList.remove("active");

        document.body.style.overflow = "";
    }


    eventButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".event-card");

            if (!card)
                return;

            const titleElement =
                card.querySelector(
                    "h3, .event-title"
                );

            if (!titleElement)
                return;

            const eventName =
                titleElement.textContent
                    .trim()
                    .toUpperCase();

            openModal(eventName);
        });
    });


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );
    }


    if (modal) {

        modal.addEventListener(
            "click",
            (event) => {

                if (event.target === modal) {
                    closeModal();
                }
            }
        );
    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeModal();
            }
        }
    );


    /* =====================================================
       MODAL → REGISTRATION
    ===================================================== */

    if (modalRegister) {

        modalRegister.addEventListener(
            "click",
            () => {

                closeModal();

                const registerSection =
                    document.querySelector("#register");

                if (registerSection) {

                    setTimeout(() => {

                        registerSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }, 150);
                }
            }
        );
    }


    /* =====================================================
       REGISTRATION FORM
    ===================================================== */

    if (registrationForm) {

        registrationForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const name =
                    registrationForm.querySelector(
                        '[name="name"]'
                    );

                const email =
                    registrationForm.querySelector(
                        '[name="email"]'
                    );

                const phone =
                    registrationForm.querySelector(
                        '[name="phone"]'
                    );

                const eventSelect =
                    registrationForm.querySelector(
                        '[name="event"]'
                    );


                /* Basic validation */

                if (
                    name &&
                    name.value.trim().length < 2
                ) {

                    alert(
                        "Please enter a valid name."
                    );

                    name.focus();

                    return;
                }


                if (
                    email &&
                    !email.value.includes("@")
                ) {

                    alert(
                        "Please enter a valid email."
                    );

                    email.focus();

                    return;
                }


                if (
                    phone &&
                    phone.value.trim().length < 10
                ) {

                    alert(
                        "Please enter a valid phone number."
                    );

                    phone.focus();

                    return;
                }


                if (
                    eventSelect &&
                    eventSelect.value === ""
                ) {

                    alert(
                        "Please select an event."
                    );

                    eventSelect.focus();

                    return;
                }


                /* Demo success */

                if (successMessage) {

                    successMessage.classList.add(
                        "show"
                    );

                    successMessage.innerHTML = `
                        <strong>REGISTRATION NODE ACTIVATED</strong>
                        <span>
                            Demo registration completed successfully.
                        </span>
                    `;
                } else {

                    alert(
                        "Registration completed successfully!"
                    );
                }


                registrationForm.reset();


                /* Hide success message */

                setTimeout(() => {

                    if (successMessage) {

                        successMessage.classList.remove(
                            "show"
                        );
                    }

                }, 5000);
            }
        );
    }


    /* =====================================================
       EVENT CARD TILT EFFECT
    ===================================================== */

    if (!isTouchDevice) {

        const cards =
            document.querySelectorAll(
                ".event-card, .workshop-card"
            );

        cards.forEach((card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    const centerX =
                        rect.width / 2;

                    const centerY =
                        rect.height / 2;

                    const rotateX =
                        ((y - centerY) /
                            centerY) * -3;

                    const rotateY =
                        ((x - centerX) /
                            centerX) * 3;

                    card.style.transform =
                        `perspective(700px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-6px)`;
                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform = "";
                }
            );
        });
    }


    /* =====================================================
       NETWORK NODE INTERACTION
    ===================================================== */

    const networkNodes =
        document.querySelectorAll(
            ".network-node"
        );

    networkNodes.forEach((node) => {

        node.addEventListener(
            "mouseenter",
            () => {

                node.classList.add(
                    "node-active"
                );
            }
        );

        node.addEventListener(
            "mouseleave",
            () => {

                node.classList.remove(
                    "node-active"
                );
            }
        );
    });


    /* =====================================================
       HERO BUTTON PARTICLE EFFECT
    ===================================================== */

    const heroButtons =
        document.querySelectorAll(
            ".hero-btn"
        );

    heroButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                button.classList.add(
                    "button-pulse"
                );

                setTimeout(() => {

                    button.classList.remove(
                        "button-pulse"
                    );

                }, 450);
            }
        );
    });


    /* =====================================================
       DYNAMIC YEAR
    ===================================================== */

    document.querySelectorAll(
        ".current-year"
    ).forEach((element) => {

        element.textContent =
            new Date().getFullYear();
    });


    /* =====================================================
       PAGE LOADED
    ===================================================== */

    document.body.classList.add(
        "page-loaded"
    );

    console.log(
        "%c ARACHNEX '26 ",
        "color:#ff2d4d;font-size:22px;font-weight:bold;"
    );

    console.log(
        "%c CYBERPUNK SPIDER NETWORK ONLINE ",
        "color:#00aeff;font-size:14px;"
    );

});