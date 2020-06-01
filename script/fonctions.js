// Fonctions indépendantes du jeu

// Fonction qui permet d'ajouter des noeuds 
function createSimpleNode(name, options, text, margin) {
    var node = document.createElement(name); /* On crée l'élément */
	
    for (var o in options) { /* On boucle sur les attributs */
        node.setAttribute(o, options[o]);
    }
	
    if (text) { /* Si du texte est défini, on l'insère */
        node.innerHTML = text;
    }
	
    return node; /* Et on retourne l'élément créé */
}

// Fonction pour mélanger un tableau
function randomInt(mini, maxi)
{
     var nb = mini + (maxi+1-mini)*Math.random();
     return Math.floor(nb);
}
 
Array.prototype.shuffle = function(n)
{
     if(!n)
          n = this.length;
     if(n > 1)
     {
          var i = randomInt(0, n-1);
          var tmp = this[i];
          this[i] = this[n-1];
          this[n-1] = tmp;
          this.shuffle(n-1);
     }
}