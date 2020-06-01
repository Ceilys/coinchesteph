// Gestion du déplacement - Drag & Drop avec les doigts
var doigt = {
	// Propriété
	version : 1,
	date : 20180208,

	// Gestion du glissé déposé avec le doigt
    go: function(element, yid) 
    {
        let dropper = document.querySelector("#" + element);
        let dragger = document.querySelector('#tapis1');
    	
    	// Annule l'interdiction de drop
    	dropper.addEventListener('dragover', function(e) {e.preventDefault(); } ) 

    	// On joue la carte sélectionnée
    	dragger.addEventListener('touchstart', function(e) {
    	    //console.log('touchstart' + e.srcElement.id);

            // Récupération de la carte cible
            let ydrop = document.getElementById(element).id;
            let xdrag = e.srcElement.id;

             // Vérifie si on le droit de poser la carte
            let result = jeu.tapis.depAuto(document.getElementById(element).draggable);

            // Déplacement source -> cible
            if (result == true) {
                //On enlève le http à l'image
                if (xdrag.indexOf('http') !== -1) {
                    let xsplit = xdrag.split('/img');
                    xdrag = '../../img' + xsplit[1];
                }
                jeu.tapis.remplace(xdrag, ydrop, yid); // On bouge la carte
                ajoue(xdrag);
                //cartefleche.src = 'img/vide.png';      // On efface la carte du milieu
            } 


    	}); // touchstart

        /*
    	dropper.addEventListener('touchend', function(e) {
    	    console.log('touchend' + e.srcElement.id);
    		e.preventDefault(); 
    	// Cette méthode est toujours nécessaire pour éviter une éventuelle redirection inattendue
          
    	// Récupération des variables
    	var cartefleche = document.getElementById("glissc"); // Carte associée à la flêche
    	var xdrag2 = cartefleche.src; 	// On récupère le fichier qu'il faut nettoyer
    	var xdrag = xdrag2.substring(xdrag2.lastIndexOf('img') + 0); 
    	var ydrop = e.target.id;                          // Récupération de la carte cible
     	var yid   = e.target.parentNode.id;               // Récupération du tapis concerné
    	console.log('Drag & drop ' + xdrag + '-' + ydrop);
    	
    	var result = jeu.regles.verif(xdrag,ydrop,yid);   // Vérifie si on le droit de poser la carte
    	console.log('Résultat du drop' + result);
    	
    	if (result == true)  
    	{
    		jeu.tapis.remplace(xdrag,ydrop,yid);         // On bouge la carte 
    		cartefleche.src = 'img/vide.png';            // On efface la carte du milieu
    	}
    	else {
    	    alert("Vous ne pouvez pas mettre cette carte là !"); // On ne peut pas la mettre là
    	} //if
    	
    	}); // touchend
        */
    } // fin
 } // fin doigt
