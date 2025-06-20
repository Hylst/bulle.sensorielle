/**
 * 🫧 Bulle Sensorielle - Application JavaScript Principale
 * 
 * Une application web thérapeutique conçue avec tendresse pour créer un sanctuaire
 * numérique apaisant destiné aux enfants ayant des sensibilités sensorielles.
 * 
 * Cette application offre un environnement sécurisant et personnalisable avec :
 * - Mixeur de sons apaisants (bruits blancs, nature, mélodies douces)
 * - Visuels thérapeutiques interactifs (respiration guidée, couleurs flottantes)
 * - Minuteur de pause sensorielle avec visualisation progressive
 * - Système de profils sensoriels personnalisés
 * - Interface adaptative jour/nuit
 * 
 * @fileoverview Application web progressive pour enfants avec TSA, TDAH et sensibilités sensorielles
 * @version 2.7.4
 * @author Geoffroy Streit <geoffroy.streit@gmail.com>
 * @created 2024
 * @license MIT
 * 
 * @description Développée avec passion et bienveillance pour offrir un espace de calme
 *              et de régulation émotionnelle accessible à tous les enfants.
 * 
 * Technologies utilisées :
 * - JavaScript ES6+ (Vanilla)
 * - Tone.js pour la synthèse audio avancée
 * - Canvas API pour les animations visuelles fluides
 * - LocalStorage pour la persistance des profils
 * - CSS3 avec variables personnalisées pour l'accessibilité
 * 
 * @requires Tone.js
 * @requires Modern browser with ES6+ support
 * @requires Canvas API support
 * @requires Web Audio API support
 */

/**
 * 🌟 Classe principale de l'application Bulle Sensorielle
 * 
 * Cette classe orchestre avec délicatesse tous les aspects de l'expérience sensorielle :
 * la gestion audio thérapeutique, les animations visuelles apaisantes, la persistance
 * des préférences utilisateur, et l'interface adaptative.
 * 
 * @class BulleSensorielle
 * @description Cœur de l'application, conçue pour offrir une expérience utilisateur
 *              fluide et accessible aux enfants avec sensibilités sensorielles
 */
class BulleSensorielle {
    /**
     * 🎭 Constructeur de la classe BulleSensorielle
     * 
     * Initialise avec tendresse tous les composants nécessaires pour créer
     * un environnement numérique sécurisant et personnalisable.
     * 
     * @constructor
     * @description Configure l'état initial de l'application avec des valeurs
     *              par défaut optimisées pour l'accessibilité et le confort
     */
    constructor() {
        // 🏠 Navigation et état de l'interface
        this.currentSection = 'home';
        
        // 🎵 Gestion audio thérapeutique via AudioManager
        this.audioManager = null;             // Instance du gestionnaire audio
        
        // ✨ Système visuel apaisant
        this.currentVisual = 'breathing';     // Visual actuel (respiration par défaut)
        this.visualsPaused = false;          // État de pause des animations
        
        // ⏸️ Contrôle global de l'application
        this.lastClickedIcon = null;         // Dernier élément interagi pour feedback
        
        // 💾 Système de profils sensoriels personnalisés
        this.lastClickedSound = null;        // Dernier son sélectionné
        this.lastClickedVisual = null;       // Dernier visuel sélectionné
        this.lastClickedTimerDuration = null; // Dernière durée de minuteur
        
        // ⏰ Minuteur de pause sensorielle
        this.timer = {
            duration: 0,                     // Durée totale en secondes
            remaining: 0,                    // Temps restant
            interval: null,                  // Référence de l'intervalle
            isRunning: false                 // État de fonctionnement
        };
        
        // 🎨 Personnalisation et persistance
        this.profiles = JSON.parse(localStorage.getItem('sensoryProfiles') || '[]');
        this.theme = localStorage.getItem('theme') || 'light';
        
        // 🚀 Lancement de l'initialisation
        this.init();
    }

    /**
     * 🌅 Initialisation complète de l'application
     * 
     * Cette méthode orchestre avec délicatesse le démarrage de tous les composants
     * de l'application pour créer une expérience utilisateur harmonieuse et accessible.
     * 
     * @async
     * @method init
     * @description Séquence d'initialisation optimisée pour garantir une expérience
     *              fluide dès le premier contact avec l'application
     * 
     * @returns {Promise<void>} Promesse résolue une fois l'initialisation terminée
     * 
     * @example
     * // L'initialisation est automatiquement appelée dans le constructeur
     * const app = new BulleSensorielle(); // init() est exécutée automatiquement
     */
    async init() {
        this.setupTheme();           // 🎨 Configuration du thème visuel
        this.setupEventListeners();  // 👂 Mise en place des interactions
        await this.initializeAudioManager(); // 🎵 Initialisation du gestionnaire audio
        this.setupVisuals();         // ✨ Configuration des animations visuelles
        this.setupInfoBubble();      // ℹ️ Préparation de la bulle d'information
        this.loadProfiles();         // 💾 Chargement des profils sauvegardés
        this.showMascotMessage('Bienvenue dans ta bulle sensorielle !', 3000); // 🌙 Message d'accueil
    }

    /**
     * 🎨 Configuration du système de thèmes
     * 
     * Gère avec tendresse l'alternance entre les modes jour et nuit pour
     * s'adapter aux besoins sensoriels et aux préférences de chaque enfant.
     * 
     * @method setupTheme
     * @description Applique le thème sauvegardé et configure les transitions douces
     *              entre les modes clair et sombre pour le confort visuel
     */
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = e.currentTarget.dataset.action;
                this.navigateToSection(action);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        // Sound buttons are now handled by AudioManager
        // Track last clicked sound for profile saving
        document.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const soundId = btn.getAttribute('data-sound');
                this.lastClickedSound = soundId;
            });
        });
        
        // Visual playing indicators will be handled by AudioManager

        // Volume controls are now handled by AudioManager

        // Visual controls
        document.querySelectorAll('.visual-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const visual = e.currentTarget.dataset.visual;
                
                // Handle fullscreen button separately
                if (btn.id === 'fullscreenBtn') {
                    this.toggleFullscreen();
                    return;
                }
                
                // Track last clicked visual for profile saving
                this.lastClickedVisual = visual;
                
                this.setVisual(visual);
            });
        });
        
        // Handle fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());

        // Timer controls
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const minutes = parseInt(e.currentTarget.dataset.time);
                
                // Track last clicked timer duration for profile saving
                this.lastClickedTimerDuration = minutes;
                
                this.setTimerDuration(minutes);
            });
        });

        document.getElementById('customMinutes').addEventListener('change', (e) => {
            const minutes = parseInt(e.target.value);
            
            // Track last clicked timer duration for profile saving
            this.lastClickedTimerDuration = minutes;
            
            this.setTimerDuration(minutes);
        });

        document.getElementById('startTimer').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.startTimer();
        });

        document.getElementById('pauseTimer').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.pauseTimer();
        });

        document.getElementById('stopTimer').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.stopTimer();
        });

        // Global pause/play button
        document.getElementById('globalPauseBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await this.toggleGlobalPlayPause();
        });

        // App symbol button
        document.getElementById('appSymbolBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.resetAppIcon();
        });

        // Initialize app icon based on theme
        this.updateAppIcon();

        // Profile management
        document.getElementById('saveProfile').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showSaveModal();
        });

        document.getElementById('cancelSave').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideSaveModal();
        });

        document.getElementById('confirmSave').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.saveCurrentProfile();
        });

        // Modal background click
        document.getElementById('saveModal').addEventListener('click', (e) => {
            if (e.target.id === 'saveModal') {
                this.hideSaveModal();
            }
        });
    }

    /**
     * 🎵 Initialise le gestionnaire audio
     * 
     * Crée et configure l'instance AudioManager qui gère tous les aspects
     * audio de l'application de manière modulaire et optimisée.
     * 
     * @method initializeAudioManager
     * @description Remplace l'ancien système audio monolithique par une
     *              architecture modulaire plus maintenable
     * @returns {Promise<void>} Promesse résolue une fois l'AudioManager initialisé
     */
    async initializeAudioManager() {
        try {
            // Créer l'instance du gestionnaire audio
            this.audioManager = new AudioManager();
            
            // Attendre que l'initialisation soit complète
            await this.audioManager.waitForInitialization();
            
            console.log('AudioManager initialized and ready');
        } catch (error) {
            console.error('Error initializing AudioManager:', error);
            // Continuer l'initialisation même si l'audio échoue
        }
    }



    /**
     * Setup visual animations
     */
    setupVisuals() {
        this.canvas = document.getElementById('visualCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.startVisualAnimation();
    }

    /**
     * Resize canvas to fit container responsively
     */
    resizeCanvas() {
        if (!this.canvas || !this.ctx) return;
        
        const container = this.canvas.parentElement;
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        
        // Get device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        
        // Check if we're in fullscreen mode
        const isFullscreen = container.classList.contains('fullscreen');
        
        let containerWidth, containerHeight;
        
        if (isFullscreen) {
            // In fullscreen mode, use full viewport dimensions
            containerWidth = window.innerWidth;
            containerHeight = window.innerHeight;
        } else {
            // In normal mode, use reduced padding for better space utilization
            containerWidth = Math.max(rect.width - 20, 200); // Reduced from 40 to 20
            containerHeight = Math.max(rect.height - 20, 150); // Reduced from 40 to 20
        }
        
        // Maintain aspect ratio while fitting container
        let canvasWidth, canvasHeight;
        
        if (isFullscreen) {
            // In fullscreen mode, use full screen dimensions
            canvasWidth = containerWidth;
            canvasHeight = containerHeight;
        } else {
            // Determine optimal aspect ratio based on screen size
            const isMobile = window.innerWidth <= 480;
            const isTablet = window.innerWidth <= 768 && window.innerWidth > 480;
            
            if (isMobile) {
                // Mobile: Use 16:9 aspect ratio for better immersion
                const aspectRatio = 16 / 9;
                if (containerWidth / containerHeight > aspectRatio) {
                    canvasHeight = containerHeight;
                    canvasWidth = containerHeight * aspectRatio;
                } else {
                    canvasWidth = containerWidth;
                    canvasHeight = containerWidth / aspectRatio;
                }
            } else if (isTablet) {
                // Tablet: Use 16:10 aspect ratio
                const aspectRatio = 16 / 10;
                if (containerWidth / containerHeight > aspectRatio) {
                    canvasHeight = containerHeight;
                    canvasWidth = containerHeight * aspectRatio;
                } else {
                    canvasWidth = containerWidth;
                    canvasHeight = containerWidth / aspectRatio;
                }
            } else {
                // Desktop: Use 4:3 aspect ratio for classic feel
                const aspectRatio = 4 / 3;
                if (containerWidth / containerHeight > aspectRatio) {
                    canvasHeight = Math.min(containerHeight, 600);
                    canvasWidth = canvasHeight * aspectRatio;
                } else {
                    canvasWidth = Math.min(containerWidth, 800);
                    canvasHeight = canvasWidth / aspectRatio;
                }
            }
        }
        
        // Ensure minimum dimensions
        canvasWidth = Math.max(canvasWidth, 200);
        canvasHeight = Math.max(canvasHeight, 150);
        
        // Set canvas display size
        this.canvas.style.width = canvasWidth + 'px';
        this.canvas.style.height = canvasHeight + 'px';
        
        // Set canvas internal resolution for crisp rendering
        this.canvas.width = canvasWidth * dpr;
        this.canvas.height = canvasHeight * dpr;
        
        // Reset and scale context to match device pixel ratio
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.scale(dpr, dpr);
        
        // Store dimensions for animations
        this.canvasDisplayWidth = canvasWidth;
        this.canvasDisplayHeight = canvasHeight;
        
        console.log(`Canvas resized: ${canvasWidth}x${canvasHeight} (display), ${this.canvas.width}x${this.canvas.height} (internal), fullscreen: ${isFullscreen}`);
        
        // If we have an active visual animation, reinitialize it with new dimensions
        if (this.currentVisual && this.isAnimating) {
            this.startVisual(this.currentVisual);
        }
    }

    /**
     * Start visual animation loop
     */
    startVisualAnimation() {
        const animate = () => {
            // Only render if visuals are not paused
            if (!this.visualsPaused) {
                this.renderCurrentVisual();
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    /**
     * Render the current visual
     */
    renderCurrentVisual() {
        // Don't render if visuals are paused or canvas is not ready
        if (this.visualsPaused || !this.canvas || !this.ctx) {
            return;
        }
        
        // Use display dimensions for clearing, fallback to canvas dimensions
        const width = this.canvasDisplayWidth || (this.canvas.width / (window.devicePixelRatio || 1));
        const height = this.canvasDisplayHeight || (this.canvas.height / (window.devicePixelRatio || 1));
        
        // Clear the entire canvas
        this.ctx.clearRect(0, 0, width, height);

        switch (this.currentVisual) {
            case 'breathing':
                this.renderBreathingCircle();
                break;
            case 'colors':
                this.renderFloatingColors();
                break;
            case 'stars':
                this.renderStarRain();
                break;
            case 'mandala':
                this.renderRotatingMandala();
                break;
            default:
                // Render breathing circle as default
                this.renderBreathingCircle();
                break;
        }
    }

    /**
     * Enhanced breathing guidance circle with better synchronization
     */
    renderBreathingCircle() {
        const width = this.canvasDisplayWidth || this.canvas.width;
        const height = this.canvasDisplayHeight || this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const time = Date.now() * 0.001;
        
        // Improved breathing cycle: 4 seconds inhale, 4 seconds exhale
        const breathingPeriod = 8; // Total cycle duration in seconds
        const cyclePosition = (time % breathingPeriod) / breathingPeriod;
        
        let breathCycle, phase, instruction;
        if (cyclePosition < 0.5) {
            // Inhale phase (0 to 0.5)
            breathCycle = cyclePosition * 2; // 0 to 1
            phase = 'inhale';
            instruction = 'Inspire lentement...';
        } else {
            // Exhale phase (0.5 to 1)
            breathCycle = 1 - ((cyclePosition - 0.5) * 2); // 1 to 0
            phase = 'exhale';
            instruction = 'Expire doucement...';
        }
        
        // Smooth easing for more natural breathing
        const easedCycle = 0.5 - 0.5 * Math.cos(breathCycle * Math.PI);
        const radius = 60 + easedCycle * 120;
        
        // Multi-layer gradient for depth
        const outerGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 40);
        outerGradient.addColorStop(0, 'rgba(191, 219, 254, 0.1)');
        outerGradient.addColorStop(0.7, 'rgba(233, 213, 255, 0.05)');
        outerGradient.addColorStop(1, 'rgba(187, 247, 208, 0.02)');
        
        // Outer breathing aura
        this.ctx.fillStyle = outerGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius + 40, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Main breathing circle
        const mainGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        if (phase === 'inhale') {
            mainGradient.addColorStop(0, 'rgba(187, 247, 208, 0.9)');
            mainGradient.addColorStop(0.6, 'rgba(191, 219, 254, 0.6)');
            mainGradient.addColorStop(1, 'rgba(233, 213, 255, 0.2)');
        } else {
            mainGradient.addColorStop(0, 'rgba(233, 213, 255, 0.9)');
            mainGradient.addColorStop(0.6, 'rgba(191, 219, 254, 0.6)');
            mainGradient.addColorStop(1, 'rgba(187, 247, 208, 0.2)');
        }
        
        this.ctx.fillStyle = mainGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner core with pulsing effect
        const coreRadius = 20 + easedCycle * 15;
        const coreGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        this.ctx.fillStyle = coreGradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Enhanced breathing text with timing
        this.ctx.fillStyle = phase === 'inhale' ? '#065f46' : '#7c2d12';
        this.ctx.font = 'bold 28px Nunito';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(instruction, centerX, centerY - 10);
        
        // Breathing timer indicator
        const timeLeft = phase === 'inhale' ? (4 - (cyclePosition * 8)) : ((cyclePosition - 0.5) * 8);
        this.ctx.font = '18px Nunito';
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillText(`${Math.ceil(timeLeft)}s`, centerX, centerY + 25);
    }

    /**
     * Render floating colors
     */
    renderFloatingColors() {
        const width = this.canvasDisplayWidth || this.canvas.width;
        const height = this.canvasDisplayHeight || this.canvas.height;
        const time = Date.now() * 0.0005;

        for (let i = 0; i < 5; i++) {
            const x = (Math.sin(time + i) * 0.3 + 0.5) * width;
            const y = (Math.cos(time * 0.7 + i * 2) * 0.3 + 0.5) * height;
            const radius = 80 + Math.sin(time * 2 + i) * 30;

            const colors = [
                'rgba(191, 219, 254, 0.6)',
                'rgba(233, 213, 255, 0.6)',
                'rgba(187, 247, 208, 0.6)',
                'rgba(254, 215, 170, 0.6)',
                'rgba(252, 231, 243, 0.6)'
            ];

            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, colors[i]);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Enhanced star rain with beautiful gentle falling stars
     */
    renderStarRain() {
        const width = this.canvasDisplayWidth || this.canvas.width;
        const height = this.canvasDisplayHeight || this.canvas.height;
        const time = Date.now() * 0.001;

        // Create beautiful gradient night sky background
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        skyGradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.8)');
        skyGradient.addColorStop(1, 'rgba(51, 65, 85, 0.6)');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, width, height);

        // Initialize stars array if not exists
        if (!this.stars) {
            this.stars = [];
            for (let i = 0; i < 80; i++) {
                this.stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height - height,
                    size: 1 + Math.random() * 3,
                    speed: 0.5 + Math.random() * 1.5,
                    twinkle: Math.random() * Math.PI * 2,
                    color: Math.random() > 0.7 ? 'golden' : 'white'
                });
            }
        }

        // Update and render stars
        this.stars.forEach((star, index) => {
            // Update position
            star.y += star.speed;
            star.x += Math.sin(time * 0.5 + index * 0.1) * 0.2; // Gentle horizontal drift
            
            // Reset star when it goes off screen
            if (star.y > height + 50) {
                star.y = -50;
                star.x = Math.random() * width;
            }
            
            // Twinkling effect
            star.twinkle += 0.02;
            const twinkleIntensity = 0.3 + 0.7 * (Math.sin(star.twinkle) * 0.5 + 0.5);
            
            // Star colors
            let starColor;
            if (star.color === 'golden') {
                starColor = `rgba(255, 215, 0, ${twinkleIntensity})`;
            } else {
                starColor = `rgba(255, 255, 255, ${twinkleIntensity})`;
            }
            
            // Draw star with glow effect
            const glowSize = star.size * 3;
            const glowGradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
            glowGradient.addColorStop(0, starColor);
            glowGradient.addColorStop(0.3, star.color === 'golden' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)');
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            // Draw glow
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw star core
            this.ctx.fillStyle = starColor;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw star sparkle (cross shape)
            if (twinkleIntensity > 0.7) {
                this.ctx.strokeStyle = starColor;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                // Vertical line
                this.ctx.moveTo(star.x, star.y - star.size * 2);
                this.ctx.lineTo(star.x, star.y + star.size * 2);
                // Horizontal line
                this.ctx.moveTo(star.x - star.size * 2, star.y);
                this.ctx.lineTo(star.x + star.size * 2, star.y);
                this.ctx.stroke();
            }
        });
        
        // Add shooting stars occasionally
        if (Math.random() < 0.003) {
            this.createShootingStar(width, height, time);
        }
        
        // Render shooting stars
        if (this.shootingStars) {
            this.shootingStars = this.shootingStars.filter(shootingStar => {
                shootingStar.x += shootingStar.vx;
                shootingStar.y += shootingStar.vy;
                shootingStar.life -= 0.02;
                
                if (shootingStar.life > 0) {
                    // Draw shooting star trail
                    const trailGradient = this.ctx.createLinearGradient(
                        shootingStar.x, shootingStar.y,
                        shootingStar.x - shootingStar.vx * 10, shootingStar.y - shootingStar.vy * 10
                    );
                    trailGradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.life})`);
                    trailGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    
                    this.ctx.strokeStyle = trailGradient;
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(shootingStar.x, shootingStar.y);
                    this.ctx.lineTo(shootingStar.x - shootingStar.vx * 10, shootingStar.y - shootingStar.vy * 10);
                    this.ctx.stroke();
                    
                    return true;
                }
                return false;
            });
        }
    }
    
    /**
     * Create a shooting star effect
     */
    createShootingStar(width, height, time) {
        if (!this.shootingStars) {
            this.shootingStars = [];
        }
        
        this.shootingStars.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.3,
            vx: 2 + Math.random() * 3,
            vy: 1 + Math.random() * 2,
            life: 1.0
        });
    }

    /**
     * Enhanced rotating mandala with hypnotizing patterns
     */
    renderRotatingMandala() {
        const width = this.canvasDisplayWidth || this.canvas.width;
        const height = this.canvasDisplayHeight || this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const time = Date.now() * 0.001;
        const baseRadius = Math.min(width, height) * 0.35;

        // Create deep cosmic background with gradient
        const bgGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
        bgGradient.addColorStop(0, 'rgba(10, 5, 30, 0.95)');
        bgGradient.addColorStop(0.5, 'rgba(20, 10, 50, 0.8)');
        bgGradient.addColorStop(1, 'rgba(5, 0, 20, 0.9)');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, width, height);

        // Save context for transformations
        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        // Multiple rotating layers for depth
        const layers = [
            { petals: 8, speed: 0.3, size: 1.0, hueOffset: 0 },
            { petals: 12, speed: -0.2, size: 0.8, hueOffset: 60 },
            { petals: 16, speed: 0.15, size: 0.6, hueOffset: 120 },
            { petals: 24, speed: -0.1, size: 0.4, hueOffset: 180 }
        ];

        layers.forEach((layer, layerIndex) => {
            this.ctx.save();
            this.ctx.rotate(time * layer.speed);

            // Draw geometric petals
            for (let i = 0; i < layer.petals; i++) {
                const angle = (i / layer.petals) * Math.PI * 2;
                const petalRadius = baseRadius * layer.size;
                const pulseEffect = 0.8 + 0.2 * Math.sin(time * 3 + i * 0.5 + layerIndex);
                const currentRadius = petalRadius * pulseEffect;
                
                this.ctx.save();
                this.ctx.rotate(angle);
                
                // Create complex petal shape
                const hue = (time * 20 + layer.hueOffset + i * (360 / layer.petals)) % 360;
                const saturation = 70 + 20 * Math.sin(time * 2 + i);
                const lightness = 50 + 20 * Math.sin(time * 1.5 + i * 0.3);
                
                // Outer glow
                const glowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
                glowGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`);
                glowGradient.addColorStop(0.7, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`);
                glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                this.ctx.fillStyle = glowGradient;
                this.ctx.beginPath();
                this.ctx.ellipse(currentRadius * 0.3, 0, currentRadius * 0.4, currentRadius * 0.15, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Inner bright core
                const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius * 0.2);
                coreGradient.addColorStop(0, `hsla(${hue}, 90%, 80%, 0.9)`);
                coreGradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.4)`);
                
                this.ctx.fillStyle = coreGradient;
                this.ctx.beginPath();
                this.ctx.ellipse(currentRadius * 0.3, 0, currentRadius * 0.2, currentRadius * 0.08, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Geometric details
                if (layerIndex < 2) {
                    this.ctx.strokeStyle = `hsla(${hue}, 80%, 70%, 0.6)`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(currentRadius * 0.6, 0);
                    this.ctx.stroke();
                    
                    // Small decorative circles
                    for (let j = 1; j <= 3; j++) {
                        const circleRadius = currentRadius * 0.15 * j;
                        const circleSize = 2 + Math.sin(time * 4 + i + j) * 1;
                        this.ctx.fillStyle = `hsla(${hue + j * 30}, 80%, 70%, 0.7)`;
                        this.ctx.beginPath();
                        this.ctx.arc(circleRadius, 0, circleSize, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
                
                this.ctx.restore();
            }
            
            this.ctx.restore();
        });

        // Central sacred geometry
        this.ctx.save();
        this.ctx.rotate(time * 0.1);
        
        // Draw central flower of life pattern
        const centerRadius = baseRadius * 0.15;
        const centerHue = (time * 40) % 360;
        
        // Central circle
        const centralGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, centerRadius);
        centralGradient.addColorStop(0, `hsla(${centerHue}, 90%, 80%, 0.9)`);
        centralGradient.addColorStop(0.5, `hsla(${centerHue}, 70%, 60%, 0.6)`);
        centralGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = centralGradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Surrounding circles in flower of life pattern
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * centerRadius * 0.8;
            const y = Math.sin(angle) * centerRadius * 0.8;
            const pulse = 0.7 + 0.3 * Math.sin(time * 4 + i);
            
            this.ctx.fillStyle = `hsla(${centerHue + i * 60}, 80%, 70%, ${0.6 * pulse})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, centerRadius * 0.4 * pulse, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
        
        // Outer ring with sacred symbols
        this.ctx.save();
        this.ctx.rotate(-time * 0.05);
        
        const outerRingRadius = baseRadius * 1.2;
        for (let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const x = Math.cos(angle) * outerRingRadius;
            const y = Math.sin(angle) * outerRingRadius;
            const size = 1 + Math.sin(time * 3 + i * 0.2) * 0.5;
            const hue = (time * 15 + i * 10) % 360;
            
            this.ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.4)`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
        this.ctx.restore();
    }

    /**
     * Navigate to a specific section
     */
    navigateToSection(sectionId) {
        // Update navigation buttons (only if corresponding nav button exists)
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const navButton = document.querySelector(`[data-section="${sectionId}"]`);
        if (navButton) {
            navButton.classList.add('active');
        }

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentSection = sectionId;

        // Special handling for visuals section to ensure proper canvas initialization
        if (sectionId === 'visuals') {
            // Wait for the section to be visible, then initialize canvas properly
            setTimeout(() => {
                this.initializeVisualsSection();
            }, 100);
        }

        // Show relevant mascot messages
        this.showSectionMessage(sectionId);
    }

    /**
     * Initialize visuals section when it becomes active
     * This ensures the breathing visual displays correctly on first view
     */
    initializeVisualsSection() {
        if (!this.canvas || !this.ctx) {
            console.warn('Canvas not ready for visuals section initialization');
            return;
        }
        
        // Force canvas resize to ensure proper dimensions
        this.resizeCanvas();
        
        // Ensure visuals are not paused
        this.visualsPaused = false;
        
        // Force set the current visual to ensure it's properly initialized
        const currentVisual = this.currentVisual || 'breathing';
        this.setVisual(currentVisual);
        
        console.log('Visuals section initialized successfully');
    }

    /**
     * Show mascot message for specific sections
     */
    showSectionMessage(sectionId) {
        const messages = {
            home: 'Bienvenue dans ton espace de calme !',
            mixer: 'Choisis les sons qui t\'apaisent',
            visuals: 'Regarde ces jolis visuels relaxants',
            timer: 'Prends une pause bien méritée',
            profiles: 'Sauvegarde tes combinaisons préférées',
            tips: 'Voici des conseils pour ton bien-être'
        };

        this.showMascotMessage(messages[sectionId] || 'Explore ton sanctuaire !', 2000);
    }

    /**
     * Show mascot message
     */
    showMascotMessage(message, duration = 3000) {
        const mascotMessage = document.getElementById('mascotMessage');
        mascotMessage.textContent = message;
        mascotMessage.style.opacity = '1';
        mascotMessage.style.transform = 'translateX(0)';

        setTimeout(() => {
            mascotMessage.style.opacity = '0';
            mascotMessage.style.transform = 'translateX(20px)';
        }, duration);
    }

    /**
     * Toggle theme between light and dark
     */
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        
        // Update app icon if no custom icon is set
        this.updateAppIcon();
        
        this.showMascotMessage(`Mode ${this.theme === 'dark' ? 'nuit' : 'jour'} activé !`, 2000);
    }

    /**
     * Toggle sound on/off with enhanced state management
     * Initializes audio context on first interaction for Chrome compatibility
     */
    async toggleSound(soundId) {
        console.log(`Toggling sound: ${soundId}`);
        
        // Initialize audio context on first user interaction
        const audioReady = await this.initializeAudioContext();
        if (!audioReady) {
            console.error('Failed to initialize audio context');
            return;
        }
        
        const soundBtn = document.querySelector(`button[data-sound="${soundId}"]`);
        const soundControl = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        const sound = this.sounds.get(soundId);

        console.log(`Sound button found:`, soundBtn);
        console.log(`Sound control found:`, soundControl);
        console.log(`Sound object found:`, sound);
        console.log(`Sound loaded:`, sound?.loaded);
        console.log(`Sound type:`, sound?.constructor?.name);
        
        // Special debugging for MP3 files
        if (soundId === 'berceuse' || soundId === 'ballade') {
            console.log(`MP3 Debug - ${soundId}:`);
            console.log(`- Sound exists:`, !!sound);
            console.log(`- Sound loaded:`, sound?.loaded);
            console.log(`- Sound state:`, sound?.state);
            console.log(`- Sound buffer:`, sound?.buffer);
            console.log(`- Sound url:`, sound?.url);
        }

        if (!sound || !soundBtn) {
            console.error(`Sound or button not found for: ${soundId}`);
            console.log(`Available sounds:`, Array.from(this.sounds.keys()));
            return;
        }

        // Check if this sound is currently active
        const isCurrentlyActive = this.audioManager ? this.audioManager.activeSounds.has(soundId) : false;
        
        if (isCurrentlyActive) {
            // Stop the current sound
            this.deactivateSound(soundId);
        } else {
            // Stop all sounds first, then start the new one
            this.deactivateAllSounds();
            this.activateSound(soundId);
        }
    }

    /**
     * Solution 2: Dedicated activation/deactivation functions
     * Activate a single sound with visual feedback
     */
    activateSound(soundId) {
        console.log(`Activating sound: ${soundId}`);
        const soundBtn = document.querySelector(`button[data-sound="${soundId}"]`);
        const soundControl = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        
        if (!soundBtn || !soundControl) return;
        
        // Start the sound
        this.startSound(soundId);
        
        // Add visual feedback
        soundBtn.classList.add('active');
        soundControl.classList.add('playing');
        
        // Update global pause/play button to show pause mode when sound starts
        this.updateGlobalPauseButtonState(false); // false = not paused, show pause icon
        
        // Track last clicked icon for app symbol
        const iconElement = soundBtn.querySelector('.sound-icon');
        if (iconElement) {
            this.setLastClickedIcon(iconElement.textContent);
        }
        
        console.log(`Sound ${soundId} activated.`);
    }

    /**
     * Deactivate a single sound
     */
    deactivateSound(soundId) {
        console.log(`Deactivating sound: ${soundId}`);
        const soundBtn = document.querySelector(`button[data-sound="${soundId}"]`);
        const soundControl = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        
        if (!soundBtn || !soundControl) return;
        
        // Stop the sound
        this.stopSound(soundId);
        
        // Remove visual feedback
        soundBtn.classList.remove('active');
        soundControl.classList.remove('playing');
        
        // Hide playing indicator
        const indicator = soundControl.querySelector('.playing-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
        
        // Update global pause/play button based on remaining active sounds
        if (this.audioManager && this.audioManager.activeSounds.size === 0) {
            // No more active sounds, show play mode
            this.updateGlobalPauseButtonState(true); // true = paused/stopped, show play icon
        }
        
        console.log(`Sound ${soundId} deactivated.`);
    }

    /**
     * 🔇 Désactive tous les sons actuellement en cours de lecture
     * 
     * Délègue la gestion à AudioManager et met à jour l'interface utilisateur
     * pour refléter l'arrêt de tous les sons.
     */
    deactivateAllSounds() {
        if (this.audioManager) {
            this.audioManager.stopAllSounds();
        }
        
        console.log('All sounds deactivated via AudioManager');
    }

    /**
     * 🔇 Fonction héritée pour la compatibilité
     * 
     * Appelle deactivateAllSounds pour maintenir la compatibilité
     * avec l'ancien code.
     */
    stopAllSounds() {
        this.deactivateAllSounds();
    }

    /**
     * Stop all visual animations
     */
    stopAllVisuals() {
        // Stop visual animation by setting a flag
        this.visualsPaused = true;
        
        // Clear canvas if it exists
        if (this.canvas && this.ctx) {
            const width = this.canvasDisplayWidth || (this.canvas.width / (window.devicePixelRatio || 1));
            const height = this.canvasDisplayHeight || (this.canvas.height / (window.devicePixelRatio || 1));
            this.ctx.clearRect(0, 0, width, height);
        }
        
        // Reset visual controls
        document.querySelectorAll('.visual-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        console.log('All visuals stopped');
    }

    /**
     * Toggle fullscreen mode for visual display
     */
    toggleFullscreen() {
        const visualDisplay = document.querySelector('.visual-display');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && !document.msFullscreenElement) {
            // Enter fullscreen
            if (visualDisplay.requestFullscreen) {
                visualDisplay.requestFullscreen();
            } else if (visualDisplay.webkitRequestFullscreen) {
                visualDisplay.webkitRequestFullscreen();
            } else if (visualDisplay.mozRequestFullScreen) {
                visualDisplay.mozRequestFullScreen();
            } else if (visualDisplay.msRequestFullscreen) {
                visualDisplay.msRequestFullscreen();
            }
            
            visualDisplay.classList.add('fullscreen');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<span class="visual-icon">⛶</span><span>Quitter</span>';
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        
        // Resize canvas after fullscreen change
        setTimeout(() => this.resizeCanvas(), 100);
    }

    /**
     * Handle fullscreen change events
     */
    handleFullscreenChange() {
        const visualDisplay = document.querySelector('.visual-display');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && !document.msFullscreenElement) {
            // Exited fullscreen
            visualDisplay.classList.remove('fullscreen');
            if (fullscreenBtn) {
                fullscreenBtn.innerHTML = '<span class="visual-icon">⛶</span><span>Plein écran</span>';
            }
        }
        
        // Resize canvas after fullscreen change
        setTimeout(() => this.resizeCanvas(), 100);
    }

    /**
     * Enhanced toggle global pause/play with improved state management
     */
    async toggleGlobalPlayPause() {
        if (!this.audioManager) return;
        
        this.audioManager.globalPaused = !this.audioManager.globalPaused;
        
        const pauseBtn = document.getElementById('globalPauseBtn');
        const pauseIcon = pauseBtn.querySelector('.pause-icon');
        
        if (this.audioManager.globalPaused) {
            // Pause all sounds with enhanced methods
            this.pauseAllSounds();
            // Pause visuals
            this.visualsPaused = true;
            
            pauseIcon.textContent = '▶️';
            pauseBtn.setAttribute('title', 'Reprendre la lecture');
            this.showMascotMessage('⏸️ Pause globale - Sons et visuels en pause', 2000);
            console.log('Global pause activated with enhanced methods');
        } else {
            // Resume all sounds with enhanced methods
            await this.resumeAllSounds();
            // Resume visuals
            this.visualsPaused = false;
            
            pauseIcon.textContent = '⏸️';
            pauseBtn.setAttribute('title', 'Mettre en pause');
            this.showMascotMessage('▶️ Lecture reprise - Sons relancés', 2000);
            console.log('Global play resumed with enhanced methods');
        }
        
        // Add visual feedback animation
        if (pauseBtn) {
            pauseBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                pauseBtn.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Update last clicked icon for app symbol
        this.setLastClickedIcon(this.audioManager.globalPaused ? '▶️' : '⏸️');
    }

    /**
     * ⏸️ Met en pause tous les sons actuellement en cours de lecture
     * 
     * Délègue la gestion à AudioManager pour une pause unifiée
     * de tous les sons actifs.
     */
    pauseAllSounds() {
        if (this.audioManager) {
            this.audioManager.pauseAllSounds();
        }
    }

    /**
     * ▶️ Reprend tous les sons mis en pause
     * 
     * Délègue la gestion à AudioManager pour une reprise unifiée
     * de tous les sons en pause.
     */
    async resumeAllSounds() {
        if (this.audioManager) {
            await this.audioManager.resumeAllSounds();
        }
    }

    /**
     * Force reset all sound states (emergency fix)
     */
    resetAllSoundStates() {
        console.log('Resetting all sound states...');
        if (this.audioManager) {
            this.audioManager.resetAllSoundStates();
        }
        
        // Update UI
        const pauseBtn = document.getElementById('globalPauseBtn');
        if (pauseBtn) {
            const pauseIcon = pauseBtn.querySelector('.pause-icon');
            if (pauseIcon) {
                pauseIcon.textContent = '⏸️';
            }
        }
        
        this.showMascotMessage('🔄 États des sons réinitialisés', 2000);
    }

    /**
     * Update global pause/play button state based on sound activity
     */
    updateGlobalPauseButtonState(shouldShowPlay) {
        const pauseBtn = document.getElementById('globalPauseBtn');
        if (!pauseBtn) return;
        
        const pauseIcon = pauseBtn.querySelector('.pause-icon');
        if (!pauseIcon) return;
        
        if (shouldShowPlay) {
            // Show play icon (▶️) when no sounds are playing or all are paused
            pauseIcon.textContent = '▶️';
            pauseBtn.setAttribute('title', 'Reprendre la lecture');
            if (this.audioManager) {
                this.audioManager.globalPaused = true;
            }
        } else {
            // Show pause icon (⏸️) when sounds are playing
            pauseIcon.textContent = '⏸️';
            pauseBtn.setAttribute('title', 'Mettre en pause');
            if (this.audioManager) {
                this.audioManager.globalPaused = false;
            }
        }
        
        // Update last clicked icon for app symbol
        this.setLastClickedIcon(pauseIcon.textContent);
        
        console.log(`Global pause button updated: ${shouldShowPlay ? 'Play mode' : 'Pause mode'}`);
    }

    /**
     * Update app icon based on current theme
     */
    updateAppIcon() {
        const appIcon = document.getElementById('appIcon');
        if (this.lastClickedIcon) {
            appIcon.textContent = this.lastClickedIcon;
        } else {
            // Show day/night icon based on current theme
            const isDark = document.body.classList.contains('dark-theme');
            appIcon.textContent = isDark ? '🌙' : '☀️';
        }
    }

    /**
     * Reset app icon to theme-based default
     */
    resetAppIcon() {
        this.lastClickedIcon = null;
        this.updateAppIcon();
        this.showMascotMessage('Icône réinitialisée', 1500);
    }

    /**
     * Set last clicked icon
     */
    setLastClickedIcon(icon) {
        this.lastClickedIcon = icon;
        this.updateAppIcon();
    }

    /**
     * Add visual playing indicators to sound controls
     */
    addPlayingIndicators() {
        document.querySelectorAll('.sound-control').forEach(control => {
            const soundId = control.getAttribute('data-sound');
            if (!control.querySelector('.playing-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'playing-indicator';
                indicator.innerHTML = '♪ En cours de lecture';
                indicator.style.cssText = `
                    display: none;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(34, 197, 94, 0.9);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    z-index: 10;
                `;
                control.style.position = 'relative';
                control.appendChild(indicator);
            }
        });
    }

    /**
     * 🔊 Démarre un son spécifique via AudioManager
     * 
     * Délègue la gestion du démarrage du son à AudioManager
     * qui gère tous les types audio de manière unifiée.
     * 
     * @param {string} soundId - Identifiant du son à démarrer
     * @returns {boolean} true si le son a été démarré avec succès
     */
    startSound(soundId) {
        if (this.audioManager) {
            return this.audioManager.startSound(soundId);
        }
        console.error('AudioManager not initialized');
        return false;
    }

    /**
     * 🔇 Arrête un son spécifique via AudioManager
     * 
     * Délègue la gestion de l'arrêt du son à AudioManager
     * qui gère tous les types audio de manière unifiée.
     * 
     * @param {string} soundId - Identifiant du son à arrêter
     * @returns {boolean} true si le son a été arrêté avec succès
     */
    stopSound(soundId) {
        if (this.audioManager) {
            return this.audioManager.stopSound(soundId);
        }
        console.error('AudioManager not initialized');
        return false;
    }

    /**
     * Start icon animation for a specific sound
     * Adds visual feedback when sound is playing
     */
    startIconAnimation(soundId) {
        const soundControl = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        if (soundControl) {
            // Add playing class to trigger CSS animations
            soundControl.classList.add('playing');
            console.log(`Animation started for sound: ${soundId}`);
        }
    }

    /**
     * Stop icon animation for a specific sound
     * Removes visual feedback when sound stops
     */
    stopIconAnimation(soundId) {
        const soundControl = document.querySelector(`.sound-control[data-sound="${soundId}"]`);
        if (soundControl) {
            // Remove playing class to stop CSS animations
            soundControl.classList.remove('playing');
            console.log(`Animation stopped for sound: ${soundId}`);
        }
    }

    /**
     * 🫧 Joue le son de bulle pour le feedback UI
     * 
     * Délègue la lecture du son de bulle à AudioManager
     * pour un feedback sonore cohérent dans l'interface.
     */
    async playBubbleSound() {
        if (this.audioManager) {
            await this.audioManager.playBubbleSound();
        } else {
            console.error('AudioManager not initialized');
        }
    }

    /**
     * 🔊 Définit le volume pour un son spécifique
     * 
     * Délègue la gestion du volume à AudioManager qui gère
     * tous les types audio de manière unifiée.
     * 
     * @param {string} soundId - Identifiant du son
     * @param {number} volume - Volume de 0 à 100
     */
    setVolume(soundId, volume) {
        if (this.audioManager) {
            this.audioManager.setVolume(soundId, volume);
        } else {
            console.error('AudioManager not initialized');
        }
    }

    /**
     * Set current visual
     */
    setVisual(visualId) {
        // Remove active class from all visual buttons
        document.querySelectorAll('.visual-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-visual="${visualId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            
            // Track last clicked icon for app symbol
            const iconElement = activeBtn.querySelector('.visual-icon');
            if (iconElement) {
                this.setLastClickedIcon(iconElement.textContent);
            }
            
            // Set the current visual and ensure visuals are not paused
            this.currentVisual = visualId;
            this.visualsPaused = false;
            
            // Force a canvas resize to ensure proper display
            this.resizeCanvas();
            
            this.showMascotMessage(`Visuel ${visualId} activé !`, 1500);
            console.log(`Visual changed to: ${visualId}`);
        } else {
            console.warn(`Visual button not found for: ${visualId}`);
            this.showMascotMessage(`Visuel ${visualId} introuvable`, 1500);
        }
    }

    /**
     * Timer methods - delegated to TimerManager
     */
    setTimerDuration(minutes) {
        if (window.timerManager) {
            window.timerManager.setTime(minutes);
        }
    }

    startTimer() {
        if (window.timerManager) {
            window.timerManager.start();
            this.showMascotMessage('Minuteur démarré ! Profite de ta pause.', 2000);
        }
    }

    pauseTimer() {
        if (window.timerManager) {
            window.timerManager.pause();
            this.showMascotMessage('Minuteur en pause.', 1500);
        }
    }

    stopTimer() {
        if (window.timerManager) {
            window.timerManager.stop();
            this.showMascotMessage('Minuteur arrêté.', 1500);
        }
    }

    /**
     * Profile methods - delegated to ProfilesManager
     */
    showSaveModal() {
        if (window.profilesManager) {
            window.profilesManager.showSaveModal();
        }
    }

    hideSaveModal() {
        if (window.profilesManager) {
            window.profilesManager.hideSaveModal();
        }
    }

    saveCurrentProfile() {
        if (window.profilesManager) {
            window.profilesManager.saveCurrentProfile();
        }
    }

    loadProfiles() {
        // This method is now handled by ProfilesManager
        // Keep for backward compatibility but delegate to the module
        if (window.profilesManager) {
            const profiles = window.profilesManager.getAllProfiles();
            this.displayProfiles(profiles);
        }
    }

    displayProfiles(profiles) {
        const profilesList = document.getElementById('profilesList');
        const profilesGrid = document.getElementById('profilesGrid');
        
        if (profilesList) profilesList.innerHTML = '';
        if (profilesGrid) profilesGrid.innerHTML = '';

        if (profiles.length === 0) {
            if (profilesList) profilesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucune bulle sauvegardée pour le moment.</p>';
            if (profilesGrid) profilesGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucune bulle sauvegardée</p>';
            return;
        }

        profiles.forEach((profile, index) => {
            const homeCard = this.createProfileCard(profile, index, 'home');
            const profilesCard = this.createProfileCard(profile, index, 'profiles');
            
            if (profilesGrid) profilesGrid.appendChild(homeCard);
            if (profilesList) profilesList.appendChild(profilesCard);
        });
    }

    createProfileCard(profile, index, location = 'profiles') {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.setAttribute('data-profile-index', index);
        card.setAttribute('data-location', location);
        
        // Handle both old and new profile formats for backward compatibility
        const soundInfo = profile.sound ? `${profile.sound}` : (profile.sounds && profile.sounds.length > 0 ? profile.sounds.join(', ') : 'Aucun');
        const visualInfo = profile.visual || 'Aucun';
        const timerInfo = profile.timerDuration ? `${profile.timerDuration} min` : 'Aucun';
        
        card.innerHTML = `
            <div class="profile-name">${profile.name}</div>
            <div class="profile-details">
                <p><strong>Son:</strong> ${soundInfo}</p>
                <p><strong>Visuel:</strong> ${visualInfo}</p>
                <p><strong>Minuteur:</strong> ${timerInfo}</p>
                <p><strong>Créé le:</strong> ${profile.created}</p>
            </div>
            <div class="profile-actions-buttons">
                <button type="button" class="profile-btn load" data-index="${index}">Charger</button>
                <button type="button" class="profile-btn delete" data-index="${index}">Supprimer</button>
            </div>
        `;

        // Add event listeners
        card.querySelector('.load').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const loadBtn = e.target;
            const originalText = loadBtn.textContent;
            loadBtn.textContent = 'Chargement...';
            loadBtn.disabled = true;
            loadBtn.classList.add('loading');
            
            try {
                if (window.profilesManager) {
                    window.profilesManager.loadProfile(index);
                }
                
                setTimeout(() => {
                    if (loadBtn && loadBtn.parentNode) {
                        loadBtn.textContent = originalText;
                        loadBtn.disabled = false;
                        loadBtn.classList.remove('loading');
                    }
                }, 1500);
            } catch (error) {
                console.error('Error loading profile:', error);
                loadBtn.textContent = originalText;
                loadBtn.disabled = false;
                loadBtn.classList.remove('loading');
                this.showMascotMessage('Erreur lors du chargement de la bulle', 2000);
            }
        });

        card.querySelector('.delete').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const deleteBtn = e.target;
            const originalText = deleteBtn.textContent;
            deleteBtn.textContent = 'Suppression...';
            deleteBtn.disabled = true;
            deleteBtn.classList.add('deleting');
            
            setTimeout(() => {
                if (window.profilesManager) {
                    window.profilesManager.deleteProfile(index);
                    // Refresh the display after deletion
                    this.loadProfiles();
                }
            }, 300);
        });

        return card;
    }

    // Profile methods are now handled by ProfilesManager module
    // These methods are kept for backward compatibility but delegate to ProfilesManager
    
    loadProfile(profileId) {
        // Deprecated: Use ProfilesManager instead
        console.warn('loadProfile is deprecated. Use ProfilesManager.loadProfile instead.');
        if (window.profilesManager) {
            // Convert ID to index for ProfilesManager compatibility
            const profiles = window.profilesManager.getAllProfiles();
            const index = profiles.findIndex(p => p.id === profileId);
            if (index !== -1) {
                window.profilesManager.loadProfile(index);
            }
        }
    }

    deleteProfile(profileId) {
        // Deprecated: Use ProfilesManager instead
        console.warn('deleteProfile is deprecated. Use ProfilesManager.deleteProfile instead.');
        if (window.profilesManager) {
            // Convert ID to index for ProfilesManager compatibility
            const profiles = window.profilesManager.getAllProfiles();
            const index = profiles.findIndex(p => p.id === profileId);
            if (index !== -1) {
                window.profilesManager.deleteProfile(index);
                this.loadProfiles(); // Refresh display
            }
        }
    }

     /**
      * Setup info bubble functionality
      */
     setupInfoBubble() {
         const infoBubble = document.getElementById('infoBubble');
         const infoModal = document.getElementById('infoModal');
         const infoModalClose = document.getElementById('infoModalClose');

         // Open modal
         infoBubble.addEventListener('click', () => {
             infoModal.classList.add('show');
             this.createFloatingBubbles();
             this.showMascotMessage('Découvre tout sur ton sanctuaire numérique !', 2000);
         });

         // Close modal
         const closeModal = () => {
             infoModal.classList.remove('show');
         };

         infoModalClose.addEventListener('click', closeModal);
         
         // Close on backdrop click
         infoModal.addEventListener('click', (e) => {
             if (e.target === infoModal) {
                 closeModal();
             }
         });

         // Close on Escape key
         document.addEventListener('keydown', (e) => {
             if (e.key === 'Escape' && infoModal.classList.contains('show')) {
                 closeModal();
             }
         });
     }

     /**
      * Create floating bubbles animation in the modal
      */
     createFloatingBubbles() {
         const bubblesContainer = document.querySelector('.floating-bubbles');
         
         // Clear existing bubbles
         bubblesContainer.innerHTML = '';
         
         // Create multiple animated bubbles
         for (let i = 0; i < 8; i++) {
             const bubble = document.createElement('div');
             bubble.className = 'animated-bubble';
             
             // Random size and position
             const size = Math.random() * 40 + 20;
             bubble.style.width = size + 'px';
             bubble.style.height = size + 'px';
             bubble.style.left = Math.random() * 90 + '%';
             bubble.style.top = Math.random() * 90 + '%';
             bubble.style.animationDelay = Math.random() * 6 + 's';
             bubble.style.animationDuration = (Math.random() * 4 + 4) + 's';
             
             bubblesContainer.appendChild(bubble);
         }
     }
 }

// Code dupliqué supprimé - la logique des émotions est maintenant gérée par feelings.js

// Fonctions supprimées - maintenant gérées par feelings.js

// Global variable to store the app instance
let appInstance = null;

// Global function for section navigation (used by onclick events)
function showSection(sectionId) {
    if (appInstance) {
        appInstance.navigateToSection(sectionId);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🫧 Initialisation de Bulle Sensorielle...');
    console.log('Current URL:', window.location.href);
    console.log('Base URL for audio files:', window.location.origin + window.location.pathname.replace('index.html', ''));
    
    try {
        appInstance = new BulleSensorielle();
        
        // Wait for the app to be fully initialized before exposing globally
        await new Promise(resolve => {
            const checkInitialization = () => {
                if (appInstance && appInstance.audioManager) {
                    // Expose audioManager globally for debugging only after it's ready
                    window.audioManager = appInstance.audioManager;
                    window.appInstance = appInstance;
                    console.log('✅ AudioManager exposed globally for debugging');
                    resolve();
                } else {
                    setTimeout(checkInitialization, 100);
                }
            };
            checkInitialization();
        });
        
        // Test automatique après 3 secondes
        setTimeout(() => {
            console.log('🔧 Running automatic audio test...');
            if (window.audioManager && typeof window.audioManager.testAudioLoading === 'function') {
                window.audioManager.testAudioLoading();
            } else {
                console.error('AudioManager not available or testAudioLoading method missing');
            }
        }, 3000);
        
    } catch (error) {
        console.error('❌ Error during application initialization:', error);
    }
});