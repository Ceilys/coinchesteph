// Constitution du jeu de carte
var jeu = {
    // Propriété
    version: 1,
    date: 20180203,
    jeu: 32, // jeu de 32 cartes

    // Initialisation de l'écran
    init: function(pseudo, j1, j2, j3, j4) {
        var quijoue = document.getElementById("quijoue");
        quijoue.innerHTML = "";

        // Première donne, joueur4 distribue
        jeu.tapis.initpaquet(pseudo, j4, j1, j2, j3, j4);

        // Autorise que la dépose sur la carte du pseudo
        depl.go("#carte" + pseudo);

        if (pseudo === j1) doigt.go("carte" + pseudo, "quatre1");
        if (pseudo === j2) doigt.go("carte" + pseudo, "quatre2");
        if (pseudo === j3) doigt.go("carte" + pseudo, "quatre3");
        if (pseudo === j4) doigt.go("carte" + pseudo, "quatre4");

    }, // Fin init */

    // Action sur le jeu de carte
    tapis: {
        // Init qui joue
        info: function(elt, text) {
            let domElt = document.getElementById(elt);
            if (domElt) {
                switch (elt) {
                    case "regle":
                        if (text === 'S') {
                            domElt.innerHTML = "Coinche Stéphanoise";
                            domElt.className = "steph"
                        }
                        if (text === 'L') {
                            domElt.innerHTML = "Coinche Lyonnaise";
                            domElt.className = "lyon"
                        }
                        let domEltMob = document.getElementById("regleMob");
                        domEltMob.innerHTML = domElt.innerHTML;
                        break;

                    case "enchCouleur":
                        domElt.innerHTML = text;
                        if (text === "♥" || text === "♦") {
                            document.getElementById(elt).style = "color:red";
                        } else {
                            if (text === "♠" || text === "♣") {
                                document.getElementById(elt).style = "color:black";
                            } else {
                                document.getElementById(elt).style = "color:grey";
                            }
                        }
                        break;

                    case "quijoue":
                        domElt.innerHTML = "C'est à " + text;
                        break;

                    case "result":
                        if (typeof text === "object") {
                            // Vérification s'il y a un score précédent
                            let eq1 = document.getElementById("masqueEq1").innerHTML;
                            let eq2 = document.getElementById("masqueEq2").innerHTML;
                            if (eq1) {
                                eq1 = parseInt(eq1) + parseInt(text.eq1);
                                document.getElementById("masqueEq1").innerHTML = eq1;
                            } else {
                                eq1 = text.eq1;
                                document.getElementById("masqueEq1").innerHTML = text.eq1;
                            }
                            if (eq2) {
                                eq2 = parseInt(eq2) + parseInt(text.eq2);
                                document.getElementById("masqueEq2").innerHTML = eq2;
                            } else {
                                eq2 = text.eq2;
                                document.getElementById("masqueEq2").innerHTML = text.eq2;
                            }

                            // Affichage des informations
                            let textnode = {};
                            let div0 = document.createElement("DIV");
                            div0.className = "res0";
                            let div1 = document.createElement("DIV");
                            div1.className = "res1";
                            textnode = document.createTextNode(eq1);
                            div1.appendChild(textnode);
                            let div2 = document.createElement("DIV");
                            div2.className = "res2"
                            textnode = document.createTextNode(eq2);
                            div2.appendChild(textnode);
                            div0.appendChild(div1);
                            div0.appendChild(div2);
                            domElt.appendChild(div0);
                        } else {
                            let div0 = document.createElement("DIV");
                            let textnode = document.createTextNode(text);
                            textnode.className = "restxt";
                            div0.appendChild(textnode);
                            domElt.appendChild(div0);
                        }

                        break;

                    default:
                        domElt.innerHTML = text;
                        break;
                }
            }
        },

        // Init les enchères
        initenchere: function(fpoints, fcouleurs) {
            let points = fpoints.split(',');
            let couleurs = fcouleurs.split(",");
            // Affichage des enchères
            document.getElementById("popupEnchere").style.visibility = "visible";
            //            document.getElementById("affEnchere").style.visibility = "hidden";
        },

        // Init 4 cartes
        init4cartes(j1, j2, j3, j4) {
            let cartex = document.getElementById("carte" + j1);
            cartex.src = '../../img/vide.png';
            cartex = document.getElementById("carte" + j2);
            cartex.src = '../../img/vide.png';
            cartex = document.getElementById("carte" + j3);
            cartex.src = '../../img/vide.png';
            cartex = document.getElementById("carte" + j4);
            cartex.src = '../../img/vide.png';
        },

        // Init paquet de distribution de carte
        initpaquetdist(typeC) {
            if (typeC === 'S') {
                document.getElementById("go8").style.visibility = "collapse";
                document.getElementById("go6").style.visibility = "visible";
                document.getElementById("go2").style.visibility = "collapse";
            } else {
                document.getElementById("go8").style.visibility = "visible";
                document.getElementById("go6").style.visibility = "collapse";
                document.getElementById("go2").style.visibility = "collapse";
            }
        },

        // Init paquet pour distribution
        initpaquet(pseudo, j, j1, j2, j3, j4) {
            document.getElementById("paquet" + j1).style.visibility = "hidden";
            document.getElementById("paquet" + j2).style.visibility = "hidden";
            document.getElementById("paquet" + j3).style.visibility = "hidden";
            document.getElementById("paquet" + j4).style.visibility = "hidden";
            if (j !== "") { // On voit le paquet à côté du joueur qui a donné
                document.getElementById("paquet" + j).style.visibility = "visible";
            }
        },

        // Bloque carte 
        bloquecarte(j1, bool) {
            let cartex = document.getElementById("carte" + j1);
            cartex.draggable = bool;
        },

        // A joué, mise à jour de la table
        ajoue(card, pseudo) {
            let cartex = document.getElementById("carte" + pseudo);
            cartex.src = card;
        },

        // Répartition des cartes sur les tapis avant distribution
        distribution: function(pseudo, j1, j2, j3, j4, LCartes, nbCartes) {
            var eff = true,
                f78 = false;
            if (nbCartes === '2') eff = false;
            if (nbCartes === '6') f78 = true;

            switch (pseudo) {
                case j1:
                    jeu.tapis.distrib("tapis1", LCartes, 0, 7, true, eff, f78);
                    break;
                case j2:
                    jeu.tapis.distrib("tapis1", LCartes, 8, 15, true, eff, f78);
                    break;
                case j3:
                    jeu.tapis.distrib("tapis1", LCartes, 16, 23, true, eff, f78);
                    break;
                case j4:
                    jeu.tapis.distrib("tapis1", LCartes, 24, 31, true, eff, f78);
                    break;
            }
        },

        // Distribution des cartes sur le tapis
        //                élément, jeu, index départ, index arrivé, draggable ?, effacer tapis, compléter carte 7 et 8
        distrib: function(myElement, LCartes, index, nbCarte, drag, eff, f78) {
            // Suppression des annonces 
            document.getElementById("enchQui").innerHTML = "";
            document.getElementById("enchCombien").innerHTML = "";
            document.getElementById("enchCouleur").innerHTML = "";
            document.getElementById("acoinche").innerHTML = "";
            document.getElementById("asurcoinche").innerHTML = "";
            document.getElementById("annQui").innerHTML = "";
            document.getElementById("annCombien").innerHTML = ""; 
            document.getElementById("enchCombien").innerHTML = "";
            document.getElementById("monannonce").innerHTML = "";

            var num = 1;
            var tapis = document.getElementById(myElement);
            // Suppression avant distribution (sauf pour les 2 cartes à la coinche stéphanoise)
            if (eff) {
                while (tapis.firstChild) {
                    tapis.removeChild(tapis.firstChild);
                }
            }

            for (let i = index, src_i = "", id = "", image = {}, j = 1, lclass = 'carte'; i <= nbCarte; i++, j++) {
                src_i = LCartes[i]; // Chaque carte a son image
                //if (nbCarte > 5) src_i = '../../img/vide.png'; // On affiche simplement les cartes du petit cadran 
                id = LCartes[i]; // L'id de la carte est stockée à ce moment

                // 4 cartes sont mises de côté : la place des as
                //if ((i == 0 || i == 8 || i == 16 || i == 24) && nbCarte > 5) { src_i = '../../img/vide.png';
                //    id = 'AS' + i };

                if ((j === 7 || j === 8) && f78) {
                    id = j;
                    lclass = 'cache';
                }

                // Il y a 4 tapis et un tapis supplémentaire
                // On alimente les 4 tapis de 8 cartes + le tapis complémentaire 
                image = createSimpleNode('img', {
                    src: src_i,
                    id: id,
                    alt: 'mes cartes à jouer',
                    class: lclass,
                    draggable: drag
                });
                tapis.appendChild(image);
            } // fin for

        }, // fin dristrib

        // Change les cartes 7 et 8
        change78: function() {

            document.getElementById('7').className = 'carte';
            document.getElementById('8').className = 'carte';

            //On enlève le http à l'image
            let xsplit = [];
            if (document.getElementById('7').src.indexOf('http') !== -1) {
                xsplit = document.getElementById('7').src.split('/img');
                document.getElementById('7').id = '../../img' + xsplit[1];
            }
            //On enlève le http à l'image
            if (document.getElementById('8').src.indexOf('http') !== -1) {
                xsplit = document.getElementById('8').src.split('/img');
                document.getElementById('8').id = '../../img' + xsplit[1];
            }
        },

        // Remplace une carte par une autre
        remplace: function(x, y, z) {
            var cartex = document.getElementById(x) // Carte au départ
            var cartey = document.getElementById(y) // Carte à l'arrivée
            var cartez_id = document.getElementById(x).id;
            var cartez_src = document.getElementById(x).src

            //On enlève le http à l'image
            if (cartez_src.indexOf('http') !== -1) {
                let xsplit = cartez_src.split('/img');
                cartez_src = '../../img' + xsplit[1];
            }

            // Inversion des deux cartes
            cartex.remove();
            //cartex.id = cartey.id;
            //cartey.id = cartez_id;
            //cartex.src = cartex.id; // On affiche la carte au lieu de vide
            cartey.src = cartez_src;

        }, // fin remplace

        // Vérification autorisation déplacement
        depAuto: function(eDraggable) {
            let rResult = true;
            if (eDraggable === false) {
                rResult = false;
                alert("Ce n'est pas votre tour, mon petit gars !");
            }
            if (document.getElementById("enchCouleur").innerHTML == "") {
                rResult = false;
                alert("A la coinche, il faut au moins une enchère !");
            }
            return rResult;
        },

        // Joueur a effectué une enchère goecnh('ench' + '+')
        enchereplusmoins: function(typeC, typeE, ench, action) {
            let returnE = "",
                returnC = {},
                coul = "";
            if (typeE === 'ench') {
                if (typeC === 'S') {
                    switch (ench) {
                        case '82':
                            action === '+' ? returnE = 85 : returnE = '82';
                            break;
                        case '85':
                            action === '+' ? returnE = 90 : returnE = '82';
                            break;
                        case '160':
                            action === '+' ? returnE = "capot" : returnE = '155';
                            break;
                        case 'capot':
                            action === '+' ? returnE = "capot" : returnE = '160';
                            break;
                        default:
                            action === '+' ? returnE = parseInt(ench) + 5 : returnE = parseInt(ench) - 5;
                            break;
                    }
                } else {
                    switch (ench) {
                        case '80':
                            action === '+' ? returnE = 90 : returnE = '80';
                            break;
                        case '250':
                            action === '+' ? returnE = "capot" : returnE = '240';
                            break;
                        case 'capot':
                            action === '+' ? returnE = "260" : returnE = '250';
                            break;
                        case '500':
                            action === '+' ? returnE = "500" : returnE = '490';
                            break;
                        default:
                            action === '+' ? returnE = parseInt(ench) + 10 : returnE = parseInt(ench) - 10;
                            break;
                    }
                }
            }

            // Case of colors
            if (typeE === 'coul') {
                switch (ench) {
                    case "♥": // Coeur
                        returnE = "♣";
                        break;
                    case "♣": //trèfle
                        returnE = "♦";
                        break;
                    case "♦": //carreau
                        returnE = "♠";
                        break;
                    case "♠": // pique
                        returnE = "☒";
                        break;
                    case "☒":
                        returnE = "♥";
                        break;
                    case "Sans Atout":
                        returnE = "♡";
                        break;
                    default:
                        returnE = "♥";
                        break;
                }

                if (returnE === "♥" || returnE === "♦") {
                    coul = "color:red";
                } else {
                    if (returnE === "♠" || returnE === "♣") {
                        coul = "color:grey";
                    } else {
                        coul = "color:darkgrey";
                    }
                }
            }

            // Case of annonce
            if (typeE === 'annonce') {
                switch (ench) {
                    case '':
                        action === '+' ? returnE = 20 : returnE = '';
                        break;
                    case '20':
                        action === '+' ? returnE = 30 : returnE = '';
                        break;
                    default:
                        action === '+' ? returnE = parseInt(ench) + 10 : returnE = parseInt(ench) - 10;
                        break;
                }
            }

            returnC.ench = returnE;
            returnC.couleur = coul;
            return returnC;
        },

        // Joueur a effectué une coinche
        coinche: function(pseudo) {
            if (!document.getElementById("acoinche").innerHTML) {
                document.getElementById("acoinche").innerHTML = pseudo + " a coinché"
            } else {
                if (!document.getElementById("asurcoinche").innerHTML) {
                    document.getElementById("asurcoinche").innerHTML = pseudo + " a surcoinché";
                } else {
                    document.getElementById("acoinche").innerHTML = "";
                    document.getElementById("asurcoinche").innerHTML = "";
                }
            }
        }


    }, // fin tapis /////

};