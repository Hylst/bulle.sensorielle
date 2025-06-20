# Changelog - Bulle Sensorielle

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/spec/v2.0.0.html).

## [2.11.1] - 2024-12-25

### 🧹 NETTOYAGE - Suppression de Code Obsolète

#### ✅ Suppression de styles-old.css
- **SUPPRIMÉ** : `styles-old.css` (2728 lignes obsolètes)
- **Impact** : Réduction significative de la taille du projet
- **Risque** : Aucun - fichier obsolète sans références actives
- **Vérification** : Aucune référence trouvée dans le code actif
- **Bénéfices** :
  - Nettoyage du répertoire de travail
  - Élimination de la confusion entre anciens et nouveaux styles
  - Réduction de la complexité du projet

#### ✅ Optimisation des Imports CSS
- **SUPPRIMÉ** : `styles-backup.css` (fichier de sauvegarde redondant)
- **OPTIMISÉ** : Structure d'imports CSS dans `main.css`
- **VÉRIFICATION** : Aucun import redondant détecté
- **Impact** : Réduction du temps de chargement et élimination des conflits
- **Structure optimale confirmée** :
  ```
  main.css → 9 modules CSS dans l'ordre correct
  ├── _variables.css (variables CSS)
  ├── _base.css (reset et styles de base)
  ├── _layout.css (mise en page)
  ├── _navigation.css (navigation)
  ├── _components.css (composants)
  ├── _sections.css (sections)
  ├── _animations.css (animations)
  ├── _responsive.css (responsive)
  └── _utilities.css (utilitaires)
  ```
- **Bénéfices** :
  - Cascade CSS optimale respectée
  - Aucune duplication d'imports
  - Chargement efficace des styles
  - Maintenabilité améliorée

#### ✅ Suppression du Bouton 'Test Audio'
- **SUPPRIMÉ** : Bouton 'Test Audio' de la page d'accueil
- **Fichier modifié** : `index.html` (lignes 217-219)
- **Impact** : Interface plus propre et professionnelle
- **Bénéfices** :
  - Suppression d'un élément de débogage en production
  - Interface utilisateur simplifiée
  - Réduction du code HTML

#### ✅ Nettoyage des Variables Globales
- **ENCAPSULÉ** : `window.audioManager` et `window.appInstance`
- **CRÉÉ** : Namespace `BulleSensorielleApp` avec pattern d'encapsulation
- **MODIFIÉS** : Tous les fichiers JS utilisant les variables globales
- **Fichiers mis à jour** :
  - `script.js` : Création du namespace et suppression des variables globales
  - `feelings.js` : Migration vers `BulleSensorielleApp.showMascotMessage()`
  - `timer.js` : Migration vers `BulleSensorielleApp.getAudioManager()`
  - `profiles.js` : Migration vers `BulleSensorielleApp.getAudioManager()`
  - `navigation.js` : Migration vers les méthodes encapsulées
- **Nouvelle API** :
  ```javascript
  BulleSensorielleApp.getInstance()        // Accès à l'instance
  BulleSensorielleApp.getAudioManager()    // Accès à AudioManager
  BulleSensorielleApp.navigateToSection()  // Navigation
  BulleSensorielleApp.showMascotMessage()  // Messages mascotte
  ```
- **Bénéfices** :
  - Meilleure encapsulation et sécurité
  - Réduction de la pollution du scope global
  - API plus claire et contrôlée
  - Facilite les tests et la maintenance

#### ✅ Vérification des Conventions de Nommage
- **ANALYSÉ** : Cohérence des conventions dans tout le codebase
- **CONFIRMÉ** : Conventions déjà optimales
  - **HTML** : kebab-case pour les attributs data (data-sound, data-visual)
  - **JavaScript** : camelCase pour variables et fonctions
  - **CSS** : kebab-case pour les classes et IDs
- **Résultat** : Aucune modification nécessaire, conventions déjà standardisées

---

## [2.11.0] - 2024-12-25

### 🔍 ANALYSE COMPLÈTE DE L'APPLICATION - Audit de Code et Refactorisation

#### 📊 PROBLÈMES IDENTIFIÉS

##### 🚨 CRITIQUE - Fichiers Volumineux (>600 lignes)
- **`script.js`** : 1843 lignes - NÉCESSITE REFACTORISATION URGENTE
  - Classe monolithique `BulleSensorielle` avec trop de responsabilités
  - Mélange de logique métier, UI et gestion d'état
  - Méthodes de rendu visuel (400+ lignes) à extraire
- **`js/managers/AudioManager.js`** : 1138 lignes - PARTIELLEMENT MODULAIRE
  - Bonne séparation mais encore trop volumineux
  - Logique de création de sons à séparer
- **`styles-old.css`** : 2728 lignes - FICHIER OBSOLÈTE À SUPPRIMER
- **`css/_animations.css`** : 815 lignes - À DIVISER PAR CATÉGORIES
- **`index.html`** : 607 lignes - STRUCTURE COMPLEXE À SIMPLIFIER

##### ⚠️ MAJEUR - Duplication et Conflits de Code
- **Double implémentation AudioManager** :
  - `js/audio.js` (523 lignes) - ANCIEN SYSTÈME
  - `js/managers/AudioManager.js` (1138 lignes) - NOUVEAU SYSTÈME
  - **CONFLIT RÉSOLU** : Ancien système supprimé, nouveau système utilisé
- **Gestionnaires multiples non coordonnés** :
  - NavigationManager, ProfilesManager, TimerManager, VisualsManager
  - Pas de système de communication inter-modules
  - Dépendances circulaires potentielles

##### 🔧 MODÉRÉ - Problèmes de Structure
- **Initialisation non coordonnée** : Chaque module s'initialise indépendamment
- **Variables globales** : `window.audioManager`, `appInstance` exposées globalement
- **Gestion d'état dispersée** : État partagé entre plusieurs classes
- **Pas de système d'événements centralisé**
- **CSS redondant** : Multiples fichiers de styles avec chevauchements

#### 📋 RECOMMANDATIONS DE REFACTORISATION

##### 🎯 PRIORITÉ 1 - Refactorisation de script.js (1843 lignes)
```
📁 Nouvelle structure proposée :
├── core/
│   ├── Application.js (orchestrateur principal)
│   ├── EventBus.js (système d'événements centralisé)
│   └── StateManager.js (gestion d'état globale)
├── ui/
│   ├── VisualRenderer.js (animations canvas)
│   ├── ThemeManager.js (gestion thèmes)
│   └── UIController.js (interactions UI)
├── managers/ (existant, à améliorer)
│   ├── AudioManager.js (à optimiser)
│   ├── NavigationManager.js
│   └── ...
```

##### 🎯 PRIORITÉ 2 - Optimisation AudioManager (1138 lignes)
- **Séparer** la logique de création de sons
- **Extraire** les générateurs Tone.js dans des modules dédiés
- **Créer** des factories pour les différents types de sons

##### 🎯 PRIORITÉ 3 - Architecture Modulaire
- Implémenter un EventBus pour la communication inter-modules
- Créer un StateManager centralisé
- Définir des interfaces claires entre modules

##### 🎯 PRIORITÉ 4 - Nettoyage CSS
- **Consolider** les fichiers CSS redondants
- **Diviser** `_animations.css` par catégories d'animations
- **Supprimer** `styles-old.css` obsolète

#### 🧹 NETTOYAGE NÉCESSAIRE
- **SUPPRIMER** : `styles-old.css` (2728 lignes obsolètes)
- **RÉVISER** : Toutes les variables globales
- **OPTIMISER** : Imports CSS redondants
- **SIMPLIFIER** : Structure HTML complexe

#### 📈 MÉTRIQUES DE QUALITÉ
- **Complexité cyclomatique** : Élevée dans script.js
- **Couplage** : Fort entre modules
- **Cohésion** : Faible dans les gros fichiers
- **Maintenabilité** : Difficile avec les fichiers >1000 lignes

#### 🎯 OBJECTIFS DE REFACTORISATION
1. **Réduire** la taille des fichiers à <500 lignes
2. **Améliorer** la séparation des responsabilités
3. **Implémenter** un système d'événements centralisé
4. **Optimiser** les performances et la maintenabilité
5. **Standardiser** l'architecture modulaire

---

## [2.10.0] - 2024-12-25

### 🎛️ MAJOR: Volume Control System Overhaul (FINALLY WORKING!)
- **Fixed volume slider event conflicts** (after 18 attempts!):
  - Volume sliders no longer trigger sound activation when adjusted
  - Fixed event propagation issues between volume controls and sound buttons
  - Added proper event isolation with `stopPropagation()` and `preventDefault()`
  - Improved CSS selectors to target only `.sound-btn[data-sound]` instead of all `[data-sound]` elements
- **Enhanced volume persistence and loading**:
  - Fixed localStorage volume loading with proper null checks and fallback to 50%
  - Volume preferences now properly applied to sounds during initialization
  - Improved volume conversion for Tone.js objects (percentage → linear → decibels)
  - Added immediate volume application to currently playing sounds
- **Improved volume control UX**:
  - Volume changes now apply instantly without requiring sound restart
  - Better visual feedback with real-time percentage display updates
  - Added event listeners to `.volume-control` containers to prevent unwanted interactions
  - Enhanced logging for volume operations and debugging
- **Technical improvements**:
  - Separated volume slider initialization from sound button setup
  - Added comprehensive event handling for click, mousedown, and input events
  - Improved error handling for missing sounds during volume operations
  - Better memory management with proper volume state tracking
- **Files modified**:
  - `js/managers/AudioManager.js`: Complete volume control system rewrite

## [2.9.9] - 2024-12-25

### 🔧 Critical Audio Initialization Timing Fix
- **Fixed asynchronous initialization synchronization**:
  - AudioManager constructor now properly handles async initialization
  - Added `waitForInitialization()` method to ensure complete setup before use
  - Fixed timing issues where main application proceeded before AudioManager was ready
  - Resolved race conditions between audio object creation and DOM element access
- **Enhanced DOM readiness handling**:
  - Added `document.readyState` checks before accessing DOM elements
  - Separated volume slider initialization with proper DOM timing
  - Fixed premature access to volume controls before DOM was ready
  - Added comprehensive logging for initialization process tracking
- **Improved initialization architecture**:
  - Implemented promise-based initialization waiting system
  - Better error handling during async initialization phases
  - Ensured proper sequencing of audio setup, volume controls, and event binding
- **Files modified**:
  - `script.js`: Added proper await for AudioManager initialization
  - `js/managers/AudioManager.js`: Added initialization synchronization methods

## [2.9.8] - 2024-12-25

### 🔧 Critical Volume Control Fix for Tone.js Objects
- **Fixed volume initialization for synthesized sounds**:
  - Tone.js objects (white-noise, pink-noise, brown-noise, piano, lofi) now properly load saved volume from localStorage
  - Replaced hardcoded defaultVolumes with dynamic volume loading during object creation
  - Fixed volume conversion from percentage to decibels for Tone.js compatibility
  - Added comprehensive logging for volume initialization and changes
- **Enhanced volume debugging**:
  - Added detailed console logging for volume slider events
  - Added sound object existence validation during volume changes
  - Added debugAudioObjects() method for troubleshooting audio objects
  - Improved error handling for missing sounds during volume operations
- **Volume persistence improvements**:
  - Ensured all Tone.js objects respect saved volume preferences on initialization
  - Fixed disconnect between slider position and actual audio volume
  - Proper decibel conversion: percentage → linear → decibels for Tone.js
- **Files modified**:
  - `js/managers/AudioManager.js`: Fixed volume initialization and added debugging

## [2.9.7] - 2024-12-25

### 🔧 Audio Event Listeners Duplication Fix
- **Resolved duplicate event listeners causing audio malfunction**:
  - Removed duplicate sound button event listeners from `script.js`
  - Removed duplicate volume slider event listeners from `script.js`
  - Audio control now exclusively managed by `AudioManager.js`
  - Fixed issue where sounds would toggle on/off immediately due to double event firing
  - Improved audio system reliability and user experience
- **Enhanced audio architecture**:
  - Clean separation of audio event handling responsibilities
  - Single source of truth for audio button and volume control events
  - Eliminated conflicting event listeners between modules
- **Files modified**:
  - `script.js`: Removed duplicate audio event listeners
  - `js/managers/AudioManager.js`: Now sole handler for audio events

## [2.9.6] - 2024-12-25

### 🔧 Critical Audio Fix
- **Fixed AudioManager import issue**:
  - Added missing `AudioManager.js` script import in `index.html`
  - Resolved "AudioManager is not defined" ReferenceError
  - Audio functionality fully restored for all sound mixing features
  - Fixed MP3 playbook and synthesized sound generation
- **Files modified**:
  - `index.html`: Added AudioManager.js script import

## [2.9.5] - 2024-12-25

### ✅ Audio Module Modularization Complete + CSS Fix
- **Complete audio state management delegation to AudioManager**:
  - Removed duplicate audio state properties (`globalPaused`, `activeSounds`, `soundStates`, `pausedSounds`) from `script.js`
  - All audio state management now centralized in `AudioManager.js`
  - Updated all audio-related methods to delegate to `AudioManager` instance
  - Added proper null checks for `audioManager` instance
- **Enhanced audio architecture**:
  - Clean separation between UI logic and audio management
  - Consistent delegation pattern for all audio operations
  - Maintained backward compatibility with existing functionality
  - Improved error handling and state consistency
- **Code cleanup and optimization**:
  - Removed redundant audio state initialization from `script.js`
  - Updated method implementations to use `this.audioManager` properties
  - Simplified audio state management with single source of truth
  - Enhanced console logging for better debugging
- **CSS Quality Improvements**:
  - Fixed empty CSS ruleset in `_sections.css` (line 287)
  - Removed unnecessary `.visual-display:hover` empty rule
  - Improved CSS code quality and linting compliance
- **Files modified**:
  - `script.js` - Removed duplicate audio state, updated delegation
  - `js/managers/AudioManager.js` - Centralized audio state management
  - `css/modules/_sections.css` - Fixed empty CSS ruleset
  - `changelog.md` - Documentation of completed audio modularization

## [2.9.4] - 2024-12-25

### ✅ Feelings Module Modularization Complete
- **Complete modularization of feelings functionality**:
  - All feelings logic successfully moved from `script.js` to `js/feelings.js`
  - Implemented `FeelingsManager` class for centralized emotion management
  - Implemented `FeelingsState` class with Observer pattern for state management
  - Clean separation of concerns with no code duplication
- **Enhanced architecture**:
  - Modular design following single responsibility principle
  - Global functions maintained for HTML onclick compatibility
  - Proper initialization and DOM ready handling
  - Export functionality for potential module usage
- **Code cleanup**:
  - Removed all duplicate feelings code from `script.js`
  - Added clear documentation comments indicating modularization
  - Maintained backward compatibility with existing HTML structure
- **Files modified**:
  - `js/feelings.js` - Complete modular implementation
  - `script.js` - Cleaned up with modularization comments
  - `changelog.md` - Documentation of completed modularization

## [2.9.3] - 2024-12-25

### ✨ Enhanced Interactive Feelings Section
- **Interactive activity cards with dynamic encouragements**:
  - Hover over activity cards to see personalized encouragement messages
  - Random encouraging messages for each activity ("C'est une excellente idée!", "Ça peut t'aider!", etc.)
  - Click activity cards to select them with visual feedback
  - Smart speech bubble positioning based on card location on screen
- **Improved mascot message system**:
  - Dynamic positioning classes `.position-left` and `.position-bottom`
  - Speech bubble triangles that adapt to bubble position
  - Automatic positioning based on activity card location
  - Enhanced visual feedback for user interactions
- **Enhanced restart functionality**:
  - Clear all selections including activity cards
  - Encouraging restart message from mascot
  - Complete state reset for better user experience
- **New CSS components**:
  - `.restart-button` with hover effects and animated icon
  - `.back-button` with consistent styling
  - Enhanced `.mascot-message` with speech bubble triangles
  - Responsive design for smaller screens
- **Files modified**:
  - `css/modules/_components.css` - New button styles and enhanced mascot message
  - `js/feelings.js` - Interactive encouragements and dynamic positioning

## [2.9.2] - 2024-12-25

### 🔧 Interactive Bubbles Fix
- **Tips section - Restored interactive bubbles**:
  - Fixed missing CSS classes `.encouragement-bubble.show` and `.encouragement-bubble.hidden`
  - Interactive bubbles now appear again when clicking tip cards
  - Restored encouragement messages for all tip cards (Crée ton espace, Câlin réconfortant, etc.)
  - Activity cards in feelings section also show interactive bubbles
  - Personalized messages based on activity content
- **Files modified**:
  - `css/modules/_animations.css` - Added missing CSS classes for bubble visibility

## [2.9.1] - 2024-12-25

### ✨ Enhanced Visual Navigation and Timer Features
- **Fullscreen visual mode enhancements**:
  - Added discrete bubble icon (🫧) in top-right corner, 50% transparent
  - Click to return to normal mode (in addition to ESC key)
  - Smooth hover effects and transitions
  - Auto-cleanup when exiting fullscreen
- **Visual effects navigation**:
  - Arrow key navigation (← →) to switch between visual effects
  - Touch swipe navigation (left/right) for touch screens
  - Works only when a visual effect is active
  - Automatic cycling through 4 effects: breathing → colors → stars → mandala
  - Smart swipe detection (minimum 50px, more horizontal than vertical)
- **Timer improvements**:
  - Added 30-minute preset button
  - Complete range now: 1, 2, 5, 10, 30 minutes
- **Technical improvements**:
  - Touch events with `passive: true` for better performance
  - Intelligent swipe detection with threshold
  - Automatic cleanup of fullscreen exit button
  - Cyclical navigation between visual effects
- **Cache CSS**: Updated to `?v=2.9.1`
- **Files modified**:
  - `js/visuals.js` - New navigation features and fullscreen exit button
  - `index.html` - Added 30min button and CSS cache update
  - `changelog.md` - Documentation of new features

## [2.9.0] - 2024-12-25

### 🔧 Final Visual and Grid Fixes
- **Sound grid - Fixed for all screen sizes**:
  - Ensured `repeat(3, 1fr)` is maintained at 1200px+ breakpoint
  - Prevents reverting to 2 columns on very wide screens
  - Now consistently shows 3 columns on all desktop sizes (≥1024px)
- **Visual effects - Completely removed outer green zone**:
  - Removed `background: var(--bg-secondary)` from `.visual-display`
  - Removed `padding: 15px` that created the green border zone
  - Removed `border-radius` and `box-shadow` from container
  - Only the inner canvas border remains (the intended single border)
- **Verification**: `styles.css` is completely removed from active code
  - Only referenced in documentation files (README.md, changelog.md)
  - Application uses exclusively modular CSS architecture
- **Cache CSS**: Updated to `?v=2.9.0`
- **Files modified**:
  - `css/modules/_responsive.css` - Fixed 1200px+ breakpoint
  - `css/modules/_sections.css` - Removed visual-display background/padding
  - `index.html` - CSS cache v2.9.0

## [2.8.9] - 2024-12-25

### 🔧 Final Layout Corrections
- **Sound grid - Fixed 3 columns enforcement**:
  - Changed from `repeat(auto-fit, minmax(220px, 1fr))` to `repeat(3, 1fr)` for screens ≥1024px
  - Changed from `repeat(auto-fit, minmax(200px, 1fr))` to `repeat(2, 1fr)` for screens ≥768px
  - Guarantees exactly 3 columns on large screens and 2 on tablets
- **Complete CSS conflict elimination**:
  - Renamed `styles.css` to `styles-old.css` to eliminate all conflicts
  - Application now uses exclusively the modular CSS architecture
  - No more conflicting styles from legacy CSS file
- **Cache CSS**: Updated to `?v=2.8.9`
- **Files modified**:
  - `css/modules/_responsive.css` - Fixed grids to use exact column counts
  - `styles.css` → `styles-old.css` - Eliminated conflicts
  - `index.html` - CSS cache v2.8.9

## [2.8.7] - 2024-12-25

### 🔧 Critical Bug Fixes and Layout Improvements
- **Fixed info button modal functionality**:
  - Resolved conflicting event listeners between `script.js` and `navigation.js`
  - Info button now properly opens the information modal
  - Removed duplicate event handler from `navigation.js`
  - Added missing `.info-modal.show` CSS rule for proper modal display
- **Updated sound grid layout**:
  - Changed from 2 columns to 3 columns on desktop and tablet screens
  - Maintained 2 columns on mobile devices (480px and below)
  - Improved responsive behavior for better content organization
- **Fixed CSS syntax errors**:
  - Added missing media query opening brace in `_responsive.css`
  - Resolved empty CSS rulesets in `_components.css`
  - Added proper styles to `.is-active` and `.is-playing` classes
- **Removed visual double borders**:
  - Eliminated outer border from `.visual-display` containers
  - Removed hover border effects for cleaner visual appearance
  - Fixed visual effects having unnecessary double frame styling
- **Added cache-busting for CSS**:
  - Added version parameter to CSS link to force browser cache refresh
  - Ensures users see the latest styling changes immediately
- **Files modified**:
  - `css/modules/_responsive.css` - Fixed media query syntax and updated grid layouts
  - `css/modules/_components.css` - Fixed empty rulesets and added missing modal rule
  - `css/modules/_sections.css` - Updated main sound grid to 3 columns and removed visual borders
  - `js/navigation.js` - Removed conflicting info button event listener
  - `index.html` - Added CSS version parameter for cache-busting

## [2.8.6] - 2024-12-25

### 🔧 CSS Architecture Refactoring - Phase 5: Responsive Optimization (Completed)
- **Implemented mobile-first responsive design approach**:
  - Refactored all base styles to be mobile-optimized by default
  - Progressive enhancement for larger screens using min-width media queries
  - Optimized breakpoint system: 480px (small), 768px (tablet), 1024px (desktop), 1200px (large)
- **Created comprehensive responsive utility classes**:
  - Visibility utilities: `.hide-mobile`, `.show-mobile`, `.hide-tablet`, `.show-tablet`, `.hide-desktop`, `.show-desktop`
  - Text alignment: `.text-center-mobile`, `.text-left-tablet`, `.text-right-desktop`
  - Flexbox utilities: `.flex-col-mobile`, `.flex-row-tablet`, `.justify-center-mobile`
  - Grid utilities: `.grid-1-mobile`, `.grid-2-tablet`, `.grid-3-desktop`
  - Width utilities: `.w-full-mobile`, `.w-auto-tablet`, `.w-half-desktop`
  - Spacing utilities: `.p-sm-mobile`, `.m-lg-tablet`
- **Added progressive enhancement with CSS `@supports`**:
  - Container Queries support with Flexbox fallback
  - CSS Grid support with Flexbox fallback
  - Custom Properties support with static value fallback
  - Backdrop Filter support with solid background fallback
  - Aspect Ratio support with padding-bottom fallback
  - CSS Clamp support with fixed value fallback
- **Enhanced accessibility and performance**:
  - `prefers-reduced-motion` support for all animations
  - `prefers-color-scheme` dark mode optimizations
  - Print styles optimization
  - High contrast mode support
  - Reduced data mode for performance
- **Added landscape orientation optimizations**:
  - Improved layout for mobile landscape mode
  - Better navigation spacing and touch targets
  - Optimized visual display for landscape viewing

### 📁 Files Modified
- `css/modules/_responsive.css` - Complete mobile-first refactor with utility classes and progressive enhancement
- `changelog.md` - Updated documentation

### 🎯 Benefits Achieved
- **Mobile-first performance**: Optimized loading and rendering for mobile devices
- **Centralized responsive logic**: All media queries consolidated in one file
- **Flexible utility system**: Comprehensive responsive utilities for rapid development
- **Progressive enhancement**: Modern CSS features with robust fallbacks
- **Better accessibility**: Support for user preferences and assistive technologies
- **Improved maintainability**: Clear breakpoint system and organized responsive code
- **Enhanced developer experience**: Intuitive utility classes and consistent patterns

## [2.8.5] - 2024-12-25

### 🔧 CSS Architecture Refactoring - Phase 1: Variable Consolidation
- **Completed**: Centralization of all CSS variables in `_variables.css`
- **Moved breakpoint variables** from `_responsive.css` to `_variables.css` for consistency
- **Added standardized variables**:
  - Animation durations: `--duration-instant` to `--duration-slowest`
  - Grid system gaps: `--grid-gap-xs` to `--grid-gap-xl`
  - Component heights: `--component-height-sm` to `--component-height-xl`
  - Container widths: `--container-sm` to `--container-2xl`
- **Updated transition variables** to use new duration tokens
- **Enhanced reduced motion support** with centralized duration control

### 📁 Files Modified
- `css/modules/_variables.css`: Added comprehensive variable system
- `css/modules/_responsive.css`: Removed duplicate breakpoint variables
- `changelog.md`: Documentation of Phase 1 completion

### 🎯 Benefits Achieved
- **Centralized theming**: All design tokens in one location
- **Better consistency**: Standardized spacing, timing, and sizing
- **Improved maintainability**: Single source of truth for design values
- **Enhanced accessibility**: Better reduced motion support

### 🔧 CSS Architecture Refactoring - Phase 4: Component Refactoring with Atomic Design (Completed)
- **Created atomic button components** following atomic design principles:
  - Base `.btn` class with reset and consistent component styles
  - Modifier classes: `.btn--primary`, `.btn--secondary`, `.btn--success`, `.btn--warning`, `.btn--danger`
  - Size modifiers: `.btn--sm`, `.btn--lg`, `.btn--full`
  - Integrated with global state classes for consistent behavior
- **Created atomic card components**:
  - Base `.card` class with unified styling foundation
  - Modifier classes: `.card--interactive`, `.card--welcome`, `.card--profile`, `.card--intensity`, `.card--gradient`
  - Size modifiers: `.card--sm`, `.card--lg`
  - Integrated with global state classes for consistent behavior
- **Implemented global state classes**:
  - `.is-active` - Universal active state for any component
  - `.is-playing` - For audio/video components with visual pulse indicator
  - `.is-loading` - Universal loading state with animated spinner
- **Enhanced component consistency** with unified styling patterns
- **Maintained backward compatibility** with all existing legacy component classes
- **Improved state management** with reusable state classes across all components

### 📁 Files Modified
- `css/modules/_components.css` - Refactored button and card components with atomic design principles
- `changelog.md` - Updated documentation

### 🎯 Benefits Achieved
- **Modular component system** following atomic design methodology
- **Consistent component behavior** and styling across the entire application
- **Reusable state classes** that work seamlessly with any component
- **Reduced code duplication** through base + modifier pattern implementation
- **Enhanced maintainability** with clear component hierarchy and organization
- **Better scalability** for future component additions and modifications
- **Improved developer experience** with predictable and intuitive class naming conventions

### 📋 Next Phases (To Do)
- **Phase 6**: Performance Optimization - Minimize CSS, optimize loading, implement critical CSS
- **Phase 7**: Documentation - Create comprehensive style guide and component library
- **Phase 8**: Testing - Cross-browser compatibility, accessibility audit, performance testing

### 🔧 CSS Architecture Refactoring - Phase 3: Animation System Optimization (Completed)
- **Created parameterizable base animations**:
  - `@keyframes fadeInDirection` with `--fade-direction` CSS variable
  - `@keyframes scaleDirection` with `--scale-direction` CSS variable
  - `@keyframes slideDirection` with `--slide-direction` CSS variable
- **Added comprehensive modifier classes**:
  - Fade animations: `.fade-in`, `.fade-in--up`, `.fade-in--down`, `.fade-in--left`, `.fade-in--right`
  - Scale animations: `.scale-in`, `.scale-in--small`, `.scale-in--large`
  - Slide animations: `.slide-in`, `.slide-in--left`, `.slide-in--right`, `.slide-in--up`, `.slide-in--down`
- **Enhanced animation control system**:
  - Speed modifiers: `.anim--slow`, `.anim--fast`, `.anim--instant`
  - Delay modifiers: `.anim--delay-sm`, `.anim--delay-md`, `.anim--delay-lg`
  - Easing modifiers: `.anim--ease-in`, `.anim--ease-out`, `.anim--ease-in-out`
- **Added comprehensive easing variables**:
  - `--ease-linear`, `--ease-in`, `--ease-out`, `--ease-in-out`, `--ease-back`, `--ease-bounce`
- **Improved accessibility**:
  - Full `prefers-reduced-motion` support for all new animation classes
  - Maintained backward compatibility with legacy animations

### 📁 Files Modified
- `css/modules/_animations.css` - Added parameterizable animations and modifier classes
- `css/modules/_variables.css` - Added easing function variables

### 🎯 Benefits Achieved
- **Flexible animation system** with CSS variable parameters
- **Consistent animation patterns** across the application
- **Reduced code duplication** with reusable base animations
- **Better developer experience** with intuitive modifier classes
- **Enhanced accessibility** with comprehensive reduced motion support
- **Maintainable codebase** with centralized animation logic

### 🔧 CSS Architecture Refactoring - Phase 2: Utility Cleanup (Completed)
- **Eliminated duplicated utility classes**:
  - Removed `.hidden` and `.show` classes, standardized on `.d-none` and `.d-block`
  - Consolidated all flexbox utilities in `_utilities.css`
  - Updated component-specific classes (`.encouragement-bubble`, `.info-modal`)
- **Standardized naming conventions**:
  - All utility classes now use consistent naming with `!important`
  - Added missing flexbox utilities (`.flex-1`, `.flex-auto`, `.flex-none`)
  - Added complete justify-content and align-items utilities
- **Created unified grid system**:
  - New grid system with `.grid-cols-1` to `.grid-cols-6` for fixed columns
  - Responsive auto-fit grids (`.grid-auto-xs` to `.grid-auto-xl`)
  - Standardized gap utilities (`.gap-xs` to `.gap-xl`) using CSS variables
  - Removed duplicate grid classes from `_layout.css`

### 📁 Files Modified
- `css/modules/_utilities.css` - Added missing utilities, removed duplicates
- `css/modules/_layout.css` - Removed duplicate utilities, added unified grid system
- `css/modules/_animations.css` - Updated to use standardized classes
- `css/modules/_components.css` - Updated modal classes

### 🎯 Benefits Achieved
- **Single source of truth** for utility classes
- **Consistent naming** across all utilities
- **Better grid system** with responsive capabilities
- **Reduced CSS duplication** and file size
- **Improved maintainability** and developer experience

---

## [2.8.4] - 2024-12-25

### 🎨 Corrections Visuelles - Section Effets Visuels
- **Problème résolu** : Deux problèmes d'affichage dans la section visuels
  1. **Mode plein écran** : L'effet ne s'étendait pas à tout l'écran
  2. **Mode normal** : Padding excessif autour du canvas des effets visuels

- **Solutions implémentées** :
  - **Redimensionnement intelligent du canvas** : Modification de `resizeCanvas()` dans `script.js`
    - Détection automatique du mode plein écran
    - Utilisation des dimensions complètes de la fenêtre en mode plein écran
    - Réduction du padding de 40px à 20px en mode normal
  - **Optimisation CSS** : Mise à jour des styles dans tous les fichiers CSS
    - Padding réduit à 10px en mode normal (8px sur mobile)
    - Padding supprimé complètement en mode plein écran
    - Cohérence entre tous les breakpoints responsifs

### 📁 Fichiers Modifiés
- `script.js` : Amélioration de la fonction `resizeCanvas()` avec gestion du plein écran
- `css/modules/_sections.css` : Optimisation du padding du conteneur visuel
- `css/modules/_responsive.css` : Mise à jour des styles responsifs
- `styles.css` : Cohérence des styles de plein écran
- `changelog.md` : Documentation des corrections

### 🎯 Résultat
- **Plein écran optimal** : Les effets visuels utilisent maintenant toute la surface de l'écran
- **Espace mieux utilisé** : Réduction significative du padding en mode normal
- **Expérience immersive** : Affichage plus engageant des effets visuels
- **Responsive amélioré** : Comportement cohérent sur tous les appareils

---

## [2.8.3] - 2024-12-25

### 🎵 Correction Critique de la Pause Globale pour Piano et Lo-Fi
- **Problème résolu** : La pause globale ne fonctionnait pas correctement avec les sons "Piano Doux" et "Lo-Fi Calme"
- **Cause identifiée** : Ces sons utilisent des objets `Tone.Pattern` qui nécessitent une gestion spécifique
- **Solution implémentée** : Ajout de la gestion des patterns de mélodie dans les fonctions de contrôle audio
  - `pauseSound()` : Détection et pause des patterns piano/lofi via `melodyPatterns[soundId].stop()`
  - `resumeSound()` : Reprise des patterns piano/lofi via `melodyPatterns[soundId].start()`
  - `startSound()` : Démarrage correct des patterns lors de l'activation
  - `stopSound()` : Arrêt complet des patterns lors de la désactivation

### 📁 Fichiers Modifiés
- `script.js` : Mise à jour des fonctions `pauseSound`, `resumeSound`, `startSound`, `stopSound`
- `changelog.md` : Documentation de la correction

### 🎯 Résultat
- **Pause globale fonctionnelle** : Tous les types de sons (HTML5, Tone.js, Patterns) sont correctement gérés
- **Contrôle unifié** : Piano et Lo-Fi répondent maintenant aux commandes de pause/reprise globales
- **Expérience utilisateur améliorée** : Comportement cohérent pour tous les sons de l'application

---

## [2.8.2] - 2024-12-25

### 🔧 Correction Critique du Modal d'Information
- **Problème résolu** : Modal d'information qui s'affichait en permanence sur la page d'accueil
- **Styles ajoutés** : Restauration complète des styles de modal manquants
  - `.info-modal` : Style de base avec `display: none` par défaut
  - `.info-modal-content`, `.info-modal-header`, `.info-modal-close`, `.info-modal-body`
  - Positionnement fixe, arrière-plan semi-transparent, z-index approprié
- **Animation ajoutée** : `@keyframes slideUp` pour l'animation d'ouverture du modal
- **Comportement restauré** : Modal caché par défaut, visible uniquement au clic sur la bulle d'info

### 📁 Fichiers Modifiés
- `css/modules/_components.css` : Ajout des styles de modal complets
- `css/modules/_animations.css` : Ajout de l'animation slideUp
- `changelog.md` : Documentation de la correction

### 🎯 Résultat
- **Mise en page corrigée** : Contenu de la page d'accueil non plus décalé
- **Modal fonctionnel** : Affichage correct uniquement lors de l'interaction
- **UX restaurée** : Comportement conforme à la version originale

---

## [2.8.1] - 2024-12-25

### 🐛 Correction des Styles Manquants
- **Composants UI restaurés** : Ajout des styles critiques manquants dans la structure modulaire
  - `.theme-toggle` : Bouton de changement de thème avec positionnement fixe et animations
  - `.info-bubble` : Bouton d'information avec animation gentle-pulse
  - `.mascot` et `.mascot-message` : Système de mascotte avec messages interactifs
  - `.global-pause-btn` : Bouton de pause globale avec animations float
- **Animation ajoutée** : `@keyframes gentle-pulse` dans `_animations.css`
- **Cohérence visuelle** : Restauration complète de l'apparence originale

### 📁 Fichiers Modifiés
- `css/modules/_components.css` : Ajout des 4 composants manquants
- `css/modules/_animations.css` : Ajout de l'animation gentle-pulse
- `changelog.md` : Documentation des corrections

### 🎯 Résultat
- **Interface complète** : Tous les éléments UI sont maintenant correctement stylés
- **Fonctionnalités préservées** : Boutons de contrôle, mascotte et thème fonctionnels
- **Architecture maintenue** : Corrections intégrées dans la structure modulaire ITCSS

---

## [2.8.0] - 2024-12-19

### ✨ Modularisation CSS Complète
- **Architecture CSS refactorisée** : Division du fichier `styles.css` (2681 lignes) en 9 modules spécialisés
- **Structure modulaire** : Création du dossier `css/modules/` avec organisation ITCSS (Inverted Triangle CSS)
- **Modules créés** :
  - `_variables.css` : Variables CSS et design tokens
  - `_base.css` : Reset, typographie et styles fondamentaux
  - `_layout.css` : Grilles, conteneurs et layouts structurels
  - `_navigation.css` : Composants de navigation
  - `_components.css` : Composants UI réutilisables
  - `_sections.css` : Sections spécifiques aux pages
  - `_animations.css` : Keyframes, transitions et animations
  - `_responsive.css` : Media queries et ajustements responsifs
  - `_utilities.css` : Classes utilitaires et helpers

### 🔧 Améliorations Techniques
- **Fichier principal** : `css/main.css` importe tous les modules dans l'ordre correct
- **Cascade CSS optimisée** : Ordre d'import respectant la spécificité croissante
- **Maintenabilité** : Code CSS organisé par responsabilité et réutilisabilité
- **Performance** : Structure modulaire permettant le lazy loading futur

### 📁 Fichiers Modifiés
- `index.html` : Mise à jour du lien CSS vers `css/main.css`
- `css/main.css` : Point d'entrée principal avec imports modulaires
- Création de 9 nouveaux modules CSS dans `css/modules/`
- `changelog.md` : Documentation de la refactorisation

### 🎯 Bénéfices
- **Développement** : Édition ciblée par fonctionnalité
- **Débogage** : Isolation des styles par module
- **Collaboration** : Travail parallèle sur différents modules
- **Évolutivité** : Ajout facile de nouveaux composants

---

## [2.7.5] - 2024-12-19

### 🚨 Correction Critique - Positionnement des Bulles
- **Position CSS corrigée** : Changement de `position: relative` vers `position: fixed` dans `.encouragement-bubble`
- **Logique JavaScript adaptée** : Suppression des calculs de scroll, utilisation des coordonnées viewport directes
- **Positionnement précis** : La bulle se positionne maintenant correctement par rapport à la fenêtre visible

### 🔧 Améliorations Techniques
- **Coordonnées viewport** : Utilisation de `getBoundingClientRect()` sans ajustements de scroll
- **Centrage parfait** : Calcul précis du centre horizontal de la carte
- **Contraintes renforcées** : Marges de sécurité pour éviter tout débordement

### 📁 Fichiers Modifiés
- `styles.css` : Correction de `position: relative` vers `position: fixed`
- `js/tips.js` : Refactorisation complète de la méthode `positionBubble()`
- `changelog.md` : Documentation de la correction définitive

---

## [2.7.4] - 2024-12-19

### Ajouté
- Section d'intensité intermédiaire dans le module "Comment te sens-tu ?"
- Sélection de 5 niveaux d'intensité avec icônes et descriptions adaptées à chaque émotion
- Navigation fluide : Émotions → Intensité → Besoins → Activités
- Cartes d'intensité avec design responsive et animations de transition
- Gestion d'état pour le suivi de l'intensité sélectionnée

### Modifié
- Flux de navigation dans la section des conseils émotionnels
- Bouton de retour de la section "Besoins" pointe maintenant vers "Intensité"
- Synchronisation des versions dans tous les fichiers du projet

### Corrigé
- **Bug critique** : Ajout de la méthode manquante `notifyObservers()` dans la classe `FeelingsState`
- Erreur "this.notifyObservers is not a function" qui empêchait la navigation vers l'intensité

### Technique
- Ajout de la classe CSS `.intensity-section` et `.intensity-card`
- Extension de la classe `FeelingsState` avec `selectedIntensity`
- Nouvelles méthodes `showIntensity()` et `selectIntensity()` dans `FeelingsManager`
- Structure de données `intensityData` pour chaque émotion
- Implémentation complète du pattern Observer dans `FeelingsState`

## Version 2.2.1 - Corrections Audio et Interactions (2024-12-25)

### 🐛 Corrections de Bugs
- **Contrôles de volume individuels** : Correction du système de volume pour chaque son
- **Affichage du volume** : Les sliders de volume mettent maintenant à jour correctement l'affichage en pourcentage
- **Mapping des sons** : Correction des correspondances entre les boutons HTML et les fichiers audio
  - `campagne` → `./sons/campagne.mp3`
  - `feu` → `./sons/feu.mp3`
  - `chat` → `./sons/chat.mp3`
  - `berceuse` → `./sons/berceuse.mp3`
  - `ballade` → `./sons/ballade.mp3`
- **Cartes d'émotion cliquables** : Ajout des propriétés CSS manquantes (`cursor: pointer`, `user-select: none`)
- **Debugging amélioré** : Ajout de logs pour diagnostiquer les problèmes d'interaction

### 🔧 Améliorations Techniques
- **Gestion du volume individuel** : Chaque son peut maintenant avoir son propre niveau de volume
- **Stockage des volumes** : Les préférences de volume sont conservées pour chaque son
- **Event listeners optimisés** : Meilleure gestion des événements de clic sur les cartes d'émotion

### 📁 Fichiers Modifiés
- `js/audio.js` : Système de volume individuel et mapping des sons
- `js/feelings.js` : Debugging des événements de clic
- `styles.css` : Propriétés CSS pour les cartes cliquables
- `changelog.md` : Documentation des corrections

---

## [Version Actuelle] - 2024-12-19

### ✅ Corrigé
- **Bug critique**: Correction de l'erreur `this.notifyObservers is not a function` dans `js/feelings.js`
  - Ajout de la méthode `notifyObservers()` manquante à la classe `FeelingsState`
  - Implémentation complète du pattern Observer pour la gestion d'état
  - La navigation Émotions → Intensité → Besoins → Activités fonctionne maintenant correctement
- **Bug d'affichage**: Correction du problème de superposition des sections dans le parcours émotionnel
  - Les cartes de besoins apparaissaient en dessous des cartes d'intensité au lieu de les remplacer
  - Ajout de la gestion manquante de `intensitySection` dans les méthodes `showNeeds()`, `showEmotions()` et `restart()`
  - Navigation par étapes maintenant correcte avec remplacement complet des sections

### 🔧 Améliorations techniques
- Implémentation complète du pattern Observer dans `FeelingsState`
- Meilleure gestion des erreurs et de l'état de l'application
- Navigation plus cohérente entre toutes les sections du parcours émotionnel
- Code plus robuste et maintenable

### ⚠️ Avertissements non critiques
- Avertissements de dépréciation `ScriptProcessorNode` de Tone.js v14.7.77 (non critique, fonctionnalité intacte)
- Recommandation: Mise à niveau vers Tone.js v15+ ou utilisation d'`AudioWorkletNode` à long terme

---

## [Version en cours] - 2024-12-XX

### Ajouté
- Nouveau système de profils avec sauvegarde/chargement
- Interface de gestion des profils dans la section dédiée
- Prévisualisation des profils sauvegardés sur la page d'accueil
- Système de bulles d'information avec modal interactif
- Animations de bulles flottantes dans le modal d'information
- **ÉTAPE 1 TERMINÉE** : Refactorisation complète de la logique feelings
  - Nouvelle classe `FeelingsState` pour la gestion centralisée d'état
  - Suppression du code dupliqué entre `script.js` et `feelings.js`
  - Migration des `onclick` vers des event listeners modernes
  - Architecture modulaire et maintenable

### Modifié
- Amélioration de l'interface utilisateur avec de nouveaux styles
- Optimisation du système de navigation entre les sections
- **Refactorisation majeure du module feelings** :
  - Centralisation de la logique dans `feelings.js` uniquement
  - Remplacement des attributs `onclick` par `data-action`
  - Implémentation d'un système d'observateurs pour l'état
  - Unification de la gestion des émotions, besoins et activités

### Corrigé
- Correction des problèmes de duplication de cartes de profils
- Amélioration de la gestion des états des profils
- Correction des erreurs de navigation dans certains cas
- **Élimination de la duplication de code** dans la section feelings
- **Correction de l'architecture** : séparation claire des responsabilités

---

## [Latest] - HTML5 Audio API Implementation

### Major Changes
- **HTML5 Audio API**: Replaced Tone.js Player instances with native HTML5 Audio elements for all MP3 files
- **File Protocol Support**: Application now works directly from file system without requiring HTTP server
- **Hybrid Audio System**: MP3 files use HTML5 Audio, synthesized sounds use Tone.js
- **No Server Required**: Eliminated need for local HTTP server setup

### Fixed
- **CORS Policy Errors**: Completely resolved by using HTML5 Audio API for MP3 files
- **File Protocol Compatibility**: Application works when opened directly in browser
- **Tone.js Deprecation Warnings**: Reduced by limiting Tone.js to synthesized sounds only
- **AudioContext Suspension**: HTML5 Audio handles autoplay policies natively
- **Audio Loading Failures**: Improved error handling with native HTML5 Audio events

### Enhanced
- **createAudioElement()**: New method for creating HTML5 Audio with unified interface
- **Unified Audio Control**: Single interface for both HTML5 Audio and Tone.js objects
- **Error Handling**: Native HTML5 Audio error events and loading states
- **Performance**: More efficient MP3 playback with native browser audio
- **Cross-Platform**: Better compatibility across devices and browsers

### Technical Improvements
- **createNatureSounds()**: Replaced all Tone.Player instances with HTML5 Audio elements
- **createMelodies()**: Updated berceuse and ballade to use HTML5 Audio
- **startSound()**: Added HTML5 Audio element detection and handling
- **stopSound()**: Enhanced to properly handle both audio types
- **Audio Interface**: Added start() and stop() methods to HTML5 Audio elements

### Audio System Architecture
```
HTML5 Audio (MP3 Files):
- Nature Sounds: campagne, forest, ocean, rain, chat, feu, underwater
- UI Sounds: bubble
- Melodies: berceuse, ballade

Tone.js (Synthesized):
- Noise Generators: white, pink, brown noise
- Synthesizers: piano, lofi
```

### Documentation
- **AUDIO_FIXES.md**: Updated with HTML5 Audio API implementation details
- **Deployment**: Simplified - no server setup required
- **Architecture**: Documented hybrid audio system approach

### Benefits
- **Simplified Deployment**: Double-click HTML file to run
- **Better Performance**: Native audio handling for MP3 files
- **Reduced Dependencies**: Less reliance on Tone.js
- **Improved Reliability**: Native browser error handling
- **Cross-Platform**: Works on all HTML5-capable devices

### Requirements
- **Modern Browser**: HTML5 Audio support (all modern browsers)
- **Audio Files**: MP3 files in ./sons/ directory
- **User Interaction**: Audio starts after user click (browser policy)

---

## [Previous] - 2024-12-19

### Added
- Comprehensive audio system error handling and recovery
- Async/await pattern for audio initialization functions
- Graceful degradation when audio files fail to load
- Enhanced console logging for audio debugging
- AUDIO_FIXES.md documentation for technical details
- Proper HTTP server requirement for CORS compliance

### Enhanced
- Audio context initialization now properly deferred until user interaction
- Melody patterns configured but not started until audio context is ready
- All audio file loading wrapped in try-catch blocks for error recovery
- Improved error messages changed from errors to warnings to reduce console noise
- Better compliance with Chrome's autoplay policy

### Fixed
- CORS policy errors when accessing MP3 files via file:// protocol
- Tone.js ScriptProcessorNode deprecation warnings
- AudioContext suspension issues due to autoplay policy
- Premature transport start causing audio context warnings
- MP3 loading failures now handled gracefully without breaking the app

### Technical Improvements
- `setupAudio()` function now async with comprehensive error handling
- `createNatureSounds()` and `createMelodies()` functions enhanced with individual file error handling
- `startMelodyPatterns()` function improved to defer pattern activation
- `initializeAudioContext()` function enhanced to start patterns when audio is ready
- Application now requires HTTP server (localhost:8000) for proper audio functionality

## [Version 2.7.3] - 2025-05-19

### 🐛 Corrections critiques de l'affichage visuel
- **Canvas tronqué corrigé** : Suppression des conflits CSS width/height 100%
- **Blocage visuel résolu** : Amélioration de la gestion des états visualsPaused
- **Changement de visuel réparé** : Fonction setVisual() avec réactivation forcée
- **Dimensions canvas stabilisées** : Calculs de redimensionnement robustes
- **Rendu DPR amélioré** : Gestion correcte du device pixel ratio
- **Sécurité canvas** : Vérifications d'existence avant manipulation
- **Logs de débogage** : Traçabilité des opérations canvas
- **🆕 Respiration guidée corrigée** : Initialisation automatique du canvas lors de l'accès à la section visuels
- **Page interactive "Comment te sens-tu ?"** : Nouvelle fonctionnalité d'aide émotionnelle pour les enfants
- **Navigation entre sections émotions/besoins/activités** : Correction complète des bugs d'affichage lors des retours (vidage des grilles)
- **Fonction `showNeeds()`** : Vidage de la grille des activités (`activitiesGrid`) pour éviter les cartes résiduelles.
- **Fonction `showEmotions()`** : Vidage des grilles des besoins (`needsGrid`) et des activités (`activitiesGrid`) pour un état propre.
- **Fonction `restart()`** : Vidage de toutes les grilles (`needsGrid`, `activitiesGrid`) en plus de la réinitialisation des états et sections.
- **Réinitialisation des états visuels** : Toutes les cartes se remettent à zéro correctement lors de la navigation

## [Version 2.2.0] - 2024-12-18

### ✅ Étape 2 : Harmonisation du design et des animations (TERMINÉE)

#### 🎨 Système de cartes unifié
- **Classe `card-base`** : Système de cartes commun pour toutes les sections
- **Classes modulaires** : `card-icon`, `card-title`, `card-description` pour une structure cohérente
- **Variantes de taille** : `card-small`, `card-large` pour différents contextes
- **États harmonisés** : Hover, selected et active states unifiés

#### ✨ Animations améliorées
- **Micro-interactions** : Animation `cardPulse` au survol avec rotation subtile des icônes
- **Transitions fluides** : Timing unifié avec `cubic-bezier(0.4, 0.0, 0.2, 1)`
- **Effets visuels** : Gradients dynamiques et ombres progressives
- **Performance optimisée** : Utilisation de `will-change` et `transform` pour les animations GPU

#### 🎯 Design responsive harmonisé
- **Grilles adaptatives** : Tailles minimales optimisées pour chaque type de carte
- **Espacements cohérents** : Système d'espacement unifié (1rem, 1.2rem, 1.5rem)
- **Typographie standardisée** : Tailles et poids de police harmonisés
- **Points de rupture optimisés** : 768px (tablette) et 480px (mobile)

#### 🌈 Système de couleurs enrichi
- **Variables de gradient** : `--gradient-soft`, `--gradient-primary`, `--gradient-success`, `--gradient-warm`
- **Couleurs contextuelles** : Chaque type de carte a sa couleur d'accent (bleu, vert, pêche)
- **Contraste amélioré** : Meilleure lisibilité en mode sombre et clair

#### 📁 Fichiers modifiés
- `styles.css` : Système de cartes unifié, animations et responsive design
- `index.html` : Migration vers les nouvelles classes de cartes
- `js/feelings.js` : Utilisation des classes unifiées pour les cartes dynamiques

#### ✅ Tests effectués
- Cohérence visuelle sur desktop, tablette et mobile ✓
- Animations fluides et performantes ✓
- Interactions tactiles optimisées ✓
- Thèmes clair et sombre harmonisés ✓
- Serveur de test fonctionnel sur le port 8000 ✓

## [Version 2.1.1] - 2024-12-18

### ✅ Étape 1 : Refactorisation de la logique des sentiments (TERMINÉE)

#### 🔧 Améliorations techniques
- **Nouvelle classe `FeelingsState`** : Gestion centralisée de l'état des émotions, besoins et observateurs
- **Suppression du code dupliqué** : Élimination des variables et fonctions redondantes dans `script.js`
- **Migration des événements** : Remplacement des attributs `onclick` par des écouteurs d'événements avec `data-action`
- **Centralisation de la logique** : Toute la logique des sentiments est maintenant dans `feelings.js`

#### 🎯 Fonctionnalités maintenues
- **Compatibilité totale** : Toutes les fonctions existantes continuent de fonctionner
- **Fonctions globales** : Maintien de `showNeeds`, `showActivities`, `showEmotions`, `restart` pour la compatibilité
- **Interface utilisateur** : Aucun changement visible pour l'utilisateur final

#### 📁 Fichiers modifiés
- `script.js` : Suppression du code dupliqué des émotions
- `feelings.js` : Implémentation de `FeelingsState` et `FeelingsManager`
- `index.html` : Migration des `onclick` vers `data-action`

#### ✅ Tests effectués
- Navigation entre les sections d'émotions ✓
- Sélection d'émotions et affichage des besoins ✓
- Sélection de besoins et affichage des activités ✓
- Fonctions de retour et redémarrage ✓
- Serveur de test fonctionnel sur le port 8000 ✓

## [Version 2.0.0] - 2024-12-19

### ✨ Nouvelles fonctionnalités
- **Cartes de conseils et d'activités interactives** : Ajout d'animations et de messages d'encouragement lors du clic
  - Animation de pulsation douce lors du clic sur une carte
  - Bulle d'encouragement personnalisée pour chaque conseil et activité avec messages tendres et apaisants
  - Design adapté aux enfants avec icônes flottantes et transitions fluides
  - Messages contextuels encourageant l'enfant à suivre le conseil ou l'activité choisie
  - Fermeture automatique après 8 secondes ou manuelle via bouton de fermeture
  - **Effet sonore** : Son de bulle 'pop' au clic qui ne stoppe pas la musique en cours
  - **Amélioration du design** : Bulle plus arrondie (30px) et meilleur contraste en mode sombre
  - **Extension aux cartes d'activités** : Fonctionnalité étendue aux cartes "Voici ce que tu peux faire"
  - Nouveau fichier `js/tips.js` pour gérer toutes les interactions
  - Styles CSS dédiés avec animations douces et design apaisant optimisé pour le mode sombre

## Version 1.3.1 - Corrections de Positionnement et Transparence

### 🔧 Corrections Critiques
- **Positionnement intelligent** : Correction du problème de positionnement vertical des bulles
  - Détection automatique de l'espace disponible au-dessus et en-dessous de la carte
  - Positionnement adaptatif : au-dessus si possible, sinon en-dessous, ou au centre du viewport
  - Calculs précis tenant compte de la hauteur du viewport et du scroll
- **Contraintes de viewport** : Les bulles restent toujours visibles dans les limites de l'écran
- **Transparence subtile** : Ajout d'une légère transparence (95%) pour un effet plus élégant

### 🎯 Améliorations UX
- **Positionnement centré** : Bulles parfaitement centrées horizontalement sur les cartes
- **Gestion des bords** : Protection contre le débordement hors écran
- **Animation cohérente** : Transparence maintenue dans toutes les phases d'animation

### 📁 Fichiers Modifiés
- `js/tips.js` : Refactoring complet de la logique de positionnement
- `styles.css` : Ajustement de l'opacité et des animations
- `changelog.md` : Documentation des corrections

---

## Version 1.3.0 - Amélioration Majeure des Bulles Interactives

### ✨ Nouvelles Fonctionnalités
- **Messages personnalisés intelligents** : Système de mapping dynamique basé sur le contenu réel des activités
- **Reconnaissance contextuelle** : Messages adaptés automatiquement selon les mots-clés des activités
- **Fallback intelligent** : Message par défaut personnalisé avec le titre de l'activité si aucun template ne correspond

### 🎨 Design de Bulle Révolutionné
- **Dégradés sophistiqués** : Arrière-plan avec dégradé subtil multi-couleurs (violet, bleu, lavande)
- **Effets visuels avancés** :
  - Animation de shimmer continue
  - Effet d'entrée avec rotation et rebond
  - Glow animé autour de l'icône
  - Ombres colorées et inset highlights
- **Dimensions optimisées** : Bulle plus large (320px) avec padding généreux
- **Backdrop-filter amélioré** : Flou de 15px avec saturation pour un effet premium

### 🔧 Corrections Techniques Majeures
- **Mapping corrigé** : Fin de la confusion entre index et contenu réel des activités
- **Timing optimisé** : Délai d'affichage ajusté (400ms) avec transition fluide
- **Gestion des états** : Nettoyage automatique des bulles existantes avant affichage
- **Templates étendus** : 20+ templates couvrant tous les types d'activités

### 📋 Templates d'Activités Supportés
- **Repos** : sieste, dormir, bain, boissons chaudes
- **Musique** : écouter, chanter, danser
- **Créativité** : dessiner, colorier, créer
- **Lecture** : lire, livres
- **Physique** : respirer, bouger, sport, évacuation
- **Social** : parler, appeler, câlins
- **Nature** : observer, connexion naturelle
- **Réconfort** : peluches, couvertures, pleurer

### 🎯 Améliorations UX
- **Animations fluides** : Entrée avec rotation et effet de rebond
- **Feedback visuel riche** : Icônes avec glow et animations flottantes
- **Positionnement intelligent** : Bulle positionnée de manière optimale
- **Auto-masquage** : Disparition automatique après 8 secondes

### 📁 Fichiers Modifiés
- `js/tips.js` : Refactoring complet du système de messages avec mapping intelligent
- `styles.css` : Design de bulle entièrement repensé avec effets avancés
- `changelog.md` : Documentation des améliorations majeures

---

## Version 1.2.0 - Améliorations des Cartes Interactives

### ✨ Nouvelles Fonctionnalités
- **Extension aux cartes d'activités** : Les fonctionnalités interactives s'appliquent maintenant aussi aux cartes d'activités
- **Effet sonore de bulle** : Ajout d'un son "pop" agréable lors du clic sur les cartes
- **Messages d'encouragement personnalisés** : Messages adaptés pour chaque type de carte (conseils et activités)

### 🎨 Améliorations du Design
- **Bulle plus arrondie** : Rayon de bordure augmenté pour un aspect plus doux
- **Meilleur contraste en mode sombre** : Texte plus lisible avec `font-weight: 500`
- **Queue de bulle améliorée** : Utilisation des variables CSS et ombre portée ajustée
- **Effet de flou d'arrière-plan** : `backdrop-filter: blur(10px)` pour un effet moderne

### 🔧 Améliorations Techniques
- **Code modulaire** : Méthode commune `displayEncouragementBubble()` pour les deux types de cartes
- **Gestion robuste** : Gestion d'erreur pour le chargement du son
- **Performance optimisée** : Délégation d'événements pour les cartes d'activités
- **Timing amélioré** : Synchronisation parfaite entre son, animation et affichage du message

### 📁 Fichiers Modifiés
- `js/tips.js` : Ajout des fonctionnalités sonores et extension aux activités
- `styles.css` : Améliorations du design de la bulle et du contraste
- `changelog.md` : Documentation des nouvelles fonctionnalités

### 🎯 Fonctionnalités Testables
- Cliquer sur les cartes dans les sections "Conseils" et "Activités" pour entendre le son et voir les messages
- Tester en mode sombre pour vérifier la lisibilité améliorée
- L'effet sonore ne bloque pas les autres sons de l'application

### ✅ Terminé
- ✅ Intégration complète de la section "Comment te sens-tu ?" dans l'application principale
- ✅ Navigation fluide entre les sections émotions, besoins et activités
- ✅ Design uniforme avec le reste de l'application
- ✅ Boutons de retour et de recommencement fonctionnels
- ✅ Cartes d'émotions avec animations et interactions
- ✅ Système de sélection d'émotions, besoins et activités
- ✅ Intégration dans la section Conseils de l'application principale
- ✅ Correction du problème de navigation du bouton "Comment te sens-tu ?"
- ✅ Correction du problème de chargement des fichiers MP3 avec Tone.js
- ✅ Ajout de logs de débogage pour diagnostiquer les problèmes restants
- ✅ Restauration du design original des cartes de besoins et d'activités
- ✅ Ajout des icônes appropriées pour tous les besoins et activités
- ✅ Harmonisation du style visuel avec le design original
- ✅ Correction des problèmes de logique de navigation dans la section émotions/besoins
- ✅ Correction du problème de lecture des fichiers MP3 (berceuse, ballade)
- ✅ Amélioration de la gestion des états de sélection lors des retours en arrière
- ✅ Ajout de transitions fluides entre les sections émotions ↔ besoins ↔ activités
- ✅ Amélioration du debugging pour diagnostiquer les problèmes de lecture MP3
- ✅ Optimisation des transitions (200ms) avec easing cubic-bezier pour plus de fluidité
- ✅ Ajout de will-change: opacity pour optimiser les performances d'animation

### 🔧 Améliorations techniques
- **Transform reset** : Réinitialisation du contexte canvas à chaque resize
- **Dimensions minimales** : Garantie de taille minimum 200x150px
- **Fallback dimensions** : Calculs de secours pour compatibilité
- **Console logging** : Suivi détaillé des opérations visuelles
- **🆕 initializeVisualsSection()** : Nouvelle méthode pour garantir l'affichage correct du premier visuel

## [Version 2.7.2] - 2024-12-22

### 🖥️ Améliorations Responsives Majeures
- **Canvas adaptatif** : Redimensionnement intelligent selon la taille d'écran
- **Ratios d'aspect optimisés** : 16:9 mobile, 16:10 tablette, 4:3 desktop
- **Rendu haute définition** : Support du device pixel ratio pour écrans Retina
- **Dimensions fluides** : Utilisation de vh/vw pour une adaptation parfaite
- **Gestion orientation** : Adaptation automatique portrait/paysage

### 🎯 Mode Plein Écran Immersif
- **Bouton plein écran** : Nouveau contrôle dans les options visuelles
- **Immersion totale** : Affichage des visuels sur tout l'écran
- **Compatibilité navigateurs** : Support Webkit, Moz, MS et standard
- **Transitions fluides** : Entrée/sortie de plein écran sans interruption
- **Redimensionnement automatique** : Canvas s'adapte instantanément

### 📱 Optimisations Mobiles
- **Contrôles tactiles** : Boutons visuels plus flexibles sur mobile
- **Aspect ratios mobiles** : 16:9 pour une meilleure immersion
- **Performance améliorée** : Rendu optimisé pour appareils mobiles
- **Interface adaptative** : Éléments qui s'ajustent à l'espace disponible

## [Version 2.7.1] - 2024-12-22

### 🔧 Corrections Critiques de Suppression
- **Solution 1** : Création de cartes séparées pour éviter les conflits DOM entre accueil et section profils
- **Solution 2** : Suppression immédiate des éléments DOM avant mise à jour des données
- **Solution 3** : Rechargement sélectif uniquement si la suppression DOM échoue
- **Attributs de traçage** : Ajout de `data-profile-id` et `data-location` pour un suivi précis
- **Gestion d'état vide** : Mise à jour automatique de l'affichage quand aucun profil ne reste
- **Logging renforcé** : Traces détaillées pour le débogage des suppressions

### ✨ Nouvelle Fonctionnalité : Bulle d'Information
- **Bulle interactive** : Bouton d'information en bas à gauche avec animation douce
- **Modal apaisant** : Interface avec effets de bulles flottantes animées
- **Contenu complet** : Présentation de l'application, fonctionnalités et conseils
- **Informations créateur** : Section dédiée à Geoffroy, créateur de l'application
- **Animations fluides** : 8 bulles animées avec mouvements aléatoires
- **Contrôles intuitifs** : Fermeture par clic, Échap ou clic sur l'arrière-plan
- **Design cohérent** : Intégration parfaite avec le thème de l'application

### 🎨 Améliorations Visuelles
- **Animation de pulsation** : Effet subtil sur la bulle d'information
- **Dégradés harmonieux** : Couleurs cohérentes avec la palette de l'application
- **Effets de flou** : Arrière-plan avec `backdrop-filter` pour un effet moderne
- **Transitions fluides** : Animations d'ouverture et fermeture du modal

## [Version 2.7.0] - 2024-12-22

### 🔧 Refonte majeure des profils "Mes Bulles"
- **Sauvegarde sélective** : Ne sauvegarde que les derniers éléments cliqués de chaque section
- **Gestion des valeurs NULL** : Les éléments non cliqués sont sauvegardés comme NULL
- **Suivi intelligent** : Tracking automatique du dernier son, visuel et minuteur sélectionnés
- **Chargement optimisé** : Navigation automatique vers la section Visuels lors du chargement
- **Démarrage automatique** : Le minuteur se lance automatiquement si sauvegardé
- **Compatibilité rétroactive** : Support des anciens profils avec migration automatique

### ✨ Nouvelles fonctionnalités de sauvegarde
- **Son unique** : Sauvegarde du dernier son cliqué avec son volume
- **Visuel unique** : Sauvegarde du dernier visuel sélectionné
- **Minuteur intelligent** : Sauvegarde et démarrage automatique de la durée
- **Messages détaillés** : Résumé des éléments sauvegardés et chargés
- **Interface adaptée** : Affichage optimisé des profils avec gestion des valeurs NULL

### 🎯 Améliorations comportementales
- **Navigation contextuelle** : Redirection vers Visuels si un visuel est chargé
- **Feedback enrichi** : Messages informatifs sur les éléments chargés
- **Gestion d'erreurs** : Robustesse accrue avec logs détaillés
- **Performance** : Chargement plus rapide avec moins d'éléments à traiter

## [Version 2.6.3] - 2024-12-22

### 🔧 Corrections Critiques Supplémentaires
- **Minuteur corrigé** : Le minuteur s'arrête maintenant correctement et ne va plus en négatif
- **Suppression de profils corrigée** : Les profils sont maintenant correctement supprimés de l'affichage
- **Nettoyage des états visuels** : Suppression complète des indicateurs visuels lors du chargement de profils
- **Arrêt du minuteur lors du chargement** : Le minuteur en cours s'arrête automatiquement lors du chargement d'un profil
- **Gestion des conflits sonores** : Nettoyage complet des états visuels des sons avant chargement
- **Logging de débogage** : Ajout de logs détaillés pour la suppression et le chargement

## [Version 2.6.2] - 2024-12-22
 
### 🔧 Corrections Critiques
- **Correction des boutons de profil** : Les boutons "Charger" et "Supprimer" fonctionnent maintenant correctement
- **Feedback visuel amélioré** : Ajout d'animations pour les états de chargement et suppression
- **Gestion d'erreurs robuste** : Meilleure gestion des erreurs lors du chargement des profils
- **Navigation corrigée** : La navigation vers la section visuels fonctionne maintenant
- **Prévention des erreurs null** : Protection contre les références nulles dans setVisual
- **Logging amélioré** : Ajout de logs détaillés pour le débogage

## [Version 2.6.1] - 2024-12-22

### 🔧 Refonte majeure des profils "Mes Bulles"
- **Sauvegarde sélective** : Ne sauvegarde que les derniers éléments cliqués de chaque section
- **Gestion des valeurs NULL** : Les éléments non cliqués sont sauvegardés comme NULL
- **Suivi intelligent** : Tracking automatique du dernier son, visuel et minuteur sélectionnés
- **Chargement optimisé** : Navigation automatique vers la section Visuels lors du chargement
- **Démarrage automatique** : Le minuteur se lance automatiquement si sauvegardé
- **Compatibilité rétroactive** : Support des anciens profils avec migration automatique

### ✨ Nouvelles fonctionnalités de sauvegarde
- **Son unique** : Sauvegarde du dernier son cliqué avec son volume
- **Visuel unique** : Sauvegarde du dernier visuel sélectionné
- **Minuteur intelligent** : Sauvegarde et démarrage automatique de la durée
- **Messages détaillés** : Résumé des éléments sauvegardés et chargés
- **Interface adaptée** : Affichage optimisé des profils avec gestion des valeurs NULL

### 🎯 Améliorations comportementales
- **Navigation contextuelle** : Redirection vers Visuels si un visuel est chargé
- **Feedback enrichi** : Messages informatifs sur les éléments chargés
- **Gestion d'erreurs** : Robustesse accrue avec logs détaillés
- **Performance** : Chargement plus rapide avec moins d'éléments à traiter

## [Version 2.6.1] - 2024-12-22

### 🔧 Corrections importantes
- **Fonctionnalité "Mes Bulles" corrigée** : Le bouton "Charger" fonctionne maintenant correctement
- **Navigation automatique** : Chargement d'un profil navigue automatiquement vers la section Sons
- **Feedback visuel amélioré** : Indicateur de chargement sur le bouton "Charger"
- **Gestion d'erreurs renforcée** : Messages d'erreur clairs si un profil est introuvable
- **Logs de débogage** : Ajout de logs détaillés pour le chargement des profils
- **Synchronisation UI** : Mise à jour automatique du bouton pause/play global lors du chargement

### 🔧 Améliorations UX
- **Messages informatifs** : Messages de la mascotte plus détaillés lors du chargement
- **Délai optimisé** : Petit délai pour assurer le chargement correct de l'interface
- **Sélecteurs améliorés** : Correction des sélecteurs CSS pour les sliders de volume
- **États des boutons** : Désactivation temporaire du bouton pendant le chargement

## [Version 2.6.0] - 2024-12-22

### 🔧 Améliorations majeures du responsive
- **Breakpoints étendus** : Ajout de points de rupture pour tablettes (1024px), paysage mobile (640px) et très petits écrans (360px)
- **Navigation optimisée** : Adaptation intelligente de la taille des boutons et espacement selon l'écran
- **Interface tactile améliorée** : Cibles de touch plus grandes (24px minimum) et états actifs optimisés
- **Grilles adaptatives** : Colonnes flexibles pour tous les composants (sons, conseils, profils)
- **Typographie responsive** : Taille de police fluide avec clamp() pour une lisibilité optimale
- **Accessibilité renforcée** : Support du mode contraste élevé et réduction de mouvement

### 🔧 Améliorations techniques
- **Meta tags mobiles** : Configuration optimale pour les appareils mobiles et PWA
- **Touch scrolling iOS** : Défilement fluide sur tous les appareils Apple
- **États hover intelligents** : Désactivation automatique sur les appareils tactiles
- **Styles d'impression** : Mise en page optimisée pour l'impression
- **Prévention du scroll horizontal** : Élimination des débordements sur petits écrans

### 📱 Responsive par appareil
- **Desktop (>1024px)** : Mise en page complète avec toutes les fonctionnalités
- **Tablette (768-1024px)** : Interface adaptée avec navigation compacte
- **Mobile paysage (640-768px)** : Optimisation pour l'orientation horizontale
- **Mobile portrait (<640px)** : Interface mobile-first avec navigation verticale
- **Petits mobiles (<360px)** : Adaptation pour les très petits écrans

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

### 🐛 Correction de l'erreur CSS
- **Problème résolu** : Suppression de la règle CSS vide pour `.emotion-card`, `.need-card`, et `.activity-card` dans `styles.css`.
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

---

## 📋 TODO - REFACTORISATION PRIORITAIRE (Suite à l'analyse v2.11.0)

### 🚨 URGENT - Refactorisation des Gros Fichiers
- [ ] **script.js (1843 lignes)** :
  - [ ] Extraire VisualRenderer.js (animations canvas)
  - [ ] Créer ThemeManager.js (gestion thèmes)
  - [ ] Séparer UIController.js (interactions UI)
  - [ ] Implémenter Application.js (orchestrateur)
  - [ ] Créer EventBus.js (communication inter-modules)

- [ ] **AudioManager.js (1138 lignes)** :
  - [ ] Extraire SoundFactory.js
  - [ ] Créer ToneGenerators.js
  - [ ] Séparer VolumeController.js
  - [ ] Optimiser la structure des classes

- [ ] **CSS volumineux** :
  - [x] ~~Supprimer styles-old.css (2728 lignes)~~ ✅ FAIT v2.11.1
  - [ ] Diviser _animations.css (815 lignes) par catégories
  - [x] ~~Consolider les imports CSS redondants~~ ✅ FAIT v2.11.1

### ⚠️ MAJEUR - Architecture Modulaire
- [ ] **Système d'événements centralisé** :
  - [ ] Implémenter EventBus pattern
  - [x] ~~Remplacer les variables globales~~ ✅ FAIT v2.11.1
  - [ ] Coordonner l'initialisation des modules

- [ ] **Gestion d'état centralisée** :
  - [ ] Créer StateManager.js
  - [ ] Migrer l'état dispersé vers un store central
  - [ ] Implémenter des observateurs d'état

### 🔧 MODÉRÉ - Nettoyage et Optimisation
- [ ] **Suppression de code obsolète** :
  - [ ] Nettoyer les commentaires TODO anciens
  - [ ] Supprimer les fonctions non utilisées
  - [ ] Optimiser les sélecteurs CSS

- [ ] **Amélioration de la maintenabilité** :
  - [ ] Ajouter des tests unitaires
  - [ ] Documenter les APIs des modules
  - [x] ~~Standardiser les conventions de nommage~~ ✅ FAIT v2.11.1

### 📊 MÉTRIQUES CIBLES POST-REFACTORISATION
- [ ] **Taille des fichiers** : <500 lignes par fichier
- [ ] **Complexité cyclomatique** : <10 par fonction
- [ ] **Couplage** : Faible entre modules
- [ ] **Cohésion** : Forte dans chaque module
- [ ] **Couverture de tests** : >80%
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

*Dernière mise à jour : 19 mai 2025*