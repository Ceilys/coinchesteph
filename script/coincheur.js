const nomRes = "joueur"; // Name reserved
const gamerBytable = 4; // Player by table

var deck = [
    ["❤️", "Ace", 11],
    ["❤️", "Seven", 7],
    ["❤️", "Eight", 8],
    ["❤️", "Nine", 9],
    ["❤️", "Ten", 10],
    ["❤️", "Jack", 2],
    ["❤️", "Queen", 3],
    ["❤️", "King", 4],
    ["♠️", "Ace", 11]
    ["♠️", "Seven", 7],
    ["♠️", "Eight", 8],
    ["♠️", "Nine", 9],
    ["♠️", "Ten", 10],
    ["♠️", "Jack", 2],
    ["♠️", "Queen", 3],
    ["♠️", "King", 4],
    ["♦️", "Ace", 11],
    ["♦️", "Seven", 7],
    ["♦️", "Eight", 8],
    ["♦️", "Nine", 9],
    ["♦️", "Ten", 10],
    ["♦️", "Jack", 2],
    ["♦️", "Queen", 3],
    ["♦️", "King", 4],
    ["♣️", "Ace", 11],
    ["♣️", "Seven", 7],
    ["♣️", "Eight", 8],
    ["♣️", "Nine", 9],
    ["♣️", "Ten", 10],
    ["♣️", "Jack", 2],
    ["♣️", "Queen", 3],
    ["♣️", "King", 4],
];

// Create a new player
var newPlayer = function(pseudo, gameList, save) {
    var errP = "";
    // Player exists ?
    if (gameList.indexOf(pseudo) !== -1 || pseudo.indexOf(nomRes) !== -1) {
        errP = 'Exist';
    } 

    // Vérification format pseudo
    var re = /^[a-zA-Z 0-9]+$/;
    if (!pseudo.match(re)) errP = 'PasGlup';
    pseudo = pseudo.replace(/ /g,"_");

    // Si pas d'erreur et option sauvegarde, on sauvegarde le pseudo
    if (errP === "" && save)  gameList.push(pseudo); 
    
    return errP;
}

// Add or delete a player in a game
var newPlayerTable = function(tableG, player) {
    var tableW = tableG;
    for (var i = 0; i < gamerBytable; i++) {
        if (tableW[i].indexOf(nomRes) === 0) {
            tableW[i] = player;
            break;
        } else if (tableG[i] === player) {
            tableW[i] = nomRes + (i + 1);
            break;
        }
    } //for
    return tableW;
}

// Determine le joueur suivant
var suivant = function(tableG, player) {
    let j1 = tableG[0],
        j2 = tableG[1],
        j3 = tableG[2],
        j4 = tableG[3],
        suivant = "";
    if (player === j1) suivant = j2;
    if (player === j2) suivant = j3;
    if (player === j3) suivant = j4;
    if (player === j4) suivant = j1;
    return suivant;
}

// Determine le joueur précédent
var prec = function(tableG, player) {
    let j1 = tableG[0],
        j2 = tableG[1],
        j3 = tableG[2],
        j4 = tableG[3],
        prec = "";
    if (player === j1) prec = j4;
    if (player === j2) prec = j1;
    if (player === j3) prec = j2;
    if (player === j4) prec = j3;
    return prec;
}

// Deck
const randomDeck = (deck) => {
    let i = 0,
        j = 0,
        temp = null

    for (i = deck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
    // console.log(deck)  --uncomment for testing (when using $ node index.js)
    return deck
}

// Construction du jeu de carte
const init = () => {
    // Ajout des cartes correspondantes aux images dans les tables
    let LCartes = [];
    var couleurs = ['t', 'c', 'r', 'p'];
    for (var c = couleurs.length - 1; c >= 0; c--) {
        for (var i = 14; i >= 7; i--) {
            var nom_image = '../../img/' + couleurs[c] + (i < 10 ? ('0' + i) : i) +
                '.png';
            LCartes.push(nom_image);
        }
    }
    return LCartes;
} // Fin init

var points = (typeC) => {
    let pts = [];
    if (typeC === 'S') {
        pts.push(82);
        for (let i = 85; i <= 160; i = i + 5) {
            pts.push(i);
        }
    } else {
        for (let i = 80; i <= 500; i = i + 10) {
            pts.push(i);
        }
    }
    pts.push('capot');
    return pts;
}

var couleurs = (typeC) => {
    // Pas de différences mais possible
    let couleurs = [];
    couleurs.push("❤️ Coeur");
    couleurs.push("♠️ Pique");
    couleurs.push("♦️ Carreau");
    couleurs.push("♣️ Trèfle");
    couleurs.push("SA");
    return couleurs;
}

var score = (card, couleur) => {
    // couleurs = ['t', 'c', 'r', 'p'];
    let atout = "",
        lCol = "",
        lCard = [],
        macarte = "",
        macouleur = "",
        lscore = [];
    lCard = card.split('/img/');
    lCard = lCard[1].split('.png');
    macarte = lCard[0].slice(1, 3);
    macouleur = lCard[0].slice(0, 1);
    //console.log(macarte, macouleur);

    if (couleur === "♥") { atout = 'r'; }
    if (couleur === "♠") { atout = 'p'; }
    if (couleur === "♦") { atout = 'c'; }
    if (couleur === "♣") { atout = 't'; }
    if (couleur === "☒") { atout = 'SA'; }
    if (macouleur === "r") { lCol = '❤️'; }
    if (macouleur === "p") { lCol = '♠️'; }
    if (macouleur === "c") { lCol = '♦️'; }
    if (macouleur === "t") { lCol = '♣️'; }


    switch (macarte) {
        case '07':
            lscore.push(0);
            lscore.push(atout === macouleur ? 21 : 1);
            lscore.push('7 ' + lCol);
            break;
        case '08':
            lscore.push(0);
            lscore.push(atout === macouleur ? 22 : 2);
            lscore.push('8 ' + lCol);
            break;
        case '09':
            lscore.push(atout === macouleur ? 14 : 0);
            lscore.push(atout === macouleur ? 30 : 3);
            lscore.push('9 ' + lCol);
            break;
        case '10':
            lscore.push(10);
            lscore.push(atout === macouleur ? 25 : 7);
            lscore.push('10 ' + lCol);
            break;
        case '11': //valet
            lscore.push(atout === macouleur ? 20 : 2);
            lscore.push(atout === macouleur ? 40 : 4);
            lscore.push('V ' + lCol);
            break;
        case '12': //dame
            lscore.push(3);
            lscore.push(atout === macouleur ? 23 : 5);
            lscore.push('D ' + lCol);
            break;
        case '13': //roi
            lscore.push(4);
            lscore.push(atout === macouleur ? 24 : 6);
            lscore.push('R ' + lCol);
            break;
        case '14': // as
            lscore.push(atout === 'SA' ? 19 : 11);
            lscore.push(atout === macouleur ? 26 : 8); // pour les défausse
            lscore.push('As ' + lCol);
            break;
    }
    lscore.push(atout === macouleur ? true : false);
    lscore.push(macouleur);

    //console.log('score', atout, macouleur, lscore);
    return lscore;
}

var cumul = (table) => {
    let donne = table[5];
    let cumul = 0,
        joueur = "",
        returnS = [],
        pli = [],
        eq1 = 0,
        eq2 = 0;

    //console.log('Donne : ', donne);
    for (var j = donne.length - 4, k = {}, prec = {}, l = 0; j < donne.length; j++) {
        //console.log('Boucle', j, donne);
        k = donne[j];
        if (!k) return;

        // Cumul des points
        cumul = k.point + cumul;

        // Affichage du pli (log)
        pli.push(k.carte);

        // Récupération du plus grand score == joueur vainqueur
        //console.log(k, prec);
        if ((l === 0) ||
            (k.coul === prec.coul && k.score > l) ||
            (k.coul !== prec.coul && k.atout === true && k.score > l)) {
            l = k.score;
            joueur = k.joueur;
            prec = k;
        }
    }

    // Cumul par equipe
    if (joueur === table[0] || joueur === table[2]) {
        eq1 = cumul;
    } else {
        eq2 = cumul;
    }

    returnS.push(cumul);
    returnS.push(joueur);
    returnS.push(pli);
    returnS.push(eq1);
    returnS.push(eq2);
    return returnS;
}


exports.newPlayer = newPlayer;
exports.newPlayerTable = newPlayerTable;
exports.randomDeck = randomDeck;
exports.init = init;
exports.suivant = suivant;
exports.prec = prec;
exports.points = points;
exports.couleurs = couleurs;
exports.score = score;
exports.cumul = cumul;