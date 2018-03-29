#Concept
Site web responsive permettant jouer au Killer.

#Définition du Killer (Wikipédia)
Le jeu des assassins, également appelé jeu de l'assassin, Gotcha, Killer ou paranoïa, est un jeu de rôle grandeur nature où le but des joueurs est de simuler l'assassinat d'autres joueurs, à l'aide d'armes factices et de jouets (pistolet à eau, pétard...). Ce jeu est généralement joué dans les campus universitaires et parmi les communautés de lycéens

#Outils Nécessaires
NodeJS


#Configuration projet Angular
Télécharger NodeJS sur https://nodejs.org/en/ puis lancer l'instalation.

Le projet sur GitLab contient toutes les dépendances nécessaire à celui-ci. Une fois le projet cloné faire "npm start" pour lancer le serveur au localhost:4200.

En cas de soucis lors de la compilation, faire les étapes suivantes :



rm -rf node_modules 
npm install
npm cache clean --force
npm run-script build
npm start ( pour lancer le serveur )

#Configuration serveur Apache et Base de données
Dans la branche killer_directus se trouve les dossiers concernant le CMS directus (voir Directus sur confluence pour plus d'informations). NE RIEN MODIFIER DANS killer_directus.

Télécharger un serveur Apache et la base de données MySql : Exemple avec Xampp avec un php 5.6 https://www.apachefriends.org/fr/index.html.

un dossier directus_killer: qu'il faut placer dans le dossier htdocs du serveur.
Créer une base de données "killer" avec l'interface phpmyadmin de xampp et importer le fichier killer.sql
Accès à l'interface d'administration de directus:
url : http://localhost/killer/login.php
user : thehivekiller@capgemini.com
pwd : TheHiveKiller
