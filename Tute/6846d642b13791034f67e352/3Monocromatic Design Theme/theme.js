document.addEventListener('DOMContentLoaded', () => {
    // Color psychology mapping
    const hueNames = {
        '0-20': 'Red',
        '21-40': 'Orange',
        '41-60': 'Yellow',
        '61-140': 'Green',
        '141-220': 'Blue',
        '221-280': 'Purple',
        '281-340': 'Magenta',
        '341-360': 'Red'
    };

    // Generate initial palette
    let currentHue = Math.floor(Math.random() * 360);
    updatePalette(currentHue);

    // Palette controls
    document.getElementById('new-palette').addEventListener('click', () => {
        currentHue = Math.floor(Math.random() * 360);
        animateColorChange();
        updatePalette(currentHue);
    });

    document.getElementById('random-palette').addEventListener('click', () => {
        currentHue = Math.floor(Math.random() * 360);
        animateColorChange();
        updatePalette(currentHue);
    });

    document.getElementById('warm-palette').addEventListener('click', () => {
        currentHue = Math.floor(Math.random() * 60); // Reds, oranges, yellows
        animateColorChange();
        updatePalette(currentHue);
    });

    document.getElementById('cool-palette').addEventListener('click', () => {
        currentHue = 140 + Math.floor(Math.random() * 140); // Greens, blues
        animateColorChange();
        updatePalette(currentHue);
    });

    document.getElementById('info-toggle').addEventListener('click', () => {
        const infoText = "This interactive demo showcases:\n\n" +
            "1. Monochromatic color theory\n" +
            "2. Visual hierarchy principles\n" +
            "3. Practical UI applications\n" +
            "4. Dynamic palette generation\n\n" +
            "Use the buttons to explore different color schemes!";

        // Create a custom alert-like element
        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';
        alertBox.innerHTML = `
        <div class="alert-content">
            <h3><i class="fas fa-info-circle"></i> Design Principles</h3>
            <p>${infoText.replace(/\n/g, '<br>')}</p>
            <button class="btn alert-close">OK</button>
        </div>
    `;
        document.body.appendChild(alertBox);



        // Close button functionality
        const closeBtn = alertBox.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            alertBox.classList.add('fade-out');
            setTimeout(() => {
                alertBox.remove();
            }, 300);
        });

        // Close when clicking outside content
        alertBox.addEventListener('click', (e) => {
            if (e.target === alertBox) {
                closeBtn.click();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', function handleEscape(e) {
            if (e.key === 'Escape') {
                closeBtn.click();
                document.removeEventListener('keydown', handleEscape);
            }
        });
    });

    // Update all palette-related elements with random lightness variations
    function updatePalette(hue) {
        // Generate random lightness values within appropriate ranges
        const darkLightness = 30 + Math.random() * 10; // 30-40%
        const primaryLightness = 45 + Math.random() * 10; // 45-55%
        const light1Lightness = 65 + Math.random() * 10; // 65-75%
        const light2Lightness = 85 + Math.random() * 10; // 85-95%

        // Random saturation between 60-80% for vibrancy
        const saturation = 60 + Math.random() * 20;

        const css = `
            :root {
                --dark: hsl(${hue}, ${saturation}%, ${darkLightness}%);
                --primary: hsl(${hue}, ${saturation}%, ${primaryLightness}%);
                --light1: hsl(${hue}, ${saturation}%, ${light1Lightness}%);
                --light2: hsl(${hue}, ${saturation}%, ${light2Lightness}%);
            }
        `;

        // Create or update style element
        let styleElement = document.getElementById('dynamic-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dynamic-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.innerHTML = css;

        // Update hue display
        document.getElementById('hue-value').textContent = `${hue}°`;

        // Update hue name
        let hueName = 'Blue';
        for (const range in hueNames) {
            const [min, max] = range.split('-').map(Number);
            if (hue >= min && hue <= max) {
                hueName = hueNames[range];
                break;
            }
        }
        document.getElementById('hue-name').textContent = hueName;

        // Add animation class to elements that should react to color change
        const elementsToAnimate = document.querySelectorAll('.hue-name, .btn, nav a, .design-principle, .swatch-item');
        elementsToAnimate.forEach(el => {
            el.classList.add('color-change');
            setTimeout(() => {
                el.classList.remove('color-change');
            }, 600);
        });
    }

    // Animation for palette change
    function animateColorChange() {
        const transitionElement = document.querySelector('.color-transition');
        transitionElement.style.opacity = '0.3';
        transitionElement.style.backgroundColor = `hsl(${currentHue}, 70%, 50%)`;

        setTimeout(() => {
            transitionElement.style.opacity = '0';
        }, 600);

        // Add bounce animation to palette button
        const paletteBtn = document.getElementById('new-palette');
        paletteBtn.classList.add('bounce');
        setTimeout(() => {
            paletteBtn.classList.remove('bounce');
        }, 1000);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
        section.classList.add('fade-in');
    });
});