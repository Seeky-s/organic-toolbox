# Organic toolbox

Nouveau projet autonome. `organic-toolbox` est un nom de travail, pas un package publié.

## Démo

```sh
npm install
npm run dev
```

http://127.0.0.1:3011 — Collection, `/reveal`, `/parallax`, `/guide`.

```sh
npm run build
```

La démo est générée dans `site-dist/`. La configuration Vercel inclut les routes directes. Aucun déploiement n’est effectué automatiquement par ce projet.

## Bibliothèque

```sh
npm run build:lib
npm pack
```

Le build ES module est dans `dist/`. Installer le fichier tgz dans une application React, puis :

```jsx
import { BoxMouseOrganique, LiquidParallax } from 'organic-toolbox';
```

`BoxMouseOrganique` est réexporté du vrai package npm `mouse-reveal-organique@0.1.3`. `LiquidParallax` enveloppe le moteur de la démo Undertow. React et React DOM sont externes au bundle. Le projet reste privé pour éviter une publication accidentelle avec ce nom provisoire.

## Six composants supplémentaires

Chaque composant est exporté séparément et possède son propre fichier dans `src/` :

| Composant | Route | Usage |
| --- | --- | --- |
| OrganicButton | `/button` | Bouton natif au contour animé autonome, comme la surface ; zone de clic stable, sans attraction du curseur. |
| OrganicSurface | `/surface` | Contour vivant autonome derrière des enfants interactifs, sans réaction à la souris. |
| LiquidTransition | `/transition` | Changement de contenu via `transitionKey`, avec vague de couleur. |
| OrganicText | `/text` | Texte simple animé lettre par lettre ; nom accessible complet. |
| AmbientGradient | `/gradient` | Trois masses de couleur en mouvement lent et autonome, sans réaction à la souris. |
| OrganicDivider | `/divider` | Séparation SVG ondulante entre deux sections. |
| InkSpread | `/ink` | Couches de pigment déformées par une texture procédurale. |
| OrganicShadow | `/shadow` | Ombre mouvante sous un contenu immobile. |
| LiquidProgress | `/progress` | Jauge liquide accessible, pilotée par une valeur réelle. |
| OrganicSpotlight | `/spotlight` | Éclairage autonome sur une image. |
| OrganicImageCompare | `/compare` | Comparaison avant/après avec une frontière ondulante. |
| OrganicImageFrame | `/frame` | Découpage de l’image par un cadre autonome. |
| OrganicSkeleton | `/skeleton` | Carte de chargement avec lumière diffuse. |
| OrganicLoader | `/loader` | Gouttes fusionnées par un filtre SVG, label accessible. |

Button, Surface, Text, Gradient et Loader acceptent `intensity` (0–1), `speed` (0.2–3) et `motionDisabled`. Button distingue le mouvement (`motionDisabled`) de l’état natif du bouton (`disabled`). Transition accepte `duration` (300–3000 ms), `color`, `motionDisabled`, et `transitionKey` à changer avec les enfants. Les animations continues s’interrompent hors écran et en onglet masqué ; tous ces nouveaux composants respectent `prefers-reduced-motion`.

Les couleurs du bouton et de la surface se personnalisent via les variables CSS `--organic-button-color` et `--organic-surface-color`. Gradient accepte `colors` (trois couleurs) et Loader `color` et `label`. Aucun CSS de la démo n’est requis pour utiliser les composants.

Les cinq nouveaux composants acceptent aussi `intensity`, `speed`, `motionDisabled` et `style`, sans réaction à la souris. Divider, InkSpread, OrganicShadow et LiquidProgress acceptent `color`. Divider est décoratif : assortissez sa couleur au fond de la section suivante. InkSpread simule une diffusion cyclique d’encre, sans simulation physique. OrganicShadow nécessite un contenu opaque et un parent qui ne coupe pas son ombre. OrganicSpotlight accepte `src` et `alt` : il déplace un masque d’éclairage, sans calcul de relief réel.

LiquidProgress accepte `value`, `max` (100 par défaut) et un `label` accessible. La valeur est bornée entre zéro et le maximum ; la surface se stabilise à 0 % et 100 %. Le composant n’invente pas de progression : fournissez la valeur depuis votre application. Les animations sont suspendues hors écran et dans les onglets masqués, et restent statiques avec la préférence de réduction des animations.

### Les trois expériences supplémentaires

Toutes acceptent `intensity`, `speed`, `motionDisabled` et `style`, sans CSS obligatoire de la démo.

- `OrganicImageCompare` : `before`, `after`, `beforeAlt`, `afterAlt`, `defaultValue` (50). Pour un usage contrôlé : `value` (0–100) et `onValueChange`. Son slider natif fonctionne au toucher et au clavier. Les deux images sont recadrées en cover ; utilisez des cadrages identiques pour un avant/après fidèle.
- `OrganicImageFrame` : `src`, `alt`. Le cadre évolue sans déplacer l’image. Ratio 4/3 par défaut, personnalisable via `style`.
- `OrganicSkeleton` : `label` pour l’état de chargement. Remplacez-le par votre contenu lorsque les données arrivent et réservez les mêmes dimensions dans le conteneur. Il ne simule ni requête ni délai de chargement.

Les nouveaux effets autonomes sont suspendus hors écran. Tous respectent la réduction des animations.
