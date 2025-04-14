document.addEventListener('DOMContentLoaded', function() {
    const initSliders = () => {
        const sliders = document.querySelectorAll('.before-after-slider');
        
        sliders.forEach(slider => {
            const handle = slider.querySelector('.slider-handle');
            const beforeImg = slider.querySelector('.before-image');
            let isDragging = false;

            const updateSliderPosition = (x) => {
                const rect = slider.getBoundingClientRect();
                const percent = Math.min(Math.max(0, x - rect.left), rect.width) / rect.width * 100;
                beforeImg.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
                handle.style.left = `${percent}%`;
            };

            const onMouseDown = (e) => {
                isDragging = true;
                updateSliderPosition(e.clientX);
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;
                updateSliderPosition(e.clientX);
            };

            const onMouseUp = () => {
                isDragging = false;
            };

            const onTouchStart = (e) => {
                isDragging = true;
                updateSliderPosition(e.touches[0].clientX);
            };

            const onTouchMove = (e) => {
                if (!isDragging) return;
                updateSliderPosition(e.touches[0].clientX);
            };

            // Mouse events
            handle.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            // Touch events
            handle.addEventListener('touchstart', onTouchStart);
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onMouseUp);

            // Set initial position
            updateSliderPosition(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width / 2);
        });
    };

    // Initialize sliders
    initSliders();

    // Re-initialize when new content is loaded
    const observer = new MutationObserver(() => {
        initSliders();
    });

    observer.observe(document.querySelector('.services-container'), {
        childList: true,
        subtree: true
    });
});
