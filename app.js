const PORT = process.env.PORT || 5000;
var http = require('http');
var fs = require('fs');
var session = require('cookie-session');
var express = require('express');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Game declaration
var gamer = require('./script/coincheur'),
    gamerList = [],
    playerErr = "",
    gameTable = [];
gamePartie = [];
gameDonne = [];
gameTable.push(["joueur1", "joueur2", "joueur3", "joueur4"]);

/*
let donnetest = [ { joueur: 'chris', card: '../../img/r11.png', score: 20, point: 10 },
  { joueur: 'joueur2', card: '../../img/r14.png', score: 11, point: 3  },
  { joueur: 'joueur3', card: '../../img/t11.png', score: 27, point: 4 },
  { joueur: 'joueur4', card: '../../img/t14.png', score: 9, point: 12  } 
   ] */
//let test = gamer.score('../../img/p11.png', "♠️ Pique");
//console.log('Result = ', test);
//test = gamer.score('../../img/t11.png', "♠️ Pique");
//let test = gamer.cumul(donnetest);
//console.log('Result = ', test);

// Create a server
var app = express();

/* On utilise les sessions */
app.use(session({ secret: 'coinche-stephanoise' }));

var server = http.createServer(app);
// Pass a http.Server instance to the listen method

// Load socket.io
var io = require('socket.io').listen(server);

// def of directories
app.use('/img', express.static(__dirname + '/img'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/script', express.static(__dirname + '/script'));

//* S'il n'y a pas de pseudo dans la session */
app.use(function(req, res, next) {
        if (!req.session.pseudo) {
            req.session.pseudo = "";
            req.session.tablej = "";
        }
        next();
    })

    // First connexion
    .get('/', function(req, res) {
        //console.log('Petit nouveau arrive ' + req.session.pseudo);
        res.render('login.ejs');
    })

    // Later connexion after table creation or direct entry
    .get('/game/:pseudo', function(req, res) {
        if (gamerList.indexOf(req.params.pseudo) === -1 || gamerList.length > 50) {
            res.render('login.ejs');
        } else {
            //console.log('Dans le game :' + req.params.pseudo);
            res.render('welcome.ejs', { pseudo: req.params.pseudo, action: '/create/' + req.params.pseudo + '/' + gameTable.length });
        }
    })

    // Create a new table
    .get('/create/:pseudo/:table', function(req, res) {
        if (gamerList.indexOf(req.params.pseudo) !== -1) {
            res.render('newtable.ejs', {
                gamerList: gamerList,
                tablenum: req.params.table,
                pseudo: req.params.pseudo,
                joueur1: gameTable[req.params.table - 1][0],
                joueur2: gameTable[req.params.table - 1][1],
                joueur3: gameTable[req.params.table - 1][2],
                joueur4: gameTable[req.params.table - 1][3]
            });
        }
    })

    // Create a new table / post
    .post('/create/:pseudo/:table', function(req, res) {
        //console.log('Table création - post');
        res.redirect('/create/' + req.params.pseudo + '/' + req.params.table);
    })

    // Add delete a player in the game
    // Close the table
    .get('/create/:pseudo/:table/:add', function(req, res) {
        // Close the table
        let route = "";
        if (req.params.add.indexOf('close') !== -1) {
            var splitparam = req.params.add.split('close-');
            var regleG = {};
            regleG.typeCoinche = splitparam[1];
            regleG.points = gamer.points(splitparam[1]);
            regleG.couleurs = gamer.couleurs(splitparam[1]);
            let donne = [];
            //console.log('Retour regle', splitparam, regleG);
            gameTable.push(["joueur1", "joueur2", "joueur3", "joueur4"]);
            gameTable[req.params.table - 1].push(regleG);
            gameTable[req.params.table - 1].push(donne); // 5 = donne
            gameTable[req.params.table - 1].push(donne); // 6 = pli
            route = '/game/' + req.params.pseudo;
        } else if (req.params.add === 'cancel') {
            gameTable[req.params.table - 1] = ["joueur1", "joueur2", "joueur3", "joueur4"];
            route = '/game/' + req.params.pseudo;
        } else {
            // Add or delete user on the table
            var addSplit = req.params.add.split("-");
            gameTable[req.params.table - 1] = gamer.newPlayerTable(gameTable[req.params.table - 1], addSplit[1]);
            route = '/create/' + req.params.pseudo + '/' + req.params.table;
        }
        res.redirect(route);
    })

    // Enter in a game
    .get('/table/:table/:pseudo', function(req, res) {
        let regles = gameTable[req.params.table - 1][4];
        if ((!regles) ||
            (req.params.pseudo !== gameTable[req.params.table - 1][0] &&
                req.params.pseudo !== gameTable[req.params.table - 1][1] &&
                req.params.pseudo !== gameTable[req.params.table - 1][2] &&
                req.params.pseudo !== gameTable[req.params.table - 1][3]) ||
            (req.params.table > gameTable.length)) {
            res.render('404.ejs');
        } else {
            res.render('table.ejs', {
                gamerList: gamerList,
                tablenum: req.params.table,
                pseudo: req.params.pseudo,
                joueur1: gameTable[req.params.table - 1][0],
                joueur2: gameTable[req.params.table - 1][1],
                joueur3: gameTable[req.params.table - 1][2],
                joueur4: gameTable[req.params.table - 1][3],
                typeC: regles.typeCoinche,
                points: regles.points,
                couleurs: regles.couleurs

            });
        }
    })

    /* On redirige vers la todolist si la page demandée n'est pas trouvée */
    .use(function(req, res, next) {
        res.render('404.ejs');
    })

// User interactions
io.sockets.on('connection', function(socket, pseudo) {

    // Pseudo creation
    socket.on('new gamer', function(pseudo) {
        playerErr = gamer.newPlayer(pseudo, gamerList, true);
        console.log(pseudo + ' / statut (' + playerErr + ')');
        if (playerErr !== "") {
            socket.emit('exist', playerErr);

        } else {
            pseudo = pseudo.replace(/ /g, "_"); //On remplace les blanc / _ pour la suite
            socket.emit('userOK', pseudo);
            socket.pseudo = pseudo;
            //console.log(pseudo + ' est connecté');
        }
    });

    // List of users
    socket.on('gamer list', function(pseudo) {
        updateUsers(pseudo);
    });

    // Update list on demand
    function updateUsers(pseudo) {
        //console.log('Les tables', gamer.tableDisplayHtml(gameTable, pseudo));
        socket.broadcast.emit('update', gamerList, gameTable);
        socket.emit('update', gamerList, gameTable);
    }

    // Distribution des cartes 
    socket.on('distrib', function(table, pseudo, nbCartes) {
        let regles = gameTable[table - 1][4],
            donneur = "";
        if (!regles) {
            res.render('404.ejs');
        }

        // Pour la coinche stéphanoise, distrib cartes restantes
        // Dans les autres cas, on initialise une partie suivante
        if (nbCartes !== '2') {
            // Installation du jeu de 32
            var LCartesi = gamer.init();
            // On mélange le jeu
            LCartesi = gamer.randomDeck(LCartesi);
            //console.log('Distrib', LCartesi);

            // On trie pour l'affichage
            var LCartes = [];
            LCartes = LCartesi.slice(0, 8).sort()
                .concat(LCartesi.slice(8, 16).sort())
                .concat(LCartesi.slice(16, 24).sort())
                .concat(LCartesi.slice(24, 32).sort());
            //console.log('Distrib triée', LCartes);


            // Premier joueur
            if (regles.joueur1) {
                regles.joueur1 = gamer.suivant(gameTable[table - 1], regles.joueur1);
            } else {
                regles.joueur1 = gameTable[table - 1][0];
            }
            // Donneur = joueur précédent
            donneur = gamer.prec(gameTable[table - 1], regles.joueur1);

            gameTable[table - 1][5] = []; // Init la table des poses
            gameTable[table - 1][6] = []; // Init la table des plis
            //if (premJoueur === 0) { premJoueur = 0; }
        }

        // On envoie le jeu
        //                    evt, table concernée, regles, cartes, 1° joueur, nb carte (6,8 ou 2)
        socket.broadcast.emit('cartes', table, gameTable[table - 1][4], LCartes, regles.joueur1, donneur, nbCartes);
        socket.emit('cartes', table, gameTable[table - 1][4], LCartes, regles.joueur1, donneur, nbCartes);
    });

    // Un joueur a joué
    socket.on('jaijoue', function(table, pseudo, card, coul) {
        let: donne = {},
        pli = {},
        tour = 1,
        numj = 0,
        cumul = 0,
        calcul = [],
        result = {},
        donneur = "",
        lplis = [];
        result.eq1 = 0;
        result.eq2 = 0;

        donne.joueur = pseudo;
        donne.card = card;

        calcul = gamer.score(card, coul); // Calcul score et point joué
        donne.point = calcul[0]; // point de la carte
        donne.score = calcul[1]; // pour connaître qui remporte
        donne.carte = calcul[2]; // carte+couleur
        donne.atout = calcul[3]; // est-ce une carte à l'atout
        donne.coul = calcul[4]; // couleur de ma carte
        //console.log('Calcul ', pseudo, calcul);

        //gamer.ajoue(table, pseudo, card);
        var jsuiv = gamer.suivant(gameTable[table - 1], pseudo);

        // Sauvegarde de la donne
        numj = gameTable[table - 1][5].length;
        switch (numj) {
            // Premier joueur commence
            case 0:
                gameTable[table - 1][5].push(donne);
                tour = 1;
                break;
            case 1:
                gameTable[table - 1][5].push(donne);
                tour = 2;
                break;
            case 2:
                gameTable[table - 1][5].push(donne);
                tour = 3;
                break;
                // Dernier tour
            case 3:
                tour = 4;
                gameTable[table - 1][5].push(donne);
                calcul = gamer.cumul(gameTable[table - 1]);
                if (!calcul[0]) return;
                pli.score = calcul[0];
                pli.vainqueur = calcul[1];
                pli.pli = calcul[2];
                pli.eq1 = calcul[3];
                pli.eq2 = calcul[4];
                gameTable[table - 1][6].push(pli);

                jsuiv = pli.vainqueur; // c'est au vainqueur de jouer le prochain pli

                // Fin du jeu (8 plis)
                lplis = gameTable[table - 1][6];
                if (lplis.length === 8) {
                    // Ajout du 10 de der
                    pli.eq1 > pli.eq2 ? pli.eq1 = pli.eq1 + 10 : pli.eq2 = pli.eq2 + 10;
                    tour = 99;
                    for (var i = lplis.length - 1; i >= 0; i--) {
                        result.eq1 = lplis[i].eq1 + result.eq1;
                        result.eq2 = lplis[i].eq2 + result.eq2;
                    }

                    // Gestion de la capote
                    if (result.eq1 === 0) { result.eq2 = result.eq2 + 90 }; //100 avec le dix de der
                    if (result.eq2 === 0) { result.eq1 = result.eq1 + 90 }; //100 avec le dix de der

                    // Donneur = joueur précédent
                    let regles = gameTable[table - 1][4];
                    donneur = regles.joueur1;

                }
                console.log('Info pli ', jsuiv, result);

                // On efface la table pour le prochain tour
                gameTable[table - 1][5].splice(0);
                break;
        }


        // On envoie le jeu
        //console.log('serv ajoue', table, card, pseudo, jsuiv);
        socket.broadcast.emit('ajoue', table, card, pseudo, jsuiv, tour, pli, result, donneur);
        socket.emit('ajoue', table, card, pseudo, jsuiv, tour, pli, result, donneur);
    });

    // Un joueur a enchéri
    socket.on('enchere', function(table, pseudo, ench, coul, acoinche) {

        // Juste une info à diffuser
        socket.broadcast.emit('aEncheri', table, pseudo, ench, coul, acoinche);
        socket.emit('aEncheri', table, pseudo, ench, coul, acoinche);
    });

    // Un joueur a redistribué
    socket.on('redistrib', function(table, pseudo) {
        // Juste une info à diffuser
        socket.broadcast.emit('redistrib', table, pseudo);
        socket.emit('redistrib', table, pseudo);
    });


    // Un joueur a entré le score de la partie
    socket.on('entrerscore', function(table, pseudo, score1, score2) {
        // Juste une info à diffuser
        socket.broadcast.emit('score', table, score1, score2);
        socket.emit('score', table, score1, score2);
    });
});

// PORT for Heroku!
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));