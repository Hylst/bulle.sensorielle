// Tips interaction manager
class TipsManager {
    constructor() {
        this.bubbleSound = null;
        this.init();
    }

    init() {
        this.loadBubbleSound();
        this.addTipCardListeners();
        this.addActivityCardListeners();
        this.createEncouragementBubble();
    }

    /**
     * Load the bubble sound effect
     */
    loadBubbleSound() {
        this.bubbleSound = new Audio('sons/bubble.mp3');
        this.bubbleSound.volume = 0.3; // Set a moderate volume
        this.bubbleSound.preload = 'auto';
    }

    /**
     * Play bubble sound effect
     */
    playBubbleSound() {
        if (this.bubbleSound) {
            // Reset the audio to beginning and play
            this.bubbleSound.currentTime = 0;
            this.bubbleSound.play().catch(e => {
                console.log('Could not play bubble sound:', e);
            });
        }
    }

    addTipCardListeners() {
        const tipCards = document.querySelectorAll('.tip-card:not(.interactive-card)');
        tipCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                this.handleTipCardClick(card, index);
            });
            // Add cursor pointer style
            card.style.cursor = 'pointer';
        });
    }

    /**
     * Add click listeners to activity cards in the feelings section
     */
    addActivityCardListeners() {
        // Use event delegation since activity cards are dynamically created
        document.addEventListener('click', (e) => {
            if (e.target.closest('.activity-card')) {
                const activityCard = e.target.closest('.activity-card');
                const activityIndex = Array.from(activityCard.parentNode.children).indexOf(activityCard);
                this.handleActivityCardClick(activityCard, activityIndex);
            }
        });
    }

    createEncouragementBubble() {
        // Create the encouragement bubble element
        const bubble = document.createElement('div');
        bubble.id = 'encouragementBubble';
        bubble.className = 'encouragement-bubble hidden';
        
        bubble.innerHTML = `
            <div class="bubble-content">
                <div class="bubble-icon">✨</div>
                <div class="bubble-text"></div>
                <button class="bubble-close" onclick="tipsManager.hideBubble()">×</button>
            </div>
            <div class="bubble-tail"></div>
        `;
        
        document.body.appendChild(bubble);
    }

    handleTipCardClick(card, index) {
        // Play bubble sound
        this.playBubbleSound();
        
        // Add click animation
        this.animateCard(card);
        
        // Show encouragement message after animation
        setTimeout(() => {
            this.showTipEncouragementMessage(index, card);
        }, 300);
    }

    /**
     * Handle activity card click with sound and encouragement
     */
    handleActivityCardClick(card, index) {
        // Play bubble sound
        this.playBubbleSound();
        
        // Add click animation
        this.animateCard(card);
        
        // Show encouragement message after animation with proper timing
        setTimeout(() => {
            this.showActivityEncouragementMessage(card, index);
        }, 400);
    }

    animateCard(card) {
        // Add pulse animation class
        card.classList.add('tip-card-clicked');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            card.classList.remove('tip-card-clicked');
        }, 600);
    }

    showTipEncouragementMessage(tipIndex, cardElement) {
        const messages = [
            {
                icon: '🏠',
                text: 'Quelle belle idée ! Ton petit refuge sera parfait pour te détendre. Prends ton temps pour le créer comme tu l\'aimes. 💕'
            },
            {
                icon: '🧸',
                text: 'C\'est merveilleux ! Les câlins sont magiques pour apaiser le cœur. Serre fort ta peluche, elle est là pour toi. 🤗'
            },
            {
                icon: '🎧',
                text: 'Excellente idée ! Tes écouteurs vont créer une bulle de tranquillité rien que pour toi. Tu mérites cette paix. 🌟'
            },
            {
                icon: '🌬️',
                text: 'Bravo ! Respirer calmement est un super pouvoir. Chaque respiration t\'apporte plus de sérénité. Tu y arrives ! 💙'
            },
            {
                icon: '💡',
                text: 'Parfait ! Une lumière douce va créer une atmosphère apaisante. Ton bien-être est important. ✨'
            },
            {
                icon: '🌿',
                text: 'Formidable ! Toucher des textures douces va calmer tes sens. Prends le temps de savourer ces sensations. 🌸'
            }
        ];

        const message = messages[tipIndex];
        this.displayEncouragementBubble(message, cardElement);
    }

    /**
     * Show encouragement message for activity cards with dynamic content mapping
     */
    showActivityEncouragementMessage(cardElement, activityIndex) {
        // Get the actual activity data from the card
        const activityTitle = cardElement.querySelector('.card-title')?.textContent || '';
        const activityIcon = cardElement.querySelector('.activity-icon')?.textContent || '✨';
        
        // Create personalized message based on activity content
        const message = this.createPersonalizedActivityMessage(activityTitle, activityIcon, activityIndex);
        
        this.displayEncouragementBubble(message, cardElement);
    }

    /**
     * Create personalized encouragement message based on activity content
     */
    createPersonalizedActivityMessage(title, icon, index) {
        // Message templates based on activity keywords
        const messageTemplates = {
            // Rest and relaxation activities
            'sieste': { icon: '😴', text: 'Excellente idée ! Se reposer est essentiel pour recharger ton énergie. Prends tout le temps dont tu as besoin. 💤' },
            'dormir': { icon: '😴', text: 'Parfait ! Un bon sommeil va restaurer ton corps et ton esprit. Dors paisiblement. 🌙' },
            'bain': { icon: '🛁', text: 'Merveilleux ! Un bain chaud va détendre tout ton corps et apaiser ton esprit. Tu mérites ce moment de douceur. 🌸' },
            'boisson': { icon: '🍵', text: 'Quelle belle idée ! Une boisson chaude va te réchauffer de l\'intérieur et te donner de l\'énergie positive. ✨' },
            'thé': { icon: '🍵', text: 'Parfait ! Le thé chaud va t\'apaiser et te réconforter. Savoure chaque gorgée. 🌿' },
            
            // Music and sound activities
            'musique': { icon: '🎵', text: 'Formidable ! La musique va bercer ton cœur et calmer tes pensées. Laisse-toi porter par les mélodies. 🎶' },
            'chanter': { icon: '🎵', text: 'Magnifique ! Chanter libère les émotions et apporte de la joie. Laisse ta voix s\'exprimer ! 🎤' },
            'danser': { icon: '💃', text: 'Fantastique ! Danser permet d\'exprimer ta joie avec tout ton corps. Bouge comme tu le sens ! ✨' },
            'écouter': { icon: '🎧', text: 'Excellente idée ! Écouter de la musique douce va créer une bulle de tranquillité rien que pour toi. 🌟' },
            
            // Creative activities
            'dessiner': { icon: '🎨', text: 'Fantastique ! L\'art et la créativité sont de merveilleux moyens d\'exprimer tes émotions. Laisse libre cours à ton imagination ! 🌈' },
            'colorier': { icon: '🖍️', text: 'Merveilleux ! Les couleurs vont illuminer ton cœur et apaiser ton esprit. Crée quelque chose de beau ! 🌈' },
            'créer': { icon: '🎨', text: 'Bravo ! Créer quelque chose de tes mains va t\'apporter fierté et satisfaction. Tu es un(e) artiste ! ✨' },
            
            // Reading and learning
            'lire': { icon: '📚', text: 'Excellente idée ! Lire peut t\'emmener dans un monde paisible et te faire oublier tes soucis. Bon voyage littéraire ! 📖' },
            'livre': { icon: '📚', text: 'Parfait ! Un bon livre va nourrir ton imagination et t\'offrir une belle évasion. Profite de cette lecture ! 📖' },
            
            // Physical activities
            'respirer': { icon: '🌬️', text: 'Bravo ! Respirer profondément est un super pouvoir. Chaque respiration t\'apporte plus de sérénité. Tu y arrives ! 💙' },
            'bouger': { icon: '🏃', text: 'Formidable ! Bouger va libérer les tensions et te donner de l\'énergie positive. Ton corps te remerciera ! 💪' },
            'sport': { icon: '⚽', text: 'Excellent choix ! Le sport va évacuer le stress et libérer des endorphines. Tu vas te sentir mieux ! 🌟' },
            'taper': { icon: '🥊', text: 'Bonne idée ! Évacuer ta colère de façon saine va t\'aider à retrouver ton calme. Libère cette énergie ! 💨' },
            
            // Social activities
            'parler': { icon: '🗣️', text: 'C\'est merveilleux ! Parler à quelqu\'un de confiance peut soulager ton cœur. Tu n\'es jamais seul(e). 💕' },
            'appeler': { icon: '📞', text: 'Excellente idée ! Partager tes émotions avec quelqu\'un que tu aimes va te faire du bien. 💝' },
            'câlin': { icon: '🤗', text: 'Parfait ! Les câlins sont magiques pour apaiser le cœur. Tu mérites tout cet amour et cette tendresse. 🤗' },
            
            // Nature activities
            'nature': { icon: '🌿', text: 'Quelle belle idée ! La nature a des pouvoirs apaisants magiques. Respire profondément et connecte-toi à sa sérénité. 🌱' },
            'observer': { icon: '👀', text: 'Merveilleux ! Observer la beauté qui t\'entoure va calmer ton esprit et nourrir ton âme. 🌸' },
            
            // Comfort activities
            'peluche': { icon: '🧸', text: 'C\'est merveilleux ! Serrer ta peluche va t\'apporter réconfort et sécurité. Elle est là pour toi. 🤗' },
            'couverture': { icon: '🛌', text: 'Parfait ! T\'enrouler dans une couverture douce va te créer un cocon de sécurité et de chaleur. 💕' },
            'pleurer': { icon: '😢', text: 'C\'est tout à fait normal ! Pleurer aide à évacuer la tristesse et à libérer tes émotions. Prends ton temps. 💙' }
        };
        
        // Find matching template based on activity title keywords
        const titleLower = title.toLowerCase();
        for (const [keyword, template] of Object.entries(messageTemplates)) {
            if (titleLower.includes(keyword)) {
                return template;
            }
        }
        
        // Default encouraging message with the activity's icon
        return {
            icon: icon,
            text: `Bravo ! "${title}" est un excellent choix pour prendre soin de toi. Continue sur cette belle voie ! 💙`
        };
    }

    /**
     * Display the encouragement bubble with given message and position
     */
    displayEncouragementBubble(message, cardElement) {
        const bubble = document.getElementById('encouragementBubble');
        const bubbleText = bubble.querySelector('.bubble-text');
        const bubbleIcon = bubble.querySelector('.bubble-icon');
        
        // Hide any existing bubble first
        bubble.classList.remove('show');
        bubble.classList.add('hidden');
        
        // Small delay to ensure clean transition
        setTimeout(() => {
            // Update bubble content
            bubbleIcon.textContent = message.icon;
            bubbleText.textContent = message.text;
            
            // Position bubble near the clicked card
            this.positionBubble(bubble, cardElement);
            
            // Show bubble with animation
            bubble.classList.remove('hidden');
            bubble.classList.add('show');
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                this.hideBubble();
            }, 8000);
        }, 100);
    }

    positionBubble(bubble, cardElement) {
        const cardRect = cardElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const bubbleHeight = 200; // Approximate bubble height
        const bubbleWidth = 320; // Bubble width from CSS
        
        // Calculate optimal position using viewport coordinates (fixed positioning)
        let bubbleTop, bubbleLeft;
        
        // Try to position above the card first
        const spaceAbove = cardRect.top;
        const spaceBelow = viewportHeight - cardRect.bottom;
        
        if (spaceAbove >= bubbleHeight + 20) {
            // Position above the card
            bubbleTop = cardRect.top - bubbleHeight - 20;
        } else if (spaceBelow >= bubbleHeight + 20) {
            // Position below the card
            bubbleTop = cardRect.bottom + 20;
        } else {
            // Position in the middle of viewport if no space
            bubbleTop = (viewportHeight / 2) - (bubbleHeight / 2);
        }
        
        // Horizontal positioning (centered on card)
        bubbleLeft = cardRect.left + (cardRect.width / 2) - (bubbleWidth / 2);
        
        // Ensure bubble stays within viewport bounds
        const margin = 20;
        bubbleLeft = Math.max(margin, Math.min(bubbleLeft, viewportWidth - bubbleWidth - margin));
        bubbleTop = Math.max(margin, Math.min(bubbleTop, viewportHeight - bubbleHeight - margin));
        
        bubble.style.top = `${bubbleTop}px`;
        bubble.style.left = `${bubbleLeft}px`;
    }

    hideBubble() {
        const bubble = document.getElementById('encouragementBubble');
        bubble.classList.remove('show');
        bubble.classList.add('hidden');
    }
}

// Initialize tips manager when DOM is loaded
let tipsManager = null;

document.addEventListener('DOMContentLoaded', () => {
    tipsManager = new TipsManager();
});