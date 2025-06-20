/**
 * Profiles Module - Gestion des profils utilisateur
 * Module autonome pour la sauvegarde et le chargement des profils
 */

/**
 * Classe pour gérer les profils utilisateur
 */
class ProfilesManager {
    constructor() {
        this.storageKey = 'bulleSensorielleProfiles';
        this.currentProfile = null;
        this.profiles = [];
        this.init();
    }

    /**
     * Initialise le gestionnaire de profils
     */
    init() {
        this.loadProfiles();
        this.bindEvents();
    }

    /**
     * Lie les événements aux éléments de l'interface
     */
    bindEvents() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupProfileEvents());
        } else {
            this.setupProfileEvents();
        }
    }

    /**
     * Configure les événements des profils
     */
    setupProfileEvents() {
        // Bouton de sauvegarde
        const saveButton = document.getElementById('saveProfile');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.showSaveModal());
        }

        // Modal de sauvegarde
        const saveModal = document.getElementById('saveModal');
        const cancelSave = document.getElementById('cancelSave');
        const confirmSave = document.getElementById('confirmSave');
        const profileNameInput = document.getElementById('profileName');

        if (cancelSave) {
            cancelSave.addEventListener('click', () => this.hideSaveModal());
        }

        if (confirmSave) {
            confirmSave.addEventListener('click', () => this.saveCurrentProfile());
        }

        if (profileNameInput) {
            profileNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveCurrentProfile();
                }
            });
        }

        // Fermer la modal en cliquant à l'extérieur
        if (saveModal) {
            saveModal.addEventListener('click', (e) => {
                if (e.target === saveModal) {
                    this.hideSaveModal();
                }
            });
        }
    }

    /**
     * Charge les profils depuis le localStorage
     */
    loadProfiles() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.profiles = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erreur lors du chargement des profils:', error);
            this.profiles = [];
        }
    }

    /**
     * Sauvegarde les profils dans le localStorage
     */
    saveProfiles() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.profiles));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des profils:', error);
            this.showError('Impossible de sauvegarder le profil');
        }
    }

    /**
     * Affiche la modal de sauvegarde
     */
    showSaveModal() {
        const modal = document.getElementById('saveModal');
        const input = document.getElementById('profileName');
        
        if (modal) {
            modal.style.display = 'flex';
            if (input) {
                input.value = '';
                input.focus();
            }
        }
    }

    /**
     * Masque la modal de sauvegarde
     */
    hideSaveModal() {
        const modal = document.getElementById('saveModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Sauvegarde le profil actuel
     */
    saveCurrentProfile() {
        const nameInput = document.getElementById('profileName');
        const name = nameInput ? nameInput.value.trim() : '';
        
        if (!name) {
            this.showError('Veuillez entrer un nom pour votre profil');
            return;
        }

        // Collecter l'état actuel de l'application
        const currentState = this.getCurrentAppState();
        
        const profile = {
            id: Date.now(),
            name: name,
            created: new Date().toISOString(),
            state: currentState
        };

        // Ajouter le profil à la liste
        this.profiles.push(profile);
        this.saveProfiles();
        this.hideSaveModal();
        
        // Mettre à jour l'affichage si on est sur la page des profils
        if (window.navigationManager && window.navigationManager.getCurrentSection() === 'profiles') {
            window.navigationManager.loadSavedProfiles();
        }
        
        this.showSuccess(`Profil "${name}" sauvegardé avec succès !`);
    }

    /**
     * Collecte l'état actuel de l'application
     * @returns {Object} État de l'application
     */
    getCurrentAppState() {
        const state = {
            section: window.navigationManager ? window.navigationManager.getCurrentSection() : 'home',
            audio: null,
            visual: null,
            feelings: {
                emotion: null,
                need: null
            }
        };

        // État audio
        const audioManager = BulleSensorielleApp.getAudioManager();
        if (audioManager) {
            state.audio = audioManager.getState();
        }

        // État visuel
        if (window.visualsManager) {
            state.visual = window.visualsManager.getState();
        }

        // État feelings
        if (window.feelingsManager) {
            state.feelings.emotion = window.feelingsManager.selectedEmotion;
            state.feelings.need = window.feelingsManager.selectedNeed;
        }

        return state;
    }

    /**
     * Charge un profil spécifique
     * @param {number} index - Index du profil à charger
     */
    loadProfile(index) {
        if (index < 0 || index >= this.profiles.length) {
            this.showError('Profil introuvable');
            return;
        }

        const profile = this.profiles[index];
        this.currentProfile = profile;
        
        try {
            this.applyProfileState(profile.state);
            this.showSuccess(`Profil "${profile.name}" chargé avec succès !`);
        } catch (error) {
            console.error('Erreur lors du chargement du profil:', error);
            this.showError('Erreur lors du chargement du profil');
        }
    }

    /**
     * Applique l'état d'un profil à l'application
     * @param {Object} state - État à appliquer
     */
    applyProfileState(state) {
        // Naviguer vers la section
        if (state.section && window.navigationManager) {
            window.navigationManager.navigateToSection(state.section);
        }

        // Appliquer l'état audio
        const audioManager = BulleSensorielleApp.getAudioManager();
        if (state.audio && audioManager) {
            if (state.audio.volume !== undefined) {
                audioManager.setVolume(state.audio.volume);
            }
        }

        // Appliquer l'état visuel
        if (state.visual && window.visualsManager) {
            if (state.visual.currentAnimation) {
                setTimeout(() => {
                    const button = document.querySelector(`[data-visual="${state.visual.currentAnimation}"]`);
                    if (button) {
                        window.visualsManager.toggleVisual(state.visual.currentAnimation, button);
                    }
                }, 500);
            }
        }

        // Appliquer l'état feelings
        if (state.feelings && window.feelingsManager) {
            if (state.feelings.emotion) {
                setTimeout(() => {
                    window.feelingsManager.showNeeds(state.feelings.emotion);
                }, 500);
            }
        }
    }

    /**
     * Supprime un profil
     * @param {number} index - Index du profil à supprimer
     */
    deleteProfile(index) {
        if (index < 0 || index >= this.profiles.length) {
            this.showError('Profil introuvable');
            return;
        }

        const profile = this.profiles[index];
        const confirmDelete = confirm(`Êtes-vous sûr de vouloir supprimer le profil "${profile.name}" ?`);
        
        if (confirmDelete) {
            this.profiles.splice(index, 1);
            this.saveProfiles();
            
            // Mettre à jour l'affichage
            if (window.navigationManager && window.navigationManager.getCurrentSection() === 'profiles') {
                window.navigationManager.loadSavedProfiles();
            }
            
            this.showSuccess(`Profil "${profile.name}" supprimé`);
        }
    }

    /**
     * Obtient tous les profils
     * @returns {Array} Liste des profils
     */
    getAllProfiles() {
        return [...this.profiles];
    }

    /**
     * Obtient le profil actuel
     * @returns {Object|null} Profil actuel
     */
    getCurrentProfile() {
        return this.currentProfile;
    }

    /**
     * Exporte tous les profils
     * @returns {string} JSON des profils
     */
    exportProfiles() {
        return JSON.stringify(this.profiles, null, 2);
    }

    /**
     * Importe des profils
     * @param {string} jsonData - Données JSON des profils
     */
    importProfiles(jsonData) {
        try {
            const importedProfiles = JSON.parse(jsonData);
            if (Array.isArray(importedProfiles)) {
                this.profiles = [...this.profiles, ...importedProfiles];
                this.saveProfiles();
                this.showSuccess(`${importedProfiles.length} profil(s) importé(s)`);
            } else {
                throw new Error('Format invalide');
            }
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            this.showError('Erreur lors de l\'importation des profils');
        }
    }

    /**
     * Affiche un message de succès
     * @param {string} message - Message à afficher
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Affiche un message d'erreur
     * @param {string} message - Message à afficher
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Affiche une notification
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification (success, error)
     */
    showNotification(message, type = 'info') {
        // Créer ou mettre à jour l'élément de notification
        let notification = document.getElementById('profileNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'profileNotification';
            notification.className = 'profile-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                max-width: 300px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(notification);
        }

        // Définir la couleur selon le type
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        // Afficher la notification
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
        
        // Masquer après 4 secondes
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
        }, 4000);
    }

    /**
     * Nettoie les ressources
     */
    cleanup() {
        const notification = document.getElementById('profileNotification');
        if (notification) {
            notification.remove();
        }
    }
}

// Instance globale du gestionnaire de profils
let profilesManager = null;

// Fonctions globales pour compatibilité
function saveProfile() {
    if (profilesManager) {
        profilesManager.showSaveModal();
    }
}

function loadProfile(index) {
    if (profilesManager) {
        profilesManager.loadProfile(index);
    }
}

function deleteProfile(index) {
    if (profilesManager) {
        profilesManager.deleteProfile(index);
    }
}

function exportProfiles() {
    if (profilesManager) {
        const data = profilesManager.exportProfiles();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bulle-sensorielle-profils.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialiser le gestionnaire de profils quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        profilesManager = new ProfilesManager();
    });
} else {
    profilesManager = new ProfilesManager();
}

// Nettoyer lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (profilesManager) {
        profilesManager.cleanup();
    }
});

// Exporter pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfilesManager };
}