
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isSmallScreen = Math.max(window.innerWidth || 0, window.innerHeight || 0) < 900;
        const cpuCount = Number(navigator.hardwareConcurrency || 0);
        const memGb = Number(navigator.deviceMemory || 0);
        const userAgent = String(navigator.userAgent || '');
        const isAndroidWebView = /Android/i.test(userAgent) && /; wv\)|Version\/[\d.]+\s+Chrome\/[\d.]+\s+Mobile/i.test(userAgent);

        if (prefersReducedMotion) {
            canvas.style.display = 'none';
            return;
        }

        const lowTier = isAndroidWebView || isSmallScreen || (cpuCount > 0 && cpuCount <= 4) || (memGb > 0 && memGb <= 4);
        const particleCount = lowTier ? 28 : 72;
        const targetFps = lowTier ? 18 : 30;
        const frameInterval = 1000 / targetFps;

        let particles = [];
        let rafId = 0;
        let lastFrameTs = 0;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.init();
            }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * (lowTier ? 1.6 : 2.2) + 0.5;
                this.speedX = Math.random() * (lowTier ? 0.26 : 0.4) - (lowTier ? 0.13 : 0.2);
                this.speedY = Math.random() * (lowTier ? 0.26 : 0.4) - (lowTier ? 0.13 : 0.2);
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate(ts) {
            if (document.hidden) {
                rafId = 0;
                return;
            }

            if (ts - lastFrameTs < frameInterval) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            lastFrameTs = ts;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            rafId = requestAnimationFrame(animate);
        }

        function startAnimation() {
            if (!rafId) {
                rafId = requestAnimationFrame(animate);
            }
        }

        function stopAnimation() {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }

        window.addEventListener('resize', function () {
            resize();
            initParticles();
        }, { passive: true });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });

        resize();
        initParticles();
        startAnimation();
    
