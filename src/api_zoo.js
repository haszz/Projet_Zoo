const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

//Connexion MySQL
var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "zoo",
	port: "3306"
});

//INSERT : Animal
app.post('/animals', function (req, res) {
	
	var nom = req.body.nom;
	var race = req.body.race;
	var nourritureParJour = req.body.nourritureParJour;
	var dateDeNaissance = req.body.dateDeNaissance;
	var dateEntreeZoo = req.body.dateEntreeZoo;
	var idCage = req.body.idCage;
	console.log(dateDeNaissance);
	console.log(dateEntreeZoo);
	var query = "INSERT INTO animal (nom,race,nourritureParJour,dateDeNaissance,dateEntreeZoo,idCage) VALUES ('" + nom + "','" + race + "'," + nourritureParJour + ",'" + dateDeNaissance + "','" + dateEntreeZoo + "'," + idCage + ")";
	console.log(query);
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//GET : Animal
app.get('/animals', function (req, res) {

	var query = "SELECT * FROM animal";

	//Filtre par conditon
	var conditions = ["id", "value", "nom", "value", "race", "value", "nourritureParJour", "value", "dateDeNaissance", "value", "idCage", "value"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE TRUE") < 0) {
				query += " WHERE TRUE";
			}
			query += " and " + conditions[index] + "='" +
				req.query[conditions[index]] + "'";
		}
	}

	//Filtre d'ordre
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else
				query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre par pagination 
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
console.log(query);
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});


app.get('/animals/:id', function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animal WHERE id=" + id;
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//UPDATE : Animal
app.put('/animals/:id', function (req, res) {
	var id = req.params.id;

	var nomParametres = ['nom', 'race', 'nourritureParJour', 'dateDeNaissance', 'dateEntreeZoo', 'idCage'];
	var parametres = [req.body.nom, req.body.race, req.body.nourritureParJour, req.body.dateDeNaissance, req.body.dateEntreeZoo, req.body.idCage];

	var query = "UPDATE animal  SET ";
	for (var i = 0; i < parametres.length; i++) {
		if (parametres[i] != null) {
			query += nomParametres[i] + " = '" + parametres[i] + "'";
		} else {
			continue;
		}
		if (i != parametres.length - 1) {
			for (var j = i + 1; j < parametres.length; j++) {
				if (parametres[i] != null) {
					query += ", ";
					break;
				}
			}
		}
	}
	var last = query.substr(query.length - 2);
	
	if(last === ", "){
		query = query.substring(0,query.length - 2) +  " WHERE id=" + id;;
	}else{
		query += " WHERE id=" + id;

	}

console.log(query);

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});

});

//DELETE : Animal
app.delete('/animals', function (req, res) {

	var query = "DELETE FROM animal";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});

app.delete('/animals/:id', function (req, res) {

	var id = req.params.id;
	var query = "DELETE FROM animal WHERE id=" + id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


//INSERT : Cage
app.post('/cages', function (req, res) {
	var nom = req.body.nom;
	var description = req.body.description;
	var taille = req.body.taille;

	var query = "INSERT INTO cage (nom,description,taille) VALUES ('" + nom + "','" + description + "'," + taille + ")";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//GET : Cage
app.get('/cages', function (req, res) {

	var query = "SELECT * FROM cage";

	//Filtre par conditon
	var conditions = ["id", "value", "nom", "value", "description", "value", "taille"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE TRUE") < 0) {
				query += " WHERE TRUE";
			}
			query += " and " + conditions[index] + "='" +
				req.query[conditions[index]] + "'";
		}
	}

	//Filtre d'ordre
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else
				query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre par pagination 
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	console.log(query);

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});


app.get('/cages/:id', function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cage WHERE id=" + id;
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//UPDATE : Cage
app.put('/cages/:id', function (req, res) {
	var id = req.params.id;

	var nomParametres = ['nom', 'description', 'taille'];
	var parametres = [req.body.nom, req.body.description, req.body.taille];

	var query = "UPDATE cage  SET ";
	for (var i = 0; i < parametres.length; i++) {
		if (parametres[i] != null) {
			query += nomParametres[i] + " = '" + parametres[i] + "'";
		} else {
			continue;
		}
		if (i != parametres.length - 1) {
			for (var j = i + 1; j < parametres.length; j++) {
				if (parametres[i] != null) {
					query += ", ";
					break;
				}
			}
		}
	}
	query += " WHERE id=" + id;


	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});

});

//DELETE : Cage
app.delete('/cages', function (req, res) {

	var query = "DELETE FROM cage";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});

app.delete('/cages/:id', function (req, res) {

	var id = req.params.id;
	var query = "DELETE FROM cage WHERE id=" + id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});




//INSERT : Nourriture
app.post('/foods', function (req, res) {
	var nom = req.body.nom;
	var quantiteNourriture = req.body.quantiteNourriture;
	var idAnimal = req.body.idAnimal;

	var query = "INSERT INTO nourriture (nom,quantiteNourriture,idAnimal) VALUES ('" + nom + "','" + quantiteNourriture + "'," + idAnimal + ")";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//UPDATE : Nourriture
app.put('/foods/:id', function (req, res) {
	var id = req.params.id;

	var nomParametres = ['nom', 'quantiteNourriture', 'idAnimal'];
	var parametres = [req.body.nom, req.body.quantiteNourriture, req.body.idAnimal];

	var query = "UPDATE nourriture  SET ";
	for (var i = 0; i < parametres.length; i++) {
		if (parametres[i] != null) {
			query += nomParametres[i] + " = '" + parametres[i] + "'";
		} else {
			continue;
		}
		if (i != parametres.length - 1) {
			for (var j = i + 1; j < parametres.length; j++) {
				if (parametres[i] != null) {
					query += ", ";
					break;
				}
			}
		}
	}
	query += " WHERE id=" + id;


	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});

});

//DELETE : Nourriture
app.delete('/foods', function (req, res) {

	var query = "DELETE FROM nourriture";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});

app.delete('/foods/:id', function (req, res) {

	var id = req.params.id;
	var query = "DELETE FROM nourriture WHERE id=" + id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});





// Nourriture : GET : id : Flitre par champs

app.get('/foods/:id', function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM nourriture WHERE id=" + id;
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

// Nourriture : sans id : Tous les filtres

app.get('/foods', function (req, res) {

	var query = "SELECT * FROM nourriture";
	//Filtre par conditon
	var conditions = ["id", "value", "nom", "value", "quantiteNourriture", "value", "idAnimal", "value"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE TRUE") < 0) {
				query += " WHERE TRUE";
			}
			query += " and " + conditions[index] + "='" +
				req.query[conditions[index]] + "'";
		}
	}

	//Filtre d'ordre
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else
				query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre par pagination 
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});

//INSERT : Personnel
app.post('/staffs', function (req, res) {
	var nom = req.body.nom;
	var prenom = req.body.prenom;
	var salaire = req.body.salaire;

	var query = "INSERT INTO personnel (nom,prenom,salaire) VALUES ('" + nom + "','" + prenom + "'," + salaire + ")";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//UPDATE : Personnel
app.put('/staffs/:id', function (req, res) {
	var id = req.params.id;

	var nomParametres = ['nom', 'prenom', 'salaire'];
	var parametres = [req.body.nom, req.body.prenom, req.body.salaire];

	var query = "UPDATE personnel  SET ";
	for (var i = 0; i < parametres.length; i++) {
		if (parametres[i] != null) {
			query += nomParametres[i] + " = '" + parametres[i] + "'";
		} else {
			continue;
		}
		if (i != parametres.length - 1) {
			for (var j = i + 1; j < parametres.length; j++) {
				if (parametres[i] != null) {
					query += ", ";
					break;
				}
			}
		}
	}
	query += " WHERE id=" + id;


	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});

});

//DELETE : Personnel 
app.delete('/staffs', function (req, res) {

	var query = "DELETE FROM personnel";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});

app.delete('/staffs/:id', function (req, res) {

	var id = req.params.id;
	var query = "DELETE FROM personnel WHERE id=" + id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});





// Personnel : GET : id : Flitre par champs
app.get('/staffs/:id', function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM personnel WHERE id=" + id;
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	console.log(query);

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//Personnel : sans id : Tous les filtres
app.get('/staffs', function (req, res) {

	var query = "SELECT * FROM personnel";
	//Filtre par conditon
	var conditions = ["id", "value","nom","value","prenom","value","salaire","value"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE TRUE") < 0) {
				query += " WHERE TRUE";
			}
			query += " and " + conditions[index] + "='" +
				req.query[conditions[index]] + "'";
		}
	}

	//Filtre d'ordre
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else
				query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre par pagination
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	console.log(query);

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));

	});

});

//SELECT : Foodstat
app.get('/food-stats', function (req, res) {

	var query = "SELECT a.nom,a.nourritureParJour,n.quantiteNourriture FROM animal a,nourriture n WHERE n.idAnimal = a.id";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		var str = "";
		for (var i = 0; i < result.length; i++) {
			var a = result[i].quantiteNourriture / result[i].nourritureParJour;
			str += "il reste " + a + " jours de nourriture à " + result[i].nom + ". <br>";
		}
		res.send(JSON.stringify(str));
	});

});


app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
