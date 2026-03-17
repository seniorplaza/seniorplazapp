
        if (window.self !== window.top || window.innerWidth <= 800) {
            const toggleBtn = document.getElementById('viewToggle');
            if (toggleBtn) {
                toggleBtn.style.display = 'block';
            }
        }
    
