// Emotions to needs and activities mapping
const emotionData = {
    joie: {
        needs: [
            { icon: '🎵', title: 'Partager ma joie', description: 'Exprimer ce bonheur avec les autres' },
            { icon: '🎨', title: 'Créer quelque chose', description: 'Utiliser cette énergie positive' },
            { icon: '🎉', title: 'Célébrer', description: 'Profiter de ce moment heureux' }
        ],
        activities: [
            { icon: '🎵', title: 'Danser ou chanter une chanson', description: 'Laisse ton corps bouger sur ta musique préférée pour exprimer ta joie.' },
            { icon: '🎨', title: 'Dessiner ou colorier', description: 'Crée quelque chose de beau avec tes couleurs préférées.' },
            { icon: '📞', title: 'Appeler quelqu\'un que tu aimes', description: 'Partage ton bonheur avec une personne spéciale.' }
        ]
    },
    calme: {
        needs: [
            { icon: '🧘', title: 'Maintenir cette paix', description: 'Préserver ce moment de sérénité' },
            { icon: '📚', title: 'Me ressourcer', description: 'Profiter de cette tranquillité' },
            { icon: '🌸', title: 'Savourer l\'instant', description: 'Apprécier ce calme intérieur' }
        ],
        activities: [
            { icon: '📚', title: 'Lire un livre tranquillement', description: 'Installe-toi confortablement avec un livre que tu aimes.' },
            { icon: '🧘', title: 'Méditer ou respirer profondément', description: 'Ferme les yeux et concentre-toi sur ta respiration.' },
            { icon: '🌿', title: 'Observer la nature', description: 'Regarde par la fenêtre ou va dehors pour admirer les plantes et les animaux.' }
        ]
    },
    peur: {
        needs: [
            { icon: '🤗', title: 'Être rassuré(e)', description: 'Avoir du réconfort et de la sécurité' },
            { icon: '💪', title: 'Reprendre confiance', description: 'Retrouver du courage' },
            { icon: '🛡️', title: 'Me sentir protégé(e)', description: 'Avoir un environnement sûr' }
        ],
        activities: [
            { icon: '🤗', title: 'Faire un câlin ou tenir la main', description: 'Demande un câlin à quelqu\'un en qui tu as confiance.' },
            { icon: '🧸', title: 'Serrer une peluche ou une couverture', description: 'Enroule-toi dans une couverture douce avec ton doudou.' },
            { icon: '🎧', title: 'Écouter de la musique douce', description: 'Mets tes écouteurs et écoute des sons apaisants.' }
        ]
    },
    tristesse: {
        needs: [
            { icon: '💙', title: 'Être consolé(e)', description: 'Recevoir de la compassion' },
            { icon: '🗣️', title: 'Exprimer mes sentiments', description: 'Partager ce que je ressens' },
            { icon: '⏰', title: 'Prendre mon temps', description: 'Laisser passer cette émotion' }
        ],
        activities: [
            { icon: '😢', title: 'Pleurer si j\'en ai besoin', description: 'C\'est normal de pleurer, ça aide à évacuer la tristesse.' },
            { icon: '🗣️', title: 'Parler de ce que je ressens', description: 'Trouve quelqu\'un de confiance pour partager tes émotions.' },
            { icon: '🎨', title: 'Dessiner mes émotions', description: 'Utilise des couleurs pour exprimer ce que tu ressens sur papier.' }
        ]
    },
    colere: {
        needs: [
            { icon: '💨', title: 'Évacuer cette énergie', description: 'Libérer cette tension' },
            { icon: '🎯', title: 'Comprendre pourquoi', description: 'Identifier la cause de ma colère' },
            { icon: '😌', title: 'Retrouver mon calme', description: 'Apaiser cette émotion intense' }
        ],
        activities: [
            { icon: '💨', title: 'Respirer profondément', description: 'Inspire lentement par le nez, retiens, puis expire par la bouche.' },
            { icon: '🏃', title: 'Bouger ou faire du sport', description: 'Cours, saute, ou fais des mouvements pour évacuer l\'énergie.' },
            { icon: '🥊', title: 'Taper dans un coussin', description: 'Utilise un coussin ou un oreiller pour libérer ta colère sans faire mal.' }
        ]
    },
    fatigue: {
        needs: [
            { icon: '😴', title: 'Me reposer', description: 'Récupérer de l\'énergie' },
            { icon: '🔋', title: 'Recharger mes batteries', description: 'Prendre soin de moi' },
            { icon: '🛌', title: 'Ralentir le rythme', description: 'Faire une pause' }
        ],
        activities: [
            { icon: '😴', title: 'Faire une sieste', description: 'Allonge-toi dans un endroit confortable pour te reposer.' },
            { icon: '🛁', title: 'Prendre un bain chaud', description: 'L\'eau chaude va détendre tes muscles et t\'apaiser.' },
            { icon: '🍵', title: 'Boire quelque chose de chaud', description: 'Une boisson chaude peut te réconforter et te donner de l\'énergie.' }
        ]
    }
};

let currentEmotion = null;
let currentNeed = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEmotionCards();
});

// Setup emotion card click handlers
function setupEmotionCards() {
    const emotionCards = document.querySelectorAll('.emotion-card');
    
    emotionCards.forEach(card => {
        card.addEventListener('click', function() {
            const emotion = this.dataset.emotion;
            const color = this.dataset.color;
            selectEmotion(emotion, color);
        });
    });
}

// Handle emotion selection
function selectEmotion(emotion, color) {
    currentEmotion = emotion;
    
    // Add selection animation
    const selectedCard = document.querySelector(`[data-emotion="${emotion}"]`);
    selectedCard.style.transform = 'scale(1.1)';
    selectedCard.style.background = color;
    
    setTimeout(() => {
        showNeeds(emotion);
    }, 500);
}

// Show needs based on selected emotion
function showNeeds(emotion = currentEmotion) {
    const emotionsSection = document.getElementById('emotionsSection');
    const needsSection = document.getElementById('needsSection');
    const activitiesSection = document.getElementById('activitiesSection');
    const needsGrid = document.getElementById('needsGrid');
    
    // Smooth transition: fade out current sections
    emotionsSection.style.opacity = '0';
    activitiesSection.style.opacity = '0';
    
    setTimeout(() => {
        // Hide other sections
        emotionsSection.style.display = 'none';
        activitiesSection.style.display = 'none';
        
        // Show needs section with fade in
        needsSection.style.display = 'block';
        needsSection.style.opacity = '0';
        
        setTimeout(() => {
            needsSection.style.opacity = '1';
        }, 20);
    }, 200);

    // Clear activities grid to prevent leftover cards
    const activitiesGrid = document.getElementById('activitiesGrid');
    if (activitiesGrid) {
        activitiesGrid.innerHTML = '';
    }
    
    // Reset need cards styling
    const existingNeedCards = document.querySelectorAll('.need-card');
    existingNeedCards.forEach(card => {
        card.style.transform = '';
        card.style.background = '';
    });
    
    // Clear and populate needs
    needsGrid.innerHTML = '';
    
    const needs = emotionData[emotion].needs;
    
    needs.forEach((need, index) => {
        const needCard = document.createElement('div');
        needCard.className = 'need-card';
        needCard.style.animationDelay = `${index * 0.1}s`;
        needCard.style.animation = 'slideIn 0.5s ease-out forwards';
        
        needCard.innerHTML = `
            <div class="need-icon">${need.icon}</div>
            <h3>${need.title}</h3>
            <p>${need.description}</p>
        `;
        
        needCard.addEventListener('click', () => selectNeed(need, index));
        needsGrid.appendChild(needCard);
    });
}

// Handle need selection
function selectNeed(need, index) {
    currentNeed = index;
    
    // Add selection animation
    const selectedCard = document.querySelectorAll('.need-card')[index];
    selectedCard.style.transform = 'scale(1.05)';
    selectedCard.style.background = 'var(--accent-blue)';
    
    setTimeout(() => {
        showActivities();
    }, 500);
}

// Show activities based on selected emotion
function showActivities() {
    const needsSection = document.getElementById('needsSection');
    const activitiesSection = document.getElementById('activitiesSection');
    const activitiesGrid = document.getElementById('activitiesGrid');
    
    // Smooth transition: fade out needs section
    needsSection.style.opacity = '0';
    
    setTimeout(() => {
        // Hide needs section
        needsSection.style.display = 'none';
        
        // Show activities section with fade in
        activitiesSection.style.display = 'block';
        activitiesSection.style.opacity = '0';
        
        setTimeout(() => {
            activitiesSection.style.opacity = '1';
        }, 20);
    }, 200);
    
    // Clear and populate activities
    activitiesGrid.innerHTML = '';
    
    const activities = emotionData[currentEmotion].activities;
    
    activities.forEach((activity, index) => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        activityCard.style.animationDelay = `${index * 0.15}s`;
        activityCard.style.animation = 'slideIn 0.6s ease-out forwards';
        
        activityCard.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
        `;
        
        activitiesGrid.appendChild(activityCard);
    });
}

// Show emotions section
function showEmotions() {
    const emotionsSection = document.getElementById('emotionsSection');
    const needsSection = document.getElementById('needsSection');
    const activitiesSection = document.getElementById('activitiesSection');
    
    // Smooth transition: fade out current sections
    needsSection.style.opacity = '0';
    activitiesSection.style.opacity = '0';
    
    setTimeout(() => {
        // Hide other sections
        needsSection.style.display = 'none';
        activitiesSection.style.display = 'none';
        
        // Show emotions section with fade in
        emotionsSection.style.display = 'block';
        emotionsSection.style.opacity = '0';
        
        setTimeout(() => {
            emotionsSection.style.opacity = '1';
        }, 20);
    }, 200);

    // Clear needs and activities grids to prevent leftover cards
    const needsGrid = document.getElementById('needsGrid');
    if (needsGrid) {
        needsGrid.innerHTML = '';
    }
    const activitiesGrid = document.getElementById('activitiesGrid');
    if (activitiesGrid) {
        activitiesGrid.innerHTML = '';
    }
    
    // Reset emotion cards
    const emotionCards = document.querySelectorAll('.emotion-card');
    emotionCards.forEach(card => {
        card.style.transform = '';
        card.style.background = '';
    });
    
    // Reset need cards styling
    const needCards = document.querySelectorAll('.need-card');
    needCards.forEach(card => {
        card.style.transform = '';
        card.style.background = '';
    });
    
    currentEmotion = null;
    currentNeed = null;
}

// Restart the entire flow
function restart() {
    const activitiesSection = document.getElementById('activitiesSection');
    const needsSection = document.getElementById('needsSection');
    const emotionsSection = document.getElementById('emotionsSection');
    
    // Smooth transition: fade out current sections
    activitiesSection.style.opacity = '0';
    needsSection.style.opacity = '0';
    
    setTimeout(() => {
        // Hide all sections except emotions
        activitiesSection.style.display = 'none';
        needsSection.style.display = 'none';
        
        // Show emotions section with fade in
        emotionsSection.style.display = 'block';
        emotionsSection.style.opacity = '0';
        
        setTimeout(() => {
            emotionsSection.style.opacity = '1';
        }, 20);
    }, 200);
    
    // Clear all grids
    const needsGrid = document.getElementById('needsGrid');
    if (needsGrid) {
        needsGrid.innerHTML = '';
    }
    const activitiesGrid = document.getElementById('activitiesGrid');
    if (activitiesGrid) {
        activitiesGrid.innerHTML = '';
    }

    // Reset all emotion cards
    const emotionCards = document.querySelectorAll('.emotion-card');
    emotionCards.forEach(card => {
        card.style.transform = '';
        card.style.background = '';
    });
    
    // Reset all need cards
    const needCards = document.querySelectorAll('.need-card');
    needCards.forEach(card => {
        card.style.transform = '';
        card.style.background = '';
    });
    
    currentEmotion = null;
    currentNeed = null;
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Add hover sound effect simulation
    const cards = document.querySelectorAll('.emotion-card, .need-card, .activity-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform || 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.style.background || this.style.background === '') {
                this.style.transform = '';
            }
        });
    });
});