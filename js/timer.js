/**
 * Timer Module - Gestion du minuteur de pause sensorielle
 * Module autonome pour le minuteur de l'application Bulle Sensorielle
 */

/**
 * Classe pour gérer le minuteur
 */
class TimerManager {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.timeRemaining = 0;
        this.totalTime = 0;
        this.interval = null;
        this.timerDisplay = null;
        this.timerCircle = null;
        this.startBtn = null;
        this.pauseBtn = null;
        this.stopBtn = null;
        this.presetButtons = [];
        this.init();
    }

    /**
     * Initialise le gestionnaire de minuteur
     */
    init() {
        this.bindElements();
        this.bindEvents();
        this.updateDisplay();
    }

    /**
     * Lie les éléments DOM
     */
    bindElements() {
        this.timerDisplay = document.getElementById('timerTime');
        this.timerCircle = document.getElementById('timerCircle');
        this.startBtn = document.getElementById('startTimer');
        this.pauseBtn = document.getElementById('pauseTimer');
        this.stopBtn = document.getElementById('stopTimer');
        this.presetButtons = document.querySelectorAll('[data-time]');
        this.customMinutesInput = document.getElementById('customMinutes');
    }

    /**
     * Lie les événements
     */
    bindEvents() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.start());
        }
        
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pause());
        }
        
        if (this.stopBtn) {
            this.stopBtn.addEventListener('click', () => this.stop());
        }
        
        // Boutons de durée prédéfinie
        this.presetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const minutes = parseInt(e.currentTarget.getAttribute('data-time'));
                this.setTime(minutes);
            });
        });
        
        // Input de temps personnalisé
        if (this.customMinutesInput) {
            this.customMinutesInput.addEventListener('change', (e) => {
                const minutes = parseInt(e.target.value);
                if (minutes > 0) {
                    this.setTime(minutes);
                }
            });
        }
    }

    /**
     * Définit la durée du minuteur
     * @param {number} minutes - Durée en minutes
     */
    setTime(minutes) {
        if (this.isRunning) {
            this.stop();
        }
        
        this.totalTime = minutes * 60; // Convertir en secondes
        this.timeRemaining = this.totalTime;
        this.updateDisplay();
        this.updateButtons();
        
        // Mettre à jour les boutons de preset
        this.presetButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.getAttribute('data-time')) === minutes) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * Démarre le minuteur
     */
    start() {
        // Si aucun temps n'est défini, utiliser la valeur de l'input personnalisé
        if (this.timeRemaining <= 0) {
            if (this.customMinutesInput && this.customMinutesInput.value) {
                const minutes = parseInt(this.customMinutesInput.value);
                if (minutes > 0) {
                    this.setTime(minutes);
                } else {
                    console.warn('Aucune durée valide définie pour le minuteur');
                    return;
                }
            } else {
                console.warn('Aucune durée définie pour le minuteur');
                return;
            }
        }
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.interval = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();
            
            if (this.timeRemaining <= 0) {
                this.onTimerComplete();
            }
        }, 1000);
        
        this.updateButtons();
    }

    /**
     * Met en pause le minuteur
     */
    pause() {
        if (this.isRunning && !this.isPaused) {
            clearInterval(this.interval);
            this.isPaused = true;
            this.isRunning = false;
        } else if (this.isPaused) {
            this.start();
        }
        
        this.updateButtons();
    }

    /**
     * Arrête le minuteur
     */
    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.isPaused = false;
        this.timeRemaining = this.totalTime;
        this.updateDisplay();
        this.updateButtons();
    }

    /**
     * Appelée quand le minuteur se termine
     */
    onTimerComplete() {
        this.stop();
        
        // Arrêter tous les sons et visuels
        if (window.audioManager) {
            window.audioManager.stopAll();
        }
        
        if (window.visualsManager) {
            window.visualsManager.stopAnimation();
        }
        
        // Afficher une notification
        this.showCompletionMessage();
    }

    /**
     * Affiche un message de fin de minuteur
     */
    showCompletionMessage() {
        if (window.navigationManager) {
            window.navigationManager.showMascotMessage('⏰ Temps écoulé ! Ta pause sensorielle est terminée. 🌟', 3000);
        }
        
        // Optionnel: jouer un son de notification
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.3;
            audio.play().catch(() => {});
        } catch (e) {
            // Ignorer les erreurs audio
        }
    }

    /**
     * Met à jour l'affichage du minuteur
     */
    updateDisplay() {
        if (!this.timerDisplay) return;
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Mettre à jour le cercle de progression
        this.updateCircle();
    }

    /**
     * Met à jour le cercle de progression
     */
    updateCircle() {
        if (!this.timerCircle || this.totalTime === 0) return;
        
        const progress = (this.totalTime - this.timeRemaining) / this.totalTime;
        const degrees = progress * 360;
        
        this.timerCircle.style.setProperty('--progress', degrees);
    }

    /**
     * Met à jour l'état des boutons
     */
    updateButtons() {
        if (this.startBtn) {
            this.startBtn.disabled = this.isRunning;
            this.startBtn.textContent = this.isPaused ? '▶️ Reprendre' : '▶️ Commencer';
        }
        
        if (this.pauseBtn) {
            this.pauseBtn.disabled = !this.isRunning && !this.isPaused;
            this.pauseBtn.textContent = this.isPaused ? '▶️ Reprendre' : '⏸️ Pause';
        }
        
        if (this.stopBtn) {
            this.stopBtn.disabled = !this.isRunning && !this.isPaused;
        }
    }

    /**
     * Obtient l'état actuel du minuteur
     */
    getState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            timeRemaining: this.timeRemaining,
            totalTime: this.totalTime
        };
    }

    /**
     * Restaure l'état du minuteur
     * @param {Object} state - État à restaurer
     */
    setState(state) {
        if (state) {
            this.totalTime = state.totalTime || 0;
            this.timeRemaining = state.timeRemaining || 0;
            this.updateDisplay();
            this.updateButtons();
        }
    }

    /**
     * Nettoie les ressources
     */
    cleanup() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// Instance globale du gestionnaire de minuteur
let timerManager = null;

// Fonctions globales pour compatibilité
function startTimer() {
    if (timerManager) {
        timerManager.start();
    }
}

function pauseTimer() {
    if (timerManager) {
        timerManager.pause();
    }
}

function stopTimer() {
    if (timerManager) {
        timerManager.stop();
    }
}

function setTimerDuration(minutes) {
    if (timerManager) {
        timerManager.setTime(minutes);
    }
}

// Initialiser le gestionnaire de minuteur quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        timerManager = new TimerManager();
        window.timerManager = timerManager;
    });
} else {
    timerManager = new TimerManager();
    window.timerManager = timerManager;
}

// Nettoyer lors de la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (timerManager) {
        timerManager.cleanup();
    }
});

// Exporter pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TimerManager };
}