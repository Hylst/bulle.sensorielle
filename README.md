# Bulle Sensorielle - Application Web de Sanctuaire Numérique

## 🌟 Description

**Bulle Sensorielle** est une application web monopage (SPA) conçue spécifiquement pour les enfants de 6 à 12 ans ayant des sensibilités sensorielles (TSA, TDAH). Cette application offre un sanctuaire numérique apaisant et interactif, mettant l'accent sur la simplicité d'utilisation, une esthétique douce et engageante, et la personnalisation non intrusive.

## 🎯 Objectifs

- Créer un environnement numérique sécurisant et apaisant
- Offrir des outils sensoriels personnalisables
- Favoriser l'autonomie et l'auto-régulation
- Proposer une interface intuitive adaptée aux enfants

## ✨ Fonctionnalités Principales

### 🎵 Mixeur Sonore
- **Bruits Ambiants** : Bruit blanc, rose, brun
- **Sons de la Nature** : Pluie douce, vagues calmes, feu de camp, forêt d'été, ronronnement de chat
- **Mélodies Douces** : Piano doux, musique lo-fi, Berceuse, Ballade
- Contrôles de volume individuels pour chaque son
- Possibilité de superposer plusieurs sons

### ✨ Générateur Visuel Apaisant
- **Respiration Guidée** : Cercle qui s'agrandit et se rétrécit au rythme de la respiration
- **Couleurs Flottantes** : Dégradés de couleurs pastel en mouvement organique
- **Pluie d'Étoiles** : Particules lumineuses dérivant doucement
- **Mandala Rotatif** : Mandala simple en rotation lente

### ⏰ Minuteur de Pause Sensorielle
- Durées prédéfinies (2, 5, 10 minutes)
- Durée personnalisée
- Visualisation progressive avec cercle qui se remplit
- Alerte de fin douce et non surprenante

### 💾 Mes Bulles (Profils Sensoriels)
- Sauvegarde des combinaisons préférées
- Nommage personnalisé des profils
- Chargement rapide des configurations
- Stockage local (localStorage)

### 💡 Section Conseils
- Idées pour aménager l'environnement physique
- Techniques de relaxation
- Conseils pratiques illustrés

### 🌙 Thèmes
- **Mode Jour** : Couleurs pastel douces
- **Mode Nuit** : Palette sombre à faible contraste
- Basculement facile entre les thèmes

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles responsives avec variables CSS
- **JavaScript ES6+** : Logique applicative vanilla
- **Tone.js** : Synthèse et gestion audio avancée
- **Canvas API** : Animations visuelles fluides
- **LocalStorage** : Persistance des données

## 🎨 Design & UX

### Palette de Couleurs
- **Couleurs Pastel** : Bleu ciel, lavande, vert d'eau, pêche, rose poudré
- **Thème Sombre** : Tons bleus foncés avec accents colorés doux

### Typographie
- **Police** : Nunito (Google Fonts)
- **Caractéristiques** : Arrondie, sans-serif, très lisible
- **Tailles** : Grandes pour faciliter la lecture

### Interface
- **Design Minimaliste** : Épuré et non distrayant
- **Gros Boutons** : Facilement cliquables
- **Icônes Émojis** : Universelles et expressives
- **Animations Douces** : Transitions lentes et apaisantes

### Mascotte
- **Personnage Guide** : Bulle endormie (🌙)
- **Messages Contextuels** : Conseils et encouragements
- **Interaction Discrète** : Apparition au survol

## 🚀 Installation et Utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Connexion internet (pour les polices Google Fonts et Tone.js CDN)

### Installation
1. Clonez ou téléchargez le projet
2. Ouvrez `index.html` dans votre navigateur
3. L'application est prête à utiliser !

### Utilisation
1. **Navigation** : Utilisez les boutons de navigation pour explorer les sections
2. **Sons** : Cliquez sur les boutons de sons pour les activer/désactiver
3. **Volumes** : Ajustez les curseurs pour personnaliser l'intensité
4. **Visuels** : Sélectionnez le visuel qui vous apaise le plus
5. **Minuteur** : Choisissez une durée et lancez votre pause
6. **Sauvegarde** : Enregistrez vos combinaisons préférées

## 📱 Compatibilité

### Navigateurs Supportés
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Appareils
- **Desktop** : Expérience optimale
- **Tablettes** : Interface adaptée
- **Smartphones** : Design responsive

## 🔧 Architecture Technique

### Structure des Fichiers
```
BulleSensorielle V2/
├── index.html          # Structure HTML principale
├── styles.css          # Styles CSS avec variables de thème
├── script.js           # Logique JavaScript principale
├── README.md           # Documentation
└── changelog.md        # Historique des modifications
```

### Classes JavaScript Principales
- **BulleSensorielle** : Classe principale de l'application
- **Gestion Audio** : Synthétiseurs Tone.js pour chaque type de son
- **Animations Visuelles** : Rendu Canvas avec requestAnimationFrame
- **Gestion d'État** : Sauvegarde localStorage des profils

### Fonctionnalités Audio
- **Générateurs de Bruit** : Blanc, rose, brun avec Tone.Noise
- **Sons Naturels** : Filtres et LFO pour simuler la nature
- **Mélodies** : Patterns automatiques avec PolySynth
- **Contrôle Volume** : Conversion linéaire vers échelle décibel

### Animations Visuelles
- **Respiration** : Sinusoïde pour simulation du souffle
- **Couleurs** : Mouvements organiques avec fonctions trigonométriques
- **Étoiles** : Système de particules simple
- **Mandala** : Rotation et répétition géométrique

## 🎯 Public Cible

### Utilisateurs Principaux
- **Enfants 6-12 ans** avec sensibilités sensorielles
- **TSA** (Troubles du Spectre Autistique)
- **TDAH** (Trouble Déficitaire de l'Attention avec Hyperactivité)
- **Hypersensibilités sensorielles**

### Contextes d'Utilisation
- **Domicile** : Moments de détente et auto-régulation
- **École** : Pauses sensorielles en classe
- **Thérapie** : Outil complémentaire en séances
- **Transitions** : Aide lors de changements d'activité

## 🔒 Sécurité et Confidentialité

- **Aucune Collecte de Données** : Tout reste local
- **Pas de Connexion Serveur** : Application entièrement côté client
- **Stockage Local** : Données sauvegardées uniquement sur l'appareil
- **Pas de Cookies** : Respect de la vie privée

## 🌐 Accessibilité

### Conformité WCAG
- **Contraste** : Ratios respectés pour la lisibilité
- **Navigation Clavier** : Tous les éléments accessibles
- **Aria Labels** : Descriptions pour lecteurs d'écran
- **Tailles de Police** : Suffisamment grandes

### Adaptations Sensorielles
- **Animations Contrôlées** : Pas de mouvements brusques
- **Sons Doux** : Volumes modérés par défaut
- **Couleurs Apaisantes** : Palette non agressive
- **Interface Simple** : Pas de surcharge cognitive

## 🔄 Évolutions Futures

### Fonctionnalités Envisagées
- **Nouveaux Sons** : Expansion de la bibliothèque audio
- **Visuels Additionnels** : Plus d'options d'animation
- **Profils Avancés** : Paramètres plus fins
- **Mode Hors Ligne** : Fonctionnement sans internet
- **Export/Import** : Partage de profils

### Améliorations Techniques
- **PWA** : Installation comme application native
- **Web Workers** : Optimisation des performances
- **WebGL** : Visuels plus complexes
- **Web Audio API** : Sons plus réalistes

## 🤝 Contribution

Ce projet est conçu pour être simple et accessible. Les contributions sont les bienvenues pour :
- Améliorer l'accessibilité
- Ajouter de nouveaux sons ou visuels
- Optimiser les performances
- Corriger des bugs
- Améliorer la documentation

## 📄 Licence

Ce projet est développé dans un but éducatif et thérapeutique. Il est libre d'utilisation pour des fins non commerciales.

## 📞 Support

Pour toute question ou suggestion concernant l'application, n'hésitez pas à ouvrir une issue ou à contribuer au projet.

---

*Développé avec 💙 pour le bien-être des enfants ayant des sensibilités sensorielles.*