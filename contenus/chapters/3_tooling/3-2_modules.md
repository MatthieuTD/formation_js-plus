# Modules

## À l'ancienne

On peut "importer" des scripts dans les HTML, via les balises `<script>`, soit en inline, soit en "script-src".

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="code1.js"></script>
    <script src="code2.js"></script>
    <script src="code3.js"></script>
    <script src="code4.js"></script>
    <script src="code5.js"></script>
    <script src="code6.js"></script>
  </head>
  <body></body>
</html>
```

Il y a une vieille habitude de mettre les scripts à la fin du `<body>`. Pourquoi ?

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <main>My content</main>
    <script src="iTakeMyTime.js"></script>
  </body>
</html>
```

### Defer

`defer` permet de dire au navigateur de différer le téléchargement du script.

Le navigateur va alors attendre d'avoir lu tout le HTML et d'avoir construit le DOM avant de télécharger le script `defer`.

L'ordre des scripts déclarés avec `defer` est conservé.

L'évènement `DOMContentLoaded` ne sera généré que lorsque tous les scripts `defer` auront été chargés et exécutés.

Il est intéressant d'utiliser `defer` lorsque vous avez besoin de conserver l'ordre des scripts, ou d'utiliser de faire appel au DOM.

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="code1.js" defer></script>
    <script src="code2.js" defer></script>
  </head>
  <body></body>
</html>
```

### Async

`async` permet de télécharger et d'exécuter un script sans bloquer la suite de l'analyse du HTML.

Les scripts `async` seront donc chargés et exécutés en parallèle.

Néanmoins, un script `async` s'éxecutera dès qu'il sera téléchargé, ce qui signifie que l'ordre des scripts ne sera pas garanti.

Il est intéressant d'utiliser `async` lorsque vous avez des scripts qui fonctionnent en autonomie, comme des scripts d'analytics par exemple.

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="code1.js" async></script>
    <script src="code2.js" async></script>
  </head>
  <body></body>
</html>
```

---

# **_À vos claviers !!!_**

Dans le dossier `src`, créer plusieurs fichiers avec du code

- `createTweetLi.js`
- `createTweetsOl.js`
- `createFilterButton.js`
- `getJson.js`
- `main.js`

et les charger avec `<script src="...">` dans le `<head>`.

---

## Dépendances explicites

Les différents morceaux de code d'une application dépendent les uns des autres. Mais en JavaScript, ces dépendances sont par défaut **implicites**.

On souhaite rendre claires les relations entre fichiers, afin de savoir sans équivoque quel fichier nécessite quels autres fichiers.

On veut donc rendre les dépendances entre fichiers **explicites**.

## Origine des modules: CommonJS (Node.js)

```js
'use strict';

var dep1 = require('module'); // module natif Node ou installé
var dep2 = require('./fichier.js'); // fichier local au projet

// code

module.exports = function (a) {
  var h = dep1(48);
  return h + dep2(a);
};
```

Problème: `require` synchrone

## Modules ES6

Quand on importe un module, on "récupère" ce que ce module exporte.

Le module "point d'entrée" n'exporte rien.

Les modules "feuilles" n'importent rien.

### [`export`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/export)

On peut exporter des valeurs, des objets, des fonctions...

```js
// export par défaut, n'a pas besoin de nom
export default {
  a: 1,
  b: 2,
};

// marche aussi pour les fonctions

export default function () {
  console.log('Coucou');
}

export const maConst = 5; // export secondaire
```

**Il ne peut y avoir qu'un seul `export default` par module.**

### [`import`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/import)

On peut importer depuis un module natif ou installé, ou depuis les fichiers locaux du projet.

```js
// un module importe d'autres modules

import monModule from 'monModule'; // import externe
import maFonction from './monFichierLocal'; // import local

import { pikachu, charmander as salameche } from 'pokemons'; // on importe seulement "pikachu" et "charmander", que je renomme en "salameche"

console.log(pikachu);

import * as pokemons from 'pokemons'; // on importe tous les exports

console.log(pokemons.pikachu);

// ...
```

**Les modules sont par défaut en mode strict !**

## Bundling

On "compile" tout le code en 1 seul (gros) fichier bien construit pour le charger dans le Html.

Il y a plusieurs alternatives disponibles.

- [`browserify`](http://browserify.org/)
- [`webpack`](https://webpack.js.org/)
- [`rollup`](https://rollupjs.org/guide/en)
- [`parcel`](https://parceljs.org/)

Ces outils nécessitent de travailler dans un environnement Node, puis de transformer le code Node en un code compatible navigateur.

Pour utiliser ces outils, il faut donc [installer Node](https://nodejs.org/en/) et un gestionnaire de paquets, [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/en/).

---

# **_À vos claviers !!!_**

On va utiliser [`browserify`](http://browserify.org/).

### Étape 1: [installer NodeJS](https://nodejs.org/en/)

```bash
# vérifier la version
node -v
npm -v
```

### Étape 2: installer Browserify et Babel

```bash
# dans le dossier projet :
npm init -y
npm install browserify watchify --save-dev
npm i babelify @babel/core @babel/preset-env --save-dev

npx browserify src/main.js -o bundle.js -t [ babelify --presets [ @babel/env ] ] -d
# npx watchify src/main.js -o bundle.js -t [ babelify --presets [ @babel/env ] ] -d -v
```

### Étape 3: changer le HTML

Enlever tous les `<script>` et les remplacer par `<script defer src="bundle.js"></script>`

### Étape 4: utiliser `import`/`export` dans nos scripts

`main.js`

```js
import createOl from './createOl.js';
import createButton from './createButton.js';

document.addEventListener('DOMContentLoaded', function () {
  // ... createOl() ...
  // ... createButton() ...
});
```

`createOl.js`

```js
export default function (tweets) {
  // ...
}
```

### Étape 5: ajouter les infos de la date avec [MomentJS](https://momentjs.com/)

```bash
npm install moment
```

```js
import moment from 'moment';

// chercher dans la doc pour afficher depuis quand le tweet a été envoyé
// ...
```

## À suivre: [NPM](./3-3_npm.md)
