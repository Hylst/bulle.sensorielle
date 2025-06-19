/**
 * Feelings Module - Gestion des émotions, besoins et activités
 * Module autonome pour la section feelings de l'application Bulle Sensorielle
 */

// Données d'intensité pour chaque émotion
const intensityData = {
    joie: [
        { level: 1, icon: '🙂', title: 'Un peu content(e)', description: 'Je me sens bien' },
        { level: 2, icon: '😊', title: 'Content(e)', description: 'Je suis de bonne humeur' },
        { level: 3, icon: '😄', title: 'Joyeux(se)', description: 'Je me sens vraiment bien' },
        { level: 4, icon: '😁', title: 'Très joyeux(se)', description: 'Je suis super content(e)' },
        { level: 5, icon: '🤩', title: 'Euphorique', description: 'Je déborde de joie' }
    ],
    calme: [
        { level: 1, icon: '😐', title: 'Un peu calme', description: 'Je me sens neutre' },
        { level: 2, icon: '😌', title: 'Calme', description: 'Je me sens paisible' },
        { level: 3, icon: '🧘', title: 'Très calme', description: 'Je suis serein(e)' },
        { level: 4, icon: '😇', title: 'Profondément calme', description: 'Je me sens zen' },
        { level: 5, icon: '🕊️', title: 'Paix totale', description: 'Je suis en harmonie' }
    ],
    peur: [
        { level: 1, icon: '😟', title: 'Un peu inquiet(ète)', description: 'Je me sens légèrement mal à l\'aise' },
        { level: 2, icon: '😰', title: 'Inquiet(ète)', description: 'J\'ai des soucis' },
        { level: 3, icon: '😨', title: 'Peur', description: 'J\'ai vraiment peur' },
        { level: 4, icon: '😱', title: 'Très peur', description: 'Je suis effrayé(e)' },
        { level: 5, icon: '😵', title: 'Terreur', description: 'J\'ai une peur intense' }
    ],
    tristesse: [
        { level: 1, icon: '😕', title: 'Un peu triste', description: 'Je ne me sens pas au top' },
        { level: 2, icon: '😢', title: 'Triste', description: 'J\'ai de la peine' },
        { level: 3, icon: '😭', title: 'Très triste', description: 'J\'ai envie de pleurer' },
        { level: 4, icon: '💔', title: 'Profondément triste', description: 'J\'ai le cœur gros' },
        { level: 5, icon: '😞', title: 'Désespoir', description: 'Je me sens abattu(e)' }
    ],
    colere: [
        { level: 1, icon: '😤', title: 'Un peu agacé(e)', description: 'Quelque chose m\'embête' },
        { level: 2, icon: '😠', title: 'En colère', description: 'Je suis fâché(e)' },
        { level: 3, icon: '😡', title: 'Très en colère', description: 'Je suis vraiment énervé(e)' },
        { level: 4, icon: '🤬', title: 'Furieux(se)', description: 'Je bouillonne de colère' },
        { level: 5, icon: '💢', title: 'Rage', description: 'Je suis hors de moi' }
    ],
    fatigue: [
        { level: 1, icon: '😪', title: 'Un peu fatigué(e)', description: 'Je manque un peu d\'énergie' },
        { level: 2, icon: '😴', title: 'Fatigué(e)', description: 'J\'ai besoin de repos' },
        { level: 3, icon: '🥱', title: 'Très fatigué(e)', description: 'Je suis vraiment épuisé(e)' },
        { level: 4, icon: '😵‍💫', title: 'Épuisé(e)', description: 'Je n\'ai plus d\'énergie' },
        { level: 5, icon: '🛌', title: 'Complètement vidé(e)', description: 'Je suis au bout du rouleau' }
    ]
};

// Données des émotions et leurs besoins/activités associés
const emotionsData = {
    joie: {
        needs: [
            { id: 'partage', icon: '🎵', title: 'Partager ma joie', description: 'Exprimer ce bonheur avec les autres' },
            { id: 'creation', icon: '🎨', title: 'Créer quelque chose', description: 'Utiliser cette énergie positive' },
            { id: 'celebration', icon: '🎉', title: 'Célébrer', description: 'Profiter de ce moment heureux' }
        ],
        activities: [
            { icon: '🎵', title: 'Danser ou chanter une chanson', description: 'Laisse ton corps bouger sur ta musique préférée pour exprimer ta joie.' },
            { icon: '🎨', title: 'Dessiner ou colorier', description: 'Crée quelque chose de beau avec tes couleurs préférées.' },
            { icon: '📞', title: 'Appeler quelqu\'un que tu aimes', description: 'Partage ton bonheur avec une personne spéciale.' }
        ]
    },
    calme: {
        needs: [
            { id: 'maintenir', icon: '🧘', title: 'Maintenir cette paix', description: 'Préserver ce moment de sérénité' },
            { id: 'ressourcer', icon: '📚', title: 'Me ressourcer', description: 'Profiter de cette tranquillité' },
            { id: 'savourer', icon: '🌸', title: 'Savourer l\'instant', description: 'Apprécier ce calme intérieur' }
        ],
        activities: [
            { icon: '📚', title: 'Lire un livre tranquillement', description: 'Installe-toi confortablement avec un livre que tu aimes.' },
            { icon: '🧘', title: 'Méditer ou respirer profondément', description: 'Ferme les yeux et concentre-toi sur ta respiration.' },
            { icon: '🌿', title: 'Observer la nature', description: 'Regarde par la fenêtre ou va dehors pour admirer les plantes et les animaux.' }
        ]
    },
    peur: {
        needs: [
            { id: 'securite', icon: '🤗', title: 'Être rassuré(e)', description: 'Avoir du réconfort et de la sécurité' },
            { id: 'confiance', icon: '💪', title: 'Reprendre confiance', description: 'Retrouver du courage' },
            { id: 'protection', icon: '🛡️', title: 'Me sentir protégé(e)', description: 'Avoir un environnement sûr' }
        ],
        activities: [
            { icon: '🤗', title: 'Faire un câlin ou tenir la main', description: 'Demande un câlin à quelqu\'un en qui tu as confiance.' },
            { icon: '🧸', title: 'Serrer une peluche ou une couverture', description: 'Enroule-toi dans une couverture douce avec ton doudou.' },
            { icon: '🎧', title: 'Écouter de la musique douce', description: 'Mets tes écouteurs et écoute des sons apaisants.' }
        ]
    },
    tristesse: {
        needs: [
            { id: 'reconfort', icon: '💙', title: 'Être consolé(e)', description: 'Recevoir de la compassion' },
            { id: 'expression', icon: '🗣️', title: 'Exprimer mes sentiments', description: 'Partager ce que je ressens' },
            { id: 'temps', icon: '⏰', title: 'Prendre mon temps', description: 'Laisser passer cette émotion' }
        ],
        activities: [
            { icon: '😢', title: 'Pleurer si j\'en ai besoin', description: 'C\'est normal de pleurer, ça aide à évacuer la tristesse.' },
            { icon: '🗣️', title: 'Parler de ce que je ressens', description: 'Trouve quelqu\'un de confiance pour partager tes émotions.' },
            { icon: '🎨', title: 'Dessiner mes émotions', description: 'Utilise des couleurs pour exprimer ce que tu ressens sur papier.' }
        ]
    },
    colere: {
        needs: [
            { id: 'evacuation', icon: '💨', title: 'Évacuer cette énergie', description: 'Libérer cette tension' },
            { id: 'comprendre', icon: '🎯', title: 'Comprendre pourquoi', description: 'Identifier la cause de ma colère' },
            { id: 'calme', icon: '😌', title: 'Retrouver mon calme', description: 'Apaiser cette émotion intense' }
        ],
        activities: [
            { icon: '💨', title: 'Respirer profondément', description: 'Inspire lentement par le nez, retiens, puis expire par la bouche.' },
            { icon: '🏃', title: 'Bouger ou faire du sport', description: 'Cours, saute, ou fais des mouvements pour évacuer l\'énergie.' },
            { icon: '🥊', title: 'Taper dans un coussin', description: 'Utilise un coussin ou un oreiller pour libérer ta colère sans faire mal.' }
        ]
    },
    fatigue: {
        needs: [
            { id: 'repos', icon: '😴', title: 'Me reposer', description: 'Récupérer de l\'énergie' },
            { id: 'recharger', icon: '🔋', title: 'Recharger mes batteries', description: 'Prendre soin de moi' },
            { id: 'ralentir', icon: '🛌', title: 'Ralentir le rythme', description: 'Faire une pause' }
        ],
        activities: [
            { icon: '😴', title: 'Faire une sieste', description: 'Allonge-toi dans un endroit confortable pour te reposer.' },
            { icon: '🛁', title: 'Prendre un bain chaud', description: 'L\'eau chaude va détendre tes muscles et t\'apaiser.' },
            { icon: '🍵', title: 'Boire quelque chose de chaud', description: 'Une boisson chaude peut te réconforter et te donner de l\'énergie.' }
        ]
    }
};

/**
 * Classe pour centraliser la gestion d'état de la section feelings
 */
class FeelingsState {
    constructor() {
        this.selectedEmotion = null;
        this.selectedIntensity = null;
        this.selectedNeed = null;
        this.observers = [];
    }

    /**
     * Ajoute un observateur pour les changements d'état
     * @param {Function} callback - Fonction appelée lors des changements
     */
    addObserver(callback) {
        this.observers.push(callback);
    }

    /**
     * Définit l'émotion sélectionnée
     * @param {string} emotion - L'émotion sélectionnée
     */
    setSelectedEmotion(emotion) {
        this.selectedEmotion = emotion;
        this.selectedIntensity = null; // Reset intensity when emotion changes
        this.selectedNeed = null; // Reset need when emotion changes
        this.notifyObservers();
    }

    /**
     * Définit l'intensité sélectionnée
     * @param {number} intensity - Le niveau d'intensité (1-5)
     */
    setSelectedIntensity(intensity) {
        this.selectedIntensity = intensity;
        this.selectedNeed = null; // Reset need when intensity changes
        this.notifyObservers();
    }

    /**
     * Définit le besoin sélectionné
     * @param {string} need - Le besoin sélectionné
     */
    setSelectedNeed(need) {
        this.selectedNeed = need;
        this.notifyObservers();
    }

    /**
     * Remet à zéro tous les états
     */
    reset() {
        this.selectedEmotion = null;
        this.selectedIntensity = null;
        this.selectedNeed = null;
        this.notifyObservers();
    }

    /**
     * Notifie tous les observateurs des changements d'état
     */
    notifyObservers() {
        this.observers.forEach(callback => {
            if (typeof callback === 'function') {
                callback(this.getState());
            }
        });
    }

    /**
     * Obtient l'état actuel
     * @returns {Object} L'état actuel
     */
    getState() {
        return {
            selectedEmotion: this.selectedEmotion,
            selectedIntensity: this.selectedIntensity,
            selectedNeed: this.selectedNeed
        };
    }
}

/**
 * Classe pour gérer la section feelings
 */
class FeelingsManager {
    constructor() {
        this.state = new FeelingsState();
        this.init();
    }

    /**
     * Initialise le gestionnaire des émotions
     */
    init() {
        this.bindEvents();
    }

    /**
     * Lie les événements aux éléments de l'interface
     */
    bindEvents() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        const emotionCards = document.querySelectorAll('.emotion-card');
        console.log('Setting up event listeners for', emotionCards.length, 'emotion cards');
        
        emotionCards.forEach((card, index) => {
            console.log(`Adding click listener to emotion card ${index}:`, card.getAttribute('data-emotion'));
            card.addEventListener('click', (e) => this.handleEmotionClick(e));
        });
        
        // Écouteurs pour les boutons de retour et redémarrage
        document.addEventListener('click', (event) => {
            const action = event.target.getAttribute('data-action');
            
            switch(action) {
                case 'back-to-emotions':
                    this.showEmotions();
                    break;
                case 'back-to-intensity':
                    this.showIntensity(this.state.selectedEmotion);
                    break;
                case 'back-to-needs':
                    this.showNeeds();
                    break;
                case 'restart':
                    this.restart();
                    break;
            }
        });
    }

    /**
     * Gère le clic sur une carte d'émotion
     * @param {Event} event - L'événement de clic
     */
    handleEmotionClick(event) {
        console.log('Emotion card clicked!', event.currentTarget);
        
        const card = event.currentTarget;
        const emotion = card.getAttribute('data-emotion');
        const color = card.getAttribute('data-color');
        
        console.log('Selected emotion:', emotion, 'Color:', color);
        
        // Retirer la sélection de toutes les cartes d'émotion
        document.querySelectorAll('.emotion-card').forEach(c => c.classList.remove('selected'));
        
        // Ajouter la sélection à la carte cliquée
        card.classList.add('selected');
        
        // Afficher l'intensité après un court délai
        setTimeout(() => {
            this.showIntensity(emotion);
        }, 200);
    }

    /**
     * Affiche la section d'intensité pour une émotion donnée
     * @param {string} emotion - L'émotion sélectionnée
     */
    showIntensity(emotion) {
        if (!emotion) {
            this.showEmotions();
            return;
        }
        
        this.state.setSelectedEmotion(emotion);
        
        const emotionsSection = document.getElementById('emotionsSection');
        const intensitySection = document.getElementById('intensitySection');
        const needsSection = document.getElementById('needsSection');
        const activitiesSection = document.getElementById('activitiesSection');
        const intensityGrid = document.getElementById('intensityGrid');
        
        // Transition cohérente
        emotionsSection.style.opacity = '0';
        needsSection.style.opacity = '0';
        activitiesSection.style.opacity = '0';
        
        setTimeout(() => {
            // Masquer les autres sections
            emotionsSection.style.display = 'none';
            needsSection.style.display = 'none';
            activitiesSection.style.display = 'none';
            
            // Afficher la section d'intensité
            intensitySection.style.display = 'block';
            intensitySection.style.opacity = '0';
            
            requestAnimationFrame(() => {
                intensitySection.style.opacity = '1';
            });
        }, 200);
        
        // Vider le contenu précédent
        intensityGrid.innerHTML = '';
        
        // Peupler les niveaux d'intensité
        const intensityLevels = intensityData[emotion];
        intensityLevels.forEach(level => {
            const intensityCard = document.createElement('div');
            intensityCard.className = 'intensity-card';
            intensityCard.setAttribute('data-level', level.level);
            intensityCard.innerHTML = `
                <div class="intensity-icon">${level.icon}</div>
                <div class="intensity-level">${level.title}</div>
                <div class="intensity-description">${level.description}</div>
            `;
            intensityCard.addEventListener('click', () => this.selectIntensity(level.level, intensityCard));
            intensityGrid.appendChild(intensityCard);
        });
    }

    /**
     * Sélectionne un niveau d'intensité et affiche les besoins
     * @param {number} level - Le niveau d'intensité sélectionné
     * @param {HTMLElement} cardElement - L'élément de la carte cliquée
     */
    selectIntensity(level, cardElement) {
        // Retirer la sélection de toutes les cartes d'intensité
        document.querySelectorAll('.intensity-card').forEach(c => c.classList.remove('selected'));
        
        // Ajouter la sélection à la carte cliquée
        cardElement.classList.add('selected');
        
        // Mettre à jour l'état
        this.state.setSelectedIntensity(level);
        
        // Afficher les besoins après un court délai
        setTimeout(() => {
            this.showNeeds();
        }, 300);
    }

    /**
     * Affiche la section des besoins pour une émotion donnée
     * @param {string} emotion - L'émotion sélectionnée
     */
    showNeeds(emotion = this.state.selectedEmotion) {
        if (!emotion) {
            this.showEmotions();
            return;
        }
        
        this.state.setSelectedEmotion(emotion);
        
        const emotionsSection = document.getElementById('emotionsSection');
        const intensitySection = document.getElementById('intensitySection');
        const needsSection = document.getElementById('needsSection');
        const activitiesSection = document.getElementById('activitiesSection');
        const needsGrid = document.getElementById('needsGrid');
        const activitiesGrid = document.getElementById('activitiesGrid');
        
        // Transition cohérente avec le système principal
        emotionsSection.style.opacity = '0';
        intensitySection.style.opacity = '0';
        activitiesSection.style.opacity = '0';
        
        setTimeout(() => {
            // Masquer les autres sections
            emotionsSection.style.display = 'none';
            intensitySection.style.display = 'none';
            activitiesSection.style.display = 'none';
            
            // Afficher la section des besoins avec transition fluide
            needsSection.style.display = 'block';
            needsSection.style.opacity = '0';
            
            // Utiliser requestAnimationFrame pour une transition plus fluide
            requestAnimationFrame(() => {
                needsSection.style.opacity = '1';
            });
        }, 200);
        
        // Vider le contenu précédent
        needsGrid.innerHTML = '';
        activitiesGrid.innerHTML = '';
        
        // Réinitialiser le style des cartes de besoins existantes
        const existingNeedCards = document.querySelectorAll('.need-card');
        existingNeedCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        // Le besoin sélectionné est déjà réinitialisé par setSelectedEmotion
        
        // Peupler les besoins
        const needs = emotionsData[emotion].needs;
        needs.forEach(need => {
            const needCard = document.createElement('div');
            needCard.className = 'need-card card-base card-small';
            needCard.innerHTML = `
                <div class="need-icon card-icon">${need.icon || '💭'}</div>
                <h3 class="card-title">${need.title}</h3>
                <p class="card-description">${need.description}</p>
            `;
            needCard.addEventListener('click', () => this.selectNeed(need.id, needCard));
            needsGrid.appendChild(needCard);
        });
    }

    /**
     * Sélectionne un besoin et affiche les activités
     * @param {string} needId - L'ID du besoin sélectionné
     * @param {HTMLElement} cardElement - L'élément de la carte cliquée
     */
    selectNeed(needId, cardElement) {
        this.state.setSelectedNeed(needId);
        
        // Retirer la sélection de toutes les cartes de besoins
        document.querySelectorAll('.need-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Ajouter la sélection à la carte cliquée
        cardElement.classList.add('selected');
        
        // Afficher les activités après un court délai
        setTimeout(() => {
            this.showActivities();
        }, 500);
    }

    /**
     * Affiche la section des activités
     */
    showActivities() {
        const needsSection = document.getElementById('needsSection');
        const activitiesSection = document.getElementById('activitiesSection');
        const activitiesGrid = document.getElementById('activitiesGrid');
        
        // Transition cohérente avec le système principal
        needsSection.style.opacity = '0';
        
        setTimeout(() => {
            // Masquer la section des besoins
            needsSection.style.display = 'none';
            
            // Afficher la section des activités avec transition fluide
            activitiesSection.style.display = 'block';
            activitiesSection.style.opacity = '0';
            
            // Utiliser requestAnimationFrame pour une transition plus fluide
            requestAnimationFrame(() => {
                activitiesSection.style.opacity = '1';
            });
        }, 200);
        
        // Vider le contenu précédent
        activitiesGrid.innerHTML = '';
        
        // Peupler les activités
        const activities = emotionsData[this.state.selectedEmotion].activities;
        activities.forEach(activity => {
            const activityCard = document.createElement('div');
            activityCard.className = 'activity-card card-base';
            activityCard.innerHTML = `
                <div class="activity-icon card-icon">${activity.icon || '✨'}</div>
                <h3 class="card-title">${activity.title}</h3>
                <p class="card-description">${activity.description}</p>
            `;
            activitiesGrid.appendChild(activityCard);
        });
    }

    /**
     * Affiche la section des émotions (retour au début)
     */
    showEmotions() {
        const emotionsSection = document.getElementById('emotionsSection');
        const intensitySection = document.getElementById('intensitySection');
        const needsSection = document.getElementById('needsSection');
        const activitiesSection = document.getElementById('activitiesSection');
        const needsGrid = document.getElementById('needsGrid');
        const activitiesGrid = document.getElementById('activitiesGrid');
        
        // Vérifier que toutes les sections existent
        if (!emotionsSection || !intensitySection || !needsSection || !activitiesSection) {
            console.warn('Sections feelings non trouvées - peut-être sur la mauvaise page');
            return;
        }
        
        // Transition cohérente avec le système principal
        intensitySection.style.opacity = '0';
        needsSection.style.opacity = '0';
        activitiesSection.style.opacity = '0';
        
        setTimeout(() => {
            // Masquer les autres sections
            intensitySection.style.display = 'none';
            needsSection.style.display = 'none';
            activitiesSection.style.display = 'none';
            
            // Afficher la section des émotions avec transition fluide
            emotionsSection.style.display = 'block';
            emotionsSection.style.opacity = '0';
            
            // Utiliser requestAnimationFrame pour une transition plus fluide
            requestAnimationFrame(() => {
                emotionsSection.style.opacity = '1';
            });
        }, 200);
        
        // Vider les grilles en toute sécurité
        if (needsGrid) needsGrid.innerHTML = '';
        if (activitiesGrid) activitiesGrid.innerHTML = '';
        
        // Réinitialiser les sélections
        this.state.reset();
        
        // Réinitialiser le style des cartes d'émotion et de besoins
        const emotionCards = document.querySelectorAll('.emotion-card');
        const needCards = document.querySelectorAll('.need-card');
        
        emotionCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        needCards.forEach(card => {
            card.classList.remove('selected');
        });
    }

    /**
     * Redémarre la section feelings (retour aux émotions)
     */
    restart() {
        const emotionsSection = document.getElementById('emotionsSection');
        const intensitySection = document.getElementById('intensitySection');
        const needsSection = document.getElementById('needsSection');
        const activitiesSection = document.getElementById('activitiesSection');
        const needsGrid = document.getElementById('needsGrid');
        const activitiesGrid = document.getElementById('activitiesGrid');
        
        // Vérifier que les sections existent
        if (!emotionsSection || !intensitySection || !needsSection || !activitiesSection) {
            console.warn('Sections feelings non trouvées - peut-être sur la mauvaise page');
            return;
        }
        
        // Masquer toutes les sections sauf les émotions
        intensitySection.style.display = 'none';
        needsSection.style.display = 'none';
        activitiesSection.style.display = 'none';
        emotionsSection.style.display = 'block';
        emotionsSection.style.opacity = '1';
        
        // Vider les grilles en toute sécurité
        if (needsGrid) needsGrid.innerHTML = '';
        if (activitiesGrid) activitiesGrid.innerHTML = '';
        
        // Réinitialiser toutes les sélections
        this.state.reset();
        
        // Réinitialiser le style de toutes les cartes
        const emotionCards = document.querySelectorAll('.emotion-card');
        const needCards = document.querySelectorAll('.need-card');
        
        emotionCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        needCards.forEach(card => {
            card.classList.remove('selected');
        });
    }
}

// Instance globale du gestionnaire de feelings
let feelingsManager = null;

// Fonctions globales pour compatibilité avec les onclick dans le HTML
function showNeeds(emotion) {
    if (feelingsManager) {
        feelingsManager.showNeeds(emotion);
    }
}

function showActivities() {
    if (feelingsManager) {
        feelingsManager.showActivities();
    }
}

function showEmotions() {
    if (feelingsManager) {
        feelingsManager.showEmotions();
    }
}

function restart() {
    if (feelingsManager) {
        feelingsManager.restart();
    }
}

// Initialiser le gestionnaire de feelings quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        feelingsManager = new FeelingsManager();
    });
} else {
    feelingsManager = new FeelingsManager();
}

// Exporter pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FeelingsManager, emotionsData };
}