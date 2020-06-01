// Gestion du déplacement - Drag & Drop avec la souris
var depl = {
    // Propriété
    version: 1,
    date: 20180208,

    // Gestion du glissé déposé avec la souris
    go: function(element) {
        let dropper = document.querySelector(element);
        let dragger = document.querySelector('#tapis1');

        // Activation des touches 
        dropper.addEventListener('dragover', function(e) {
            e.preventDefault();
        }) // Annule l'interdiction de drop

        
        dragger.addEventListener('dragstart', function(e) {
        	/*
        	e.dataTransfer.setData('text/plain', e.srcElement.id);
 
            // Si le tapis est complet, on le vide
            let cartej1 = document.getElementById("carte" + document.getElementById("j1").innerHTML).src.indexOf('vide');
            let cartej2 = document.getElementById("carte" + document.getElementById("j2").innerHTML).src.indexOf('vide');
            let cartej3 = document.getElementById("carte" + document.getElementById("j3").innerHTML).src.indexOf('vide');
            let cartej4 = document.getElementById("carte" + document.getElementById("j4").innerHTML).src.indexOf('vide');
            if (cartej1 === -1 && cartej2 === -1 && cartej3 === -1 && cartej2 === -1) {
            	jeu.tapis.init4cartes(document.getElementById("j1").innerHTML ,
            		document.getElementById("j2").innerHTML ,
            		document.getElementById("j3").innerHTML ,
            		document.getElementById("j4").innerHTML );
            }       	
        	// On fait disparaître la flèche à chaque fois que l'on joue à la souris
        	//var eltglisser = document.getElementById("glisser");
        	//eltglisser.hidden = true; */
        }); 

        dropper.addEventListener('drop', function(e) {
            // Cette méthode est toujours nécessaire pour
            // éviter une éventuelle redirection inattendue
            e.preventDefault();

            // Récupération de la carte envoyée
            var xdrag = e.dataTransfer.getData('text/plain');


            // Récupération de la carte cible
            var ydrop = e.target.id;

            // Récupération du tapis concerné
            var yid = e.target.parentNode.id;
            //console.log('Drag & drop souris ' + xdrag + ' - ' + ydrop + ' - ' + yid);

            // Vérifie si on le droit de poser la carte
            let result = jeu.tapis.depAuto(e.target.draggable);

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

        }); // fin drop
    } // fin go
} // fin depl

// dropper.addEventListener('dragenter', function() { });
// dropper.addEventListener('dragleave', function() { });
// document.addEventListener('dragend', function() { );