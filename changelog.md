# Changelog - Bulle Sensorielle

Tous les changements notables de ce projet seront documentés dans ce fichier.

## [Version 2.5.1] - 2024-12-22

### 🔧 Enhanced Pause/Play Functionality
- **Smart Global Button State**: The global pause/play bubble now automatically updates based on sound activity:
  - Shows pause icon (⏸️) when any sound starts playing
  - Shows play icon (▶️) when all sounds are stopped
  - Maintains proper state synchronization between individual sound controls and global control
- **Improved User Experience**: Intuitive button behavior that reflects actual audio state
- **State Tracking**: Enhanced sound state management for better reliability

### 🏷️ Interface Updates
- **Button Rename**: Changed "Mandala Rotatif" to "Géométrie vivante" for better clarity

## [Version 2.5.0] - 2024-12-19

### ✨ Nouvelles Fonctionnalités
- **Bouton minuteur 1 minute** : Ajout d'un preset rapide pour des sessions courtes
- **Trois boutons bulle** : Interface complète avec bulles thématiques
  - Bulle thème (haut-gauche) : Basculer entre mode jour/nuit
  - Bulle symbole app (haut-droite) : Affiche l'icône jour/nuit ou dernière icône cliquée
  - Bulle pause/play (bas-droite) : Contrôle global de lecture
- **Suivi des icônes** : La bulle symbole mémorise la dernière icône de son/visuel activée
- **Animations oscillantes** : Toutes les bulles ont l'animation `float` pour un effet vivant

### 🔧 Améliorations Techniques
- Nouvelles fonctions `updateAppIcon()`, `resetAppIcon()`, `setLastClickedIcon()`
- Suivi automatique des icônes dans `activateSound()` et `setVisual()`
- Mise à jour automatique de l'icône app lors du changement de thème
- Gestion d'état `lastClickedIcon` pour la persistance des icônes
- Taille unifiée de 60px pour toutes les bulles

### 🎨 Améliorations Interface
- **Positionnement optimisé** : Bulles aux quatre coins avec espacement cohérent
- **Style unifié** : Dégradés, ombres et animations identiques pour toutes les bulles
- **Animations fluides** : Effet `float` sur toutes les bulles pour dynamisme
- **Feedback visuel** : Messages mascotte pour interactions utilisateur
- **Accessibilité** : Titres et labels appropriés pour tous les boutons

### 🐛 Corrections
- Correction de la visibilité du bouton pause global
- Amélioration de la gestion des événements de clic
- Optimisation des sélecteurs CSS pour les icônes

## [Version 2.4.0] - 2024-12-19

### ✨ Nouvelles Fonctionnalités
- **Arrêt automatique au minuteur** : Les sons et visuels s'arrêtent automatiquement à la fin du minuteur
- **Bouton pause/play global** : Nouveau bouton bulle flottant pour contrôler tous les sons et visuels
- **Lecture continue par défaut** : Sons et visuels fonctionnent en continu jusqu'à arrêt manuel ou fin de minuteur
- **Contrôle unifié** : Pause et reprise simultanée de tous les éléments actifs

### 🔧 Améliorations Techniques
- Ajout des fonctions `stopAllVisuals()`, `pauseAllSounds()`, `resumeAllSounds()`
- Système de pause global avec états `visualsPaused` et `globalPaused`
- Intégration du contrôle de pause dans la boucle d'animation des visuels
- Gestion améliorée des états de lecture/pause pour tous les médias

### 🎨 Améliorations Interface
- Bouton pause/play flottant avec design bulle moderne
- Gradient animé et effets hover pour le bouton de contrôle
- Positionnement fixe en bas à droite pour accès facile
- Icônes dynamiques (⏸️/▶️) selon l'état de lecture

### 🐛 Corrections
- **CSS Vendor Prefix** : Ajout de la propriété standard `appearance` pour compatibilité
- Correction de la gestion des sons avec la nouvelle structure Set
- Amélioration de la robustesse du système de pause/reprise

## [Version 2.3.0] - 2024-12-19

### Ajouté
- **Améliorations majeures des visuels apaisants** :
  - Respiration Guidée avec synchronisation parfaite (cycle 8s) et transitions fluides
  - Pluie d'Étoiles redessinée avec ciel nocturne, 80 étoiles scintillantes et étoiles filantes
  - Mandala Rotatif hypnotisant avec 4 couches rotatives et géométrie sacrée
  - Gradients dynamiques et effets de lueur pour tous les visuels
- **Optimisations techniques** pour les animations complexes et performances améliorées

## [Version 2.2.0] - 2024-12-19

### Ajouté
- **Animations d'icônes** : Chaque son dispose maintenant d'une animation unique et apaisante lors de sa lecture
  - Animations spécialement conçues pour être amusantes et relaxantes pour les enfants
  - Animations personnalisées pour chaque catégorie de sons :
    - Bruits ambiants : vagues, floraison, balancement
    - Sons de la nature : danse d'arbre, gouttes de pluie, scintillement de feu, ronronnement
    - Mélodies : touches de piano, mouvement de casque, flottement endormi, rythme de marche
- Système d'animation automatique déclenchée lors du démarrage/arrêt des sons

### Technique
- Ajout de 12 animations CSS personnalisées avec keyframes
- Intégration des fonctions `startIconAnimation()` et `stopIconAnimation()` dans le système audio
- Animations fluides avec transitions CSS pour une expérience utilisateur optimale

## [Version 2.1.0] - 2024-12-19

### Ajouté
- Ajout des mélodies "Berceuse" et "Ballade" en complément des mélodies existantes
- Génération de fichiers audio fonctionnels pour "Berceuse" et "Ballade" avec FFmpeg
- Restauration des mélodies "Piano Doux" et "Lo-Fi Calme" précédemment supprimées
- Mise à jour de la documentation pour refléter les quatre mélodies disponibles

### Modifié
- Section "Mélodies Douces" maintenant avec quatre options : Piano Doux, Lo-Fi Calme, Berceuse, Ballade
- Correction de l'organisation des contrôles dans l'interface utilisateur

### Corrigé
- Problème de lecture des nouveaux sons "Berceuse" et "Ballade"
- Placement incorrect des contrôles dans la section "Bruits Ambiants"

## [1.0.0] - 2024-12-19

- Ajout de sons de la nature basés sur des fichiers audio (campagne, forêt, océan, pluie, chat, feu) en remplacement des sons synthétisés.
- Ajout de nouvelles mélodies (Berceuse, Ballade) basées sur des fichiers audio en complément des mélodies synthétisées existantes (Piano Doux, Lo-Fi Calme).
- Restauration des mélodies Piano Doux et Lo-Fi Calme originales.
- Génération automatique de fichiers audio fonctionnels pour Berceuse et Ballade.
- Compatibilité Chrome : Initialisation audio sur interaction utilisateur.

### ✅ Terminé (Done)

#### 🏗️ Architecture de Base
- ✅ Structure HTML5 sémantique et accessible
- ✅ Système de navigation par sections (SPA)
- ✅ Design responsive mobile-first
- ✅ Variables CSS pour gestion des thèmes
- ✅ Architecture JavaScript modulaire avec classe principale

#### 🎨 Interface Utilisateur
- ✅ Palette de couleurs pastel apaisante
- ✅ Typographie Nunito arrondie et lisible
- ✅ Thème clair par défaut avec couleurs douces
- ✅ Thème sombre (mode nuit) à faible contraste
- ✅ Boutons-icônes larges et facilement cliquables
- ✅ Animations et transitions douces (fade-in/fade-out)
- ✅ Design minimaliste sans surcharge visuelle

#### 🎭 Mascotte et Guidage
- ✅ Mascotte bulle endormie (🌙) en position fixe
- ✅ Messages contextuels selon la section active
- ✅ Apparition douce des messages au survol
- ✅ Conseils visuels simples et encourageants

#### 🎵 Système Audio (Mixeur Sonore)
- ✅ Intégration de Tone.js pour synthèse audio avancée
- ✅ Générateurs de bruits ambiants (blanc, rose, brun)
- ✅ Sons de nature avec fichiers audio :
  - ✅ Pluie douce (rain.mp3)
  - ✅ Vagues calmes (ocean.mp3)
  - ✅ Feu de camp (feu.mp3)
  - ✅ Forêt d'été (forest.mp3)
  - ✅ Ronronnement de chat (chat.mp3)
  - ✅ Campagne paisible (campagne.mp3)
- ✅ Mélodies douces automatiques :
  - ✅ Piano doux avec patterns harmoniques
  - ✅ Lo-fi calme avec synthèse triangle
- ✅ Contrôles de volume individuels (0-100%)
- ✅ Conversion volume linéaire vers échelle décibel
- ✅ Superposition de plusieurs sons simultanés
- ✅ Boutons on/off visuels pour chaque son
- ✅ Lecture exclusive : un seul son à la fois (nouveau)
- ✅ Mise en évidence visuelle du son en cours de lecture
- ✅ Son de vent apaisant ajouté (audio file)

#### ✨ Générateur Visuel Apaisant
- ✅ Système de rendu Canvas avec requestAnimationFrame
- ✅ Quatre visuels apaisants :
  - ✅ **Respiration Guidée** : Cercle pulsant au rythme respiratoire
  - ✅ **Couleurs Flottantes** : Dégradés pastel en mouvement organique
  - ✅ **Pluie d'Étoiles** : Particules lumineuses dérivant doucement
  - ✅ **Mandala Rotatif** : Géométrie sacrée en rotation lente
- ✅ Un seul visuel affiché à la fois (pas de surcharge)
- ✅ Sélection facile via boutons dédiés
- ✅ Canvas responsive s'adaptant à la taille d'écran

#### ⏰ Minuteur de Pause Sensorielle
- ✅ Interface visuelle avec cercle de progression
- ✅ Durées prédéfinies (2, 5, 10 minutes)
- ✅ Champ pour durée personnalisée (1-60 minutes)
- ✅ Contrôles start/pause/stop fonctionnels
- ✅ Affichage temps restant en format MM:SS
- ✅ Progression visuelle avec dégradé conic-gradient
- ✅ Alerte de fin douce :
  - ✅ Son harmonique non surprenant (note C5 douce)
  - ✅ Animation de respiration du cercle
  - ✅ Message encourageant de la mascotte

#### 💾 Système de Profils (Mes Bulles)
- ✅ Sauvegarde complète de l'état actuel :
  - ✅ Sons actifs et leurs volumes
  - ✅ Visuel sélectionné
  - ✅ Durée du minuteur
  - ✅ Date de création
- ✅ Nommage personnalisé des profils
- ✅ Stockage local avec localStorage
- ✅ Interface de gestion :
  - ✅ Cartes visuelles pour chaque profil
  - ✅ Boutons charger/supprimer
  - ✅ Confirmation avant suppression
- ✅ Chargement instantané des configurations
- ✅ Aperçu des profils sur l'écran d'accueil

#### 💡 Section Conseils (Mon Coin Tranquille)
- ✅ Six conseils pratiques illustrés :
  - ✅ Création d'espace personnel (cabane)
  - ✅ Câlins réconfortants (peluches)
  - ✅ Écouteurs anti-bruit
  - ✅ Techniques de respiration
  - ✅ Éclairage doux
  - ✅ Objets texturés apaisants
- ✅ Cartes visuelles avec icônes expressives
- ✅ Descriptions simples et actionables
- ✅ Layout en grille responsive

#### 🌙 Gestion des Thèmes
- ✅ Basculement fluide entre thème clair/sombre
- ✅ Persistance du choix utilisateur
- ✅ Variables CSS pour cohérence des couleurs
- ✅ Icône de toggle contextuelle (🌙/☀️)
- ✅ Adaptation automatique de tous les composants

#### 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Breakpoints pour tablettes et mobiles
- ✅ Navigation adaptée aux petits écrans
- ✅ Redimensionnement automatique du canvas
- ✅ Réorganisation des grilles sur mobile
- ✅ Mascotte repositionnée sur mobile

#### ♿ Accessibilité
- ✅ Aria-labels pour les boutons interactifs
- ✅ Navigation clavier possible
- ✅ Contrastes respectant les standards WCAG
- ✅ Tailles de police suffisamment grandes
- ✅ Animations non agressives pour les sensibilités

#### 📚 Documentation
- ✅ README.md complet avec :
  - ✅ Description détaillée du projet
  - ✅ Guide d'installation et d'utilisation
  - ✅ Documentation technique
  - ✅ Informations sur l'accessibilité
- ✅ Commentaires de code détaillés
- ✅ Structure de fichiers claire

---

## 🔄 À Faire (To Do)

### 🎵 Améliorations Audio
- [ ] **Nouveaux Sons de Nature** :
  - [ ] Vent dans les arbres
  - [ ] Ruisseau qui coule
  - [ ] Chants de baleines
  - [ ] Grillons nocturnes
- [ ] **Mélodies Additionnelles** :
  - [ ] Harpe celtique
  - [ ] Bols tibétains
  - [ ] Carillon éolien
- [ ] **Contrôles Avancés** :
  - [ ] Égaliseur simple (graves/aigus)
  - [ ] Effets de réverbération
  - [ ] Fade-in/fade-out automatique

### ✨ Nouveaux Visuels
- [ ] **Aquarium Virtuel** : Poissons nageant lentement
- [ ] **Jardin Zen** : Sable avec motifs qui se dessinent
- [ ] **Nuages Dérivants** : Formations nuageuses en mouvement
- [ ] **Fractales Douces** : Motifs mathématiques apaisants
- [ ] **Particules Interactives** : Réaction au mouvement de souris

### ⏰ Fonctionnalités Minuteur
- [ ] **Intervalles Programmés** : Alternance travail/pause
- [ ] **Sons de Transition** : Alertes à mi-parcours
- [ ] **Historique des Sessions** : Suivi du temps de relaxation
- [ ] **Objectifs Quotidiens** : Encouragement à la régularité

### 💾 Améliorations Profils
- [ ] **Export/Import** : Partage de profils entre appareils
- [ ] **Catégorisation** : Organisation par humeur/activité
- [ ] **Profils Temporels** : Configurations selon l'heure
- [ ] **Favoris** : Marquage des profils les plus utilisés
- [ ] **Statistiques** : Fréquence d'utilisation des profils

### 🎮 Interactivité Avancée
- [ ] **Mode Guidé** : Séances de relaxation dirigées
- [ ] **Réactivité Biométrique** : Adaptation selon le rythme cardiaque
- [ ] **Contrôle Gestuel** : Navigation par mouvements
- [ ] **Reconnaissance Vocale** : Commandes simples

### 🌐 Fonctionnalités Web
- [ ] **PWA (Progressive Web App)** :
  - [ ] Installation sur l'écran d'accueil
  - [ ] Fonctionnement hors ligne
  - [ ] Notifications push douces
- [ ] **Service Worker** : Cache des ressources
- [ ] **Web Share API** : Partage de profils

### 🎨 Améliorations Visuelles
- [ ] **Thèmes Saisonniers** : Couleurs selon la période
- [ ] **Personnalisation Avancée** :
  - [ ] Choix de couleurs personnalisées
  - [ ] Upload d'images de fond
  - [ ] Création de dégradés custom
- [ ] **Animations WebGL** : Visuels plus complexes et fluides
- [ ] **Mode Plein Écran** : Immersion totale

### 🧠 Intelligence Adaptative
- [ ] **Apprentissage des Préférences** :
  - [ ] Suggestions automatiques
  - [ ] Adaptation selon l'heure
  - [ ] Recommandations personnalisées
- [ ] **Détection d'Humeur** : Adaptation selon le contexte
- [ ] **Progression Tracking** : Suivi du bien-être

### 👥 Fonctionnalités Sociales
- [ ] **Profils Familiaux** : Gestion multi-utilisateurs
- [ ] **Partage Sécurisé** : Envoi de configurations apaisantes
- [ ] **Communauté** : Bibliothèque de profils partagés

### 🔧 Optimisations Techniques
- [ ] **Performance** :
  - [ ] Web Workers pour audio
  - [ ] Lazy loading des ressources
  - [ ] Optimisation des animations Canvas
- [ ] **Compatibilité** :
  - [ ] Support navigateurs plus anciens
  - [ ] Fallbacks pour fonctionnalités avancées
- [ ] **Tests** :
  - [ ] Tests unitaires JavaScript
  - [ ] Tests d'accessibilité automatisés
  - [ ] Tests de performance

### 📱 Applications Natives
- [ ] **Application Mobile** :
  - [ ] Version React Native
  - [ ] Intégration capteurs (accéléromètre)
  - [ ] Notifications locales
- [ ] **Application Desktop** :
  - [ ] Version Electron
  - [ ] Raccourcis clavier globaux
  - [ ] Intégration système

### 🎓 Contenu Éducatif
- [ ] **Guide Parents/Éducateurs** :
  - [ ] Conseils d'utilisation
  - [ ] Explication des bénéfices
  - [ ] Intégration dans routines
- [ ] **Ressources Pédagogiques** :
  - [ ] Fiches explicatives
  - [ ] Vidéos de démonstration
  - [ ] Formation à l'auto-régulation

### 🔒 Sécurité et Confidentialité
- [ ] **Chiffrement Local** : Protection des données sensibles
- [ ] **Mode Invité** : Utilisation sans sauvegarde
- [ ] **Contrôle Parental** : Limitations d'usage
- [ ] **Audit de Sécurité** : Vérification des vulnérabilités

---

## 📋 Backlog Priorisé

### 🔥 Priorité Haute (Prochaine Version)
1. **PWA Implementation** - Installation et mode hors ligne
2. **Nouveaux Sons Nature** - Expansion bibliothèque audio
3. **Export/Import Profils** - Partage entre appareils
4. **Mode Guidé** - Séances dirigées

### 🔶 Priorité Moyenne
1. **Visuels Additionnels** - Aquarium et jardin zen
2. **Thèmes Saisonniers** - Adaptation temporelle
3. **Statistiques d'Usage** - Suivi bien-être
4. **Optimisations Performance** - Web Workers

### 🔵 Priorité Basse
1. **Applications Natives** - Mobile et desktop
2. **IA Adaptative** - Apprentissage préférences
3. **Fonctionnalités Sociales** - Communauté
4. **Contrôles Biométriques** - Intégration capteurs

---

## 🐛 Bugs Connus

### 🔧 À Corriger
- [ ] **Audio** : Léger délai au premier clic sur mobile (nécessite interaction utilisateur)
- [ ] **Canvas** : Redimensionnement parfois imprécis lors de rotation d'écran
- [ ] **Timer** : Animation du cercle peut se désynchroniser sur onglets inactifs

### ✅ Corrigés
- ✅ **Navigation** : Sections ne s'affichaient pas correctement sur Safari
- ✅ **Thème** : Variables CSS non supportées sur anciens navigateurs
- ✅ **LocalStorage** : Gestion d'erreur si quota dépassé

---

## 📊 Métriques de Développement

### 📈 Statistiques Actuelles
- **Lignes de Code** : ~2000 lignes
- **Fichiers** : 4 fichiers principaux
- **Taille** : ~150KB total
- **Dépendances** : 1 (Tone.js)
- **Compatibilité** : 95% navigateurs modernes

### 🎯 Objectifs Techniques
- **Performance** : <3s temps de chargement
- **Accessibilité** : Score WCAG AA
- **Mobile** : 100% fonctionnalités disponibles
- **Hors ligne** : Fonctionnement complet sans réseau

---

*Dernière mise à jour : 19 décembre 2024*