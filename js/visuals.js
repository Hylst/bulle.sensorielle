/**
 * Visuals Module - Gestion des animations visuelles
 * Module autonome pour les effets visuels de l'application Bulle Sensorielle
 */

/**
 * Classe pour gérer les animations visuelles
 */
class VisualsManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isAnimating = false;
        this.currentAnimation = null;
        this.particles = [];
        this.settings = {
            particleCount: 50,
            speed: 1,
            size: 2,
            opacity: 0.7,
            color: '#4FC3F7'
        };
        this.init();
    }

    /**
     * Initialise le gestionnaire de visuels
     */
    init() {
        this.setupCanvas();
        this.bindEvents();
    }

    /**
     * Configure le canvas pour les animations
     */
    setupCanvas() {
        this.canvas = document.getElementById('visualCanvas');
        if (!this.canvas) {
            // Créer le canvas s'il n'existe pas
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'visualCanvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                display: none;
                opacity: 0.8;
            `;
            document.body.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Impossible d\'obtenir le contexte 2D du canvas');
            return;
        }
        
        // Définir la taille du canvas
        this.resizeCanvas();
        
        // Redimensionner le canvas lors du redimensionnement de la fenêtre
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Redimensionne le canvas
     */
    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    /**
     * Lie les événements aux boutons visuels
     */
    bindEvents() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupVisualButtons());
        } else {
            this.setupVisualButtons();
        }
        
        // Événements pour navigation par clavier
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Événements pour navigation tactile
        this.setupTouchNavigation();
    }

    /**
     * Configure les boutons visuels
     */
    setupVisualButtons() {
        const visualButtons = document.querySelectorAll('[data-visual]');
        visualButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const visualType = e.currentTarget.getAttribute('data-visual');
                this.toggleVisual(visualType, e.currentTarget);
            });
        });

        // Bouton stop visuel
        const stopVisualButton = document.getElementById('stopVisual');
        if (stopVisualButton) {
            stopVisualButton.addEventListener('click', () => this.stopAnimation());
        }
        
        // Bouton plein écran
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
    }

    /**
     * Active ou désactive un effet visuel
     * @param {string} visualType - Type d'effet visuel
     * @param {HTMLElement} button - Bouton qui a déclenché l'action
     */
    toggleVisual(visualType, button) {
        if (this.isAnimating) {
            this.stopAnimation();
        }

        if (this.currentAnimation !== visualType) {
            this.startAnimation(visualType, button);
        }
    }

    /**
     * Démarre une animation
     * @param {string} type - Type d'animation
     * @param {HTMLElement} button - Bouton associé
     */
    startAnimation(type, button) {
        this.currentAnimation = type;
        this.isAnimating = true;
        this.initializeParticles(type);
        this.animate();
        this.updateVisualButtons(button);
        
        // Afficher le canvas
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
    }

    /**
     * Arrête l'animation actuelle
     */
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.isAnimating = false;
        this.currentAnimation = null;
        this.particles = [];
        this.updateVisualButtons();
        
        // Masquer le canvas
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
    }
    
    /**
     * Bascule le mode plein écran
     */
    toggleFullscreen() {
        const visualDisplay = document.querySelector('.visual-display');
        if (!visualDisplay) return;
        
        if (!document.fullscreenElement) {
            visualDisplay.requestFullscreen().then(() => {
                visualDisplay.classList.add('fullscreen');
                this.createFullscreenExitButton();
                this.resizeCanvas();
            }).catch(err => {
                console.log('Erreur plein écran:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                visualDisplay.classList.remove('fullscreen');
                this.removeFullscreenExitButton();
                this.resizeCanvas();
            });
        }
    }
    
    /**
     * Crée le bouton de sortie du mode plein écran
     */
    createFullscreenExitButton() {
        // Supprimer le bouton existant s'il y en a un
        this.removeFullscreenExitButton();
        
        const exitButton = document.createElement('button');
        exitButton.id = 'fullscreenExitBtn';
        exitButton.innerHTML = '🫧';
        exitButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.5);
            font-size: 24px;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        exitButton.addEventListener('click', () => this.exitFullscreen());
        exitButton.addEventListener('mouseenter', () => {
            exitButton.style.background = 'rgba(255, 255, 255, 0.2)';
            exitButton.style.color = 'rgba(255, 255, 255, 0.8)';
            exitButton.style.transform = 'scale(1.1)';
        });
        exitButton.addEventListener('mouseleave', () => {
            exitButton.style.background = 'rgba(255, 255, 255, 0.1)';
            exitButton.style.color = 'rgba(255, 255, 255, 0.5)';
            exitButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(exitButton);
    }
    
    /**
     * Supprime le bouton de sortie du mode plein écran
     */
    removeFullscreenExitButton() {
        const existingButton = document.getElementById('fullscreenExitBtn');
        if (existingButton) {
            existingButton.remove();
        }
    }
    
    /**
     * Sort du mode plein écran
     */
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    /**
     * Redimensionne le canvas
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        // Utiliser les dimensions de la fenêtre
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Réinitialiser les particules si une animation est en cours
        if (this.isAnimating && this.currentAnimation) {
            this.initializeParticles(this.currentAnimation);
        }
    }

    /**
     * Initialise les particules selon le type d'animation
     * @param {string} type - Type d'animation
     */
    initializeParticles(type) {
        this.particles = [];
        
        switch (type) {
            case 'breathing':
            case 'bubbles':
                this.createBubbles();
                break;
            case 'colors':
                this.createColors();
                break;
            case 'stars':
                this.createStars();
                break;
            case 'mandala':
                this.createMandala();
                break;
            case 'rain':
                this.createRain();
                break;
            case 'snow':
                this.createSnow();
                break;
            case 'fireflies':
                this.createFireflies();
                break;
            default:
                this.createBubbles();
        }
    }

    /**
     * Crée des bulles
     */
    createBubbles() {
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 100,
                radius: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                color: `hsla(${Math.random() * 60 + 180}, 70%, 70%, ${Math.random() * 0.5 + 0.3})`
            });
        }
    }

    /**
     * Crée des étoiles
     */
    createStars() {
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                twinkle: Math.random() * 0.02 + 0.01,
                opacity: Math.random() * 0.8 + 0.2,
                color: `hsla(${Math.random() * 60 + 40}, 80%, 80%, ${Math.random() * 0.8 + 0.2})`
            });
        }
    }

    /**
     * Crée de la pluie
     */
    createRain() {
        for (let i = 0; i < this.settings.particleCount * 2; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 5 + 5,
                opacity: Math.random() * 0.6 + 0.4,
                color: `hsla(200, 70%, 70%, ${Math.random() * 0.6 + 0.4})`
            });
        }
    }

    /**
     * Crée de la neige
     */
    createSnow() {
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                radius: Math.random() * 5 + 2,
                speed: Math.random() * 2 + 1,
                drift: Math.random() * 2 - 1,
                opacity: Math.random() * 0.8 + 0.2,
                color: `hsla(0, 0%, 100%, ${Math.random() * 0.8 + 0.2})`
            });
        }
    }

    /**
     * Crée des lucioles
     */
    createFireflies() {
        for (let i = 0; i < this.settings.particleCount / 2; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                glow: Math.random() * 0.02 + 0.01,
                opacity: Math.random() * 0.8 + 0.2,
                color: `hsla(${Math.random() * 60 + 50}, 80%, 70%, ${Math.random() * 0.8 + 0.2})`
            });
        }
    }

    /**
     * Boucle d'animation principale
     */
    animate() {
        if (!this.isAnimating) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        switch (this.currentAnimation) {
            case 'breathing':
            case 'bubbles':
                this.animateBubbles();
                break;
            case 'colors':
                this.animateColors();
                break;
            case 'stars':
                this.animateStars();
                break;
            case 'mandala':
                this.animateMandala();
                break;
            case 'rain':
                this.animateRain();
                break;
            case 'snow':
                this.animateSnow();
                break;
            case 'fireflies':
                this.animateFireflies();
                break;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Anime les bulles
     */
    animateBubbles() {
        this.particles.forEach((bubble, index) => {
            bubble.y -= bubble.speed;
            
            // Dessiner la bulle
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = bubble.color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Réinitialiser si la bulle sort de l'écran
            if (bubble.y + bubble.radius < 0) {
                bubble.y = this.canvas.height + bubble.radius;
                bubble.x = Math.random() * this.canvas.width;
            }
        });
    }

    /**
     * Anime les étoiles
     */
    animateStars() {
        this.particles.forEach(star => {
            star.opacity += star.twinkle * (Math.random() > 0.5 ? 1 : -1);
            star.opacity = Math.max(0.1, Math.min(1, star.opacity));
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color.replace(/[\d\.]+\)$/g, star.opacity + ')');
            this.ctx.fill();
        });
    }

    /**
     * Anime la pluie
     */
    animateRain() {
        this.particles.forEach(drop => {
            drop.y += drop.speed;
            
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.strokeStyle = drop.color;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            if (drop.y > this.canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        });
    }

    /**
     * Anime la neige
     */
    animateSnow() {
        this.particles.forEach(flake => {
            flake.y += flake.speed;
            flake.x += flake.drift;
            
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = flake.color;
            this.ctx.fill();
            
            if (flake.y > this.canvas.height) {
                flake.y = -flake.radius;
                flake.x = Math.random() * this.canvas.width;
            }
            
            if (flake.x > this.canvas.width) {
                flake.x = 0;
            } else if (flake.x < 0) {
                flake.x = this.canvas.width;
            }
        });
    }

    /**
     * Anime les lucioles
     */
    animateFireflies() {
        this.particles.forEach(firefly => {
            firefly.x += firefly.speedX;
            firefly.y += firefly.speedY;
            firefly.opacity += firefly.glow * (Math.random() > 0.5 ? 1 : -1);
            firefly.opacity = Math.max(0.2, Math.min(1, firefly.opacity));
            
            // Rebondir sur les bords
            if (firefly.x <= 0 || firefly.x >= this.canvas.width) {
                firefly.speedX *= -1;
            }
            if (firefly.y <= 0 || firefly.y >= this.canvas.height) {
                firefly.speedY *= -1;
            }
            
            // Dessiner avec effet de lueur
            this.ctx.beginPath();
            this.ctx.arc(firefly.x, firefly.y, firefly.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = firefly.color.replace(/[\d\.]+\)$/g, firefly.opacity + ')');
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = firefly.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    /**
     * Crée des couleurs flottantes
     */
    createColors() {
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 30 + 10,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                hue: Math.random() * 360,
                opacity: Math.random() * 0.7 + 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    /**
     * Crée une géométrie vivante (mandala)
     */
    createMandala() {
        this.mandalaAngle = 0;
        this.mandalaRadius = Math.min(this.canvas.width, this.canvas.height) / 4;
    }
    
    /**
     * Anime les couleurs flottantes
     */
    animateColors() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.hue += 1;
            particle.opacity += Math.sin(Date.now() * particle.pulseSpeed) * 0.01;
            
            // Rebond sur les bords
            if (particle.x <= particle.radius || particle.x >= this.canvas.width - particle.radius) {
                particle.speedX *= -1;
            }
            if (particle.y <= particle.radius || particle.y >= this.canvas.height - particle.radius) {
                particle.speedY *= -1;
            }
            
            // Dessiner la particule colorée
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue % 360}, 70%, 60%, ${particle.opacity})`;
            this.ctx.fill();
        });
    }
    
    /**
     * Anime la géométrie vivante (mandala)
     */
    animateMandala() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.mandalaAngle += 0.02;
        
        // Dessiner plusieurs couches de formes géométriques
        for (let layer = 0; layer < 3; layer++) {
            const radius = this.mandalaRadius * (0.3 + layer * 0.3);
            const points = 8 + layer * 4;
            
            this.ctx.beginPath();
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2 + this.mandalaAngle * (layer + 1);
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            const hue = (this.mandalaAngle * 50 + layer * 60) % 360;
            this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.6)`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // Ajouter des points lumineux
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + this.mandalaAngle;
            const x = centerX + Math.cos(angle) * this.mandalaRadius * 0.8;
            const y = centerY + Math.sin(angle) * this.mandalaRadius * 0.8;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            const hue = (this.mandalaAngle * 100 + i * 30) % 360;
            this.ctx.fillStyle = `hsla(${hue}, 80%, 70%, 0.8)`;
            this.ctx.fill();
        }
    }

    /**
     * Gère la navigation par clavier
     * @param {KeyboardEvent} e - Événement clavier
     */
    handleKeyNavigation(e) {
        // ESC pour sortir du plein écran
        if (e.key === 'Escape' && document.fullscreenElement) {
            this.exitFullscreen();
            return;
        }
        
        // Navigation par flèches uniquement si un visuel est actif
        if (!this.isAnimating) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.switchToPreviousVisual();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.switchToNextVisual();
        }
    }
    
    /**
     * Configure la navigation tactile
     */
    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        
        const visualDisplay = document.querySelector('.visual-display');
        if (!visualDisplay) return;
        
        visualDisplay.addEventListener('touchstart', (e) => {
            if (!this.isAnimating) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        visualDisplay.addEventListener('touchend', (e) => {
            if (!this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Vérifier que c'est un swipe horizontal (plus horizontal que vertical)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe vers la droite - visuel suivant
                    this.switchToNextVisual();
                } else {
                    // Swipe vers la gauche - visuel précédent
                    this.switchToPreviousVisual();
                }
            }
        }, { passive: true });
    }
    
    /**
     * Passe au visuel précédent
     */
    switchToPreviousVisual() {
        const visualTypes = ['breathing', 'colors', 'stars', 'mandala'];
        const currentIndex = visualTypes.indexOf(this.currentAnimation);
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : visualTypes.length - 1;
        const previousVisual = visualTypes[previousIndex];
        
        const button = document.querySelector(`[data-visual="${previousVisual}"]`);
        if (button) {
            this.toggleVisual(previousVisual, button);
        }
    }
    
    /**
     * Passe au visuel suivant
     */
    switchToNextVisual() {
        const visualTypes = ['breathing', 'colors', 'stars', 'mandala'];
        const currentIndex = visualTypes.indexOf(this.currentAnimation);
        const nextIndex = currentIndex < visualTypes.length - 1 ? currentIndex + 1 : 0;
        const nextVisual = visualTypes[nextIndex];
        
        const button = document.querySelector(`[data-visual="${nextVisual}"]`);
        if (button) {
            this.toggleVisual(nextVisual, button);
        }
    }
    
    /**
     * Met à jour l'état visuel des boutons
     * @param {HTMLElement} activeButton - Bouton actuellement actif
     */
    updateVisualButtons(activeButton = null) {
        const visualButtons = document.querySelectorAll('[data-visual]');
        visualButtons.forEach(button => {
            button.classList.remove('active');
        });

        if (activeButton && this.isAnimating) {
            activeButton.classList.add('active');
        }
    }

    /**
     * Obtient l'état actuel des visuels
     * @returns {Object} État des visuels
     */
    getState() {
        return {
            isAnimating: this.isAnimating,
            currentAnimation: this.currentAnimation,
            particleCount: this.particles.length
        };
    }

    /**
     * Nettoie les ressources visuelles
     */
    cleanup() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Instance globale du gestionnaire de visuels
let visualsManager = null;

// Fonctions globales pour compatibilité
function startVisual(visualType) {
    if (visualsManager) {
        const button = document.querySelector(`[data-visual="${visualType}"]`);
        visualsManager.toggleVisual(visualType, button);
    }
}

function stopVisual() {
    if (visualsManager) {
        visualsManager.stopAnimation();
    }
}

// Initialiser le gestionnaire de visuels quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        visualsManager = new VisualsManager();
    });
} else {
    visualsManager = new VisualsManager();
}

// Nettoyer lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (visualsManager) {
        visualsManager.cleanup();
    }
});

// Exporter pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualsManager };
}