/**
 * Navigation Module - Gestion de la navigation et des sections
 * Module autonome pour la navigation de l'application Bulle Sensorielle
 */

/**
 * Classe pour gérer la navigation entre les sections
 */
class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'mixer', 'visuals', 'timer', 'profiles', 'tips', 'feelings'];
        this.setupTheme();
        this.mascotMessages = {
            home: "Bienvenue dans ta bulle sensorielle ! 🫧",
            mixer: "Choisis des sons qui t'apaisent 🎵",
            visuals: "Regarde ces beaux effets visuels ✨",
            timer: "Prends une pause bien méritée ⏰",
            profiles: "Sauvegarde ta bulle personnalisée 💾",
            tips: "Voici des conseils pour te sentir mieux 💡",
            feelings: "Comment te sens-tu aujourd'hui ? 😊"
        };
        this.init();
    }

    /**
     * Initialise le gestionnaire de navigation
     */
    init() {
        this.bindEvents();
        this.initializeCurrentSection();
    }

    /**
     * Lie les événements de navigation
     */
    bindEvents() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }

    /**
     * Configure la navigation
     */
    setupNavigation() {
        // Boutons de navigation principaux
        const navButtons = document.querySelectorAll('[data-section]');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = e.currentTarget.getAttribute('data-section');
                this.navigateToSection(sectionId);
            });
        });

        // Boutons de retour
        const backButtons = document.querySelectorAll('.back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.goBack();
            });
        });

        // Gestion du clavier
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Configuration du thème
        this.setupThemeToggle();
        
        // Configuration des bulles d'interface
        this.setupCornerBubbles();
    }
    
    /**
     * Configure le thème par défaut
     */
    setupTheme() {
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    /**
     * Configure le bouton de basculement de thème
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }
    
    /**
     * Bascule entre les thèmes clair et sombre
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
        
        this.showMascotMessage(`Mode ${newTheme === 'dark' ? 'nuit' : 'jour'} activé !`, 2000);
    }
    
    /**
     * Configure les bulles d'interface dans les coins
     */
    setupCornerBubbles() {
        // Info button is handled by script.js setupInfoBubble() method
        
        // Bouton symbole de l'app (coin supérieur droit)
        const appSymbolBtn = document.getElementById('appSymbolBtn');
        if (appSymbolBtn) {
            appSymbolBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMascotMessage('Bienvenue dans ta Bulle Sensorielle ! 🫧', 3000);
            });
        }
        
        // Bouton pause globale
        const globalPauseBtn = document.getElementById('globalPauseBtn');
        if (globalPauseBtn) {
            globalPauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleGlobalPause();
            });
        }
    }
    
    /**
     * Bascule l'affichage du modal d'information
     */
    toggleInfoModal() {
        const infoModal = document.getElementById('infoModal');
        if (infoModal) {
            const isVisible = infoModal.classList.contains('show');
            
            if (isVisible) {
                this.closeInfoModal();
            } else {
                infoModal.classList.add('show');
                this.showMascotMessage('Voici toutes les informations sur ton application ! 📖', 2000);
                this.setupInfoModalEvents();
            }
        }
    }
    
    /**
     * Configure les événements du modal d'information
     */
    setupInfoModalEvents() {
        const infoModal = document.getElementById('infoModal');
        const closeBtn = document.getElementById('infoModalClose');
        
        // Remove existing event listeners to prevent duplicates
        if (closeBtn) {
            closeBtn.replaceWith(closeBtn.cloneNode(true));
            const newCloseBtn = document.getElementById('infoModalClose');
            newCloseBtn.addEventListener('click', () => this.closeInfoModal());
        }
        
        // Close modal when clicking outside
        const handleOutsideClick = (e) => {
            if (e.target === infoModal) {
                this.closeInfoModal();
            }
        };
        
        infoModal.removeEventListener('click', handleOutsideClick);
        infoModal.addEventListener('click', handleOutsideClick);
        
        // Close modal with Escape key
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                this.closeInfoModal();
            }
        };
        
        document.removeEventListener('keydown', handleEscapeKey);
        document.addEventListener('keydown', handleEscapeKey);
    }
    
    /**
     * Ferme le modal d'information
     */
    closeInfoModal() {
        const infoModal = document.getElementById('infoModal');
        if (infoModal) {
            infoModal.classList.remove('show');
            // Remove event listeners when closing
            document.removeEventListener('keydown', this.handleEscapeKey);
        }
    }
    
    /**
     * Gère la pause globale de tous les sons
     */
    toggleGlobalPause() {
        const pauseIcon = document.querySelector('.pause-icon');
        if (!pauseIcon) return;
        
        const isPaused = pauseIcon.textContent === '▶️';
        
        if (isPaused) {
            // Reprendre
            pauseIcon.textContent = '⏸️';
            if (window.audioManager) {
                window.audioManager.resumeAll();
            }
            this.showMascotMessage('Sons repris ! 🎵', 2000);
        } else {
            // Mettre en pause
            pauseIcon.textContent = '▶️';
            if (window.audioManager) {
                window.audioManager.pauseAll();
            }
            this.showMascotMessage('Tous les sons en pause 🔇', 2000);
        }
    }

    /**
     * Initialise la section actuelle
     */
    initializeCurrentSection() {
        // Déterminer la section actuelle basée sur l'URL ou l'état
        const hash = window.location.hash.substring(1);
        if (hash && this.sections.includes(hash)) {
            this.currentSection = hash;
        }
        
        this.updateActiveSection();
        this.showSectionMessage(this.currentSection);
    }

    /**
     * Navigue vers une section spécifique
     * @param {string} sectionId - ID de la section cible
     */
    navigateToSection(sectionId) {
        if (!this.sections.includes(sectionId)) {
            console.warn(`Section inconnue: ${sectionId}`);
            return;
        }

        // Mettre à jour l'état
        this.currentSection = sectionId;
        
        // Mettre à jour l'URL
        window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
        
        // Mettre à jour l'interface
        this.updateActiveSection();
        this.showSectionMessage(sectionId);
        
        // Initialiser la section si nécessaire
        this.initializeSection(sectionId);
    }

    /**
     * Met à jour la section active dans l'interface
     */
    updateActiveSection() {
        // Mettre à jour les boutons de navigation
        const navButtons = document.querySelectorAll('[data-section]');
        navButtons.forEach(button => {
            const sectionId = button.getAttribute('data-section');
            button.classList.toggle('active', sectionId === this.currentSection);
        });

        // Mettre à jour les sections
        this.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const isActive = sectionId === this.currentSection;
                section.classList.toggle('active', isActive);
                
                // Gérer l'affichage avec transition
                if (isActive) {
                    section.style.display = 'block';
                    // Forcer un reflow puis appliquer l'opacité
                    section.offsetHeight;
                    section.style.opacity = '1';
                } else {
                    section.style.opacity = '0';
                    setTimeout(() => {
                        if (!section.classList.contains('active')) {
                            section.style.display = 'none';
                        }
                    }, 200);
                }
            }
        });
    }

    /**
     * Affiche le message de la mascotte pour une section
     * @param {string} sectionId - ID de la section
     */
    showSectionMessage(sectionId) {
        const message = this.mascotMessages[sectionId] || "Explore cette section ! 🌟";
        const mascotMessage = document.getElementById('mascotMessage');
        
        if (mascotMessage) {
            // Animation de changement de message
            mascotMessage.style.opacity = '0';
            setTimeout(() => {
                mascotMessage.textContent = message;
                mascotMessage.style.opacity = '1';
            }, 150);
        }
    }

    /**
     * Initialise une section spécifique
     * @param {string} sectionId - ID de la section à initialiser
     */
    initializeSection(sectionId) {
        switch (sectionId) {
            case 'feelings':
                this.initializeFeelingsSection();
                break;
            case 'visuals':
                this.initializeVisualsSection();
                break;
            case 'audio':
                this.initializeAudioSection();
                break;
            case 'profiles':
                this.initializeProfilesSection();
                break;
        }
    }

    /**
     * Initialise la section feelings
     */
    initializeFeelingsSection() {
        // S'assurer que la section émotions est visible
        const emotionsSection = document.getElementById('emotionsSection');
        const needsSection = document.getElementById('needsSection');
        const activitiesSection = document.getElementById('activitiesSection');
        
        if (emotionsSection && needsSection && activitiesSection) {
            emotionsSection.style.display = 'block';
            emotionsSection.style.opacity = '1';
            needsSection.style.display = 'none';
            activitiesSection.style.display = 'none';
        }
    }

    /**
     * Initialise la section visuels
     */
    initializeVisualsSection() {
        // Arrêter toute animation en cours
        if (window.visualsManager) {
            window.visualsManager.stopAnimation();
        }
    }

    /**
     * Initialise la section audio
     */
    initializeAudioSection() {
        // Arrêter tout audio en cours si nécessaire
        if (window.audioManager) {
            // Optionnel: arrêter l'audio actuel
            // window.audioManager.stopAll();
        }
    }

    /**
     * Initialise la section profils
     */
    initializeProfilesSection() {
        // Charger les profils sauvegardés
        this.loadSavedProfiles();
    }

    /**
     * Charge les profils sauvegardés
     */
    loadSavedProfiles() {
        try {
            const savedProfiles = JSON.parse(localStorage.getItem('bulleSensorielleProfiles') || '[]');
            const profilesList = document.getElementById('profilesList');
            
            if (profilesList) {
                profilesList.innerHTML = '';
                
                if (savedProfiles.length === 0) {
                    profilesList.innerHTML = '<p class="no-profiles">Aucun profil sauvegardé</p>';
                } else {
                    savedProfiles.forEach((profile, index) => {
                        const profileElement = this.createProfileElement(profile, index);
                        profilesList.appendChild(profileElement);
                    });
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des profils:', error);
        }
    }

    /**
     * Crée un élément de profil
     * @param {Object} profile - Données du profil
     * @param {number} index - Index du profil
     * @returns {HTMLElement} Élément du profil
     */
    createProfileElement(profile, index) {
        const profileDiv = document.createElement('div');
        profileDiv.className = 'profile-item';
        profileDiv.innerHTML = `
            <h3>${profile.name}</h3>
            <p>Créé le ${new Date(profile.created).toLocaleDateString()}</p>
            <div class="profile-actions">
                <button onclick="loadProfile(${index})" class="load-btn">Charger</button>
                <button onclick="deleteProfile(${index})" class="delete-btn">Supprimer</button>
            </div>
        `;
        return profileDiv;
    }

    /**
     * Retourne à la section précédente
     */
    goBack() {
        // Pour l'instant, retourner à l'accueil
        this.navigateToSection('home');
    }

    /**
     * Gère la navigation au clavier
     * @param {KeyboardEvent} event - Événement clavier
     */
    handleKeyNavigation(event) {
        // Navigation avec les touches numériques
        const keyMap = {
            '1': 'home',
            '2': 'audio',
            '3': 'visuals',
            '4': 'feelings',
            '5': 'tips',
            '6': 'profiles'
        };

        if (keyMap[event.key]) {
            event.preventDefault();
            this.navigateToSection(keyMap[event.key]);
        }

        // Échap pour retourner à l'accueil
        if (event.key === 'Escape') {
            event.preventDefault();
            this.navigateToSection('home');
        }
    }

    /**
     * Obtient la section actuelle
     * @returns {string} ID de la section actuelle
     */
    getCurrentSection() {
        return this.currentSection;
    }

    /**
     * Vérifie si une section est active
     * @param {string} sectionId - ID de la section
     * @returns {boolean} True si la section est active
     */
    isSectionActive(sectionId) {
        return this.currentSection === sectionId;
    }
}

// Instance globale du gestionnaire de navigation
let navigationManager = null;

// Fonctions globales pour compatibilité
function showSection(sectionId) {
    if (navigationManager) {
        navigationManager.navigateToSection(sectionId);
    }
}

function goBack() {
    if (navigationManager) {
        navigationManager.goBack();
    }
}

function getCurrentSection() {
    return navigationManager ? navigationManager.getCurrentSection() : 'home';
}

// Gestion de l'historique du navigateur
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.section && navigationManager) {
        navigationManager.currentSection = event.state.section;
        navigationManager.updateActiveSection();
        navigationManager.showSectionMessage(event.state.section);
    }
});

// Initialiser le gestionnaire de navigation quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        navigationManager = new NavigationManager();
    });
} else {
    navigationManager = new NavigationManager();
}

// Exporter pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager };
}