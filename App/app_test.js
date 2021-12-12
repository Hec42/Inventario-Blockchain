// Modulos y bibliotecas
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var ledgerCommunication = require('./ledgerCommunication');
var app = express();
// var urlencodedParser = bodyParser.urlencoded({ extended: true });
// app.use(bodyParser.json());
// Setting for Hyperledger Fabric
// const { Gateway,Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
//const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
  //      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Configuracion del servidor
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
        secret: 'sesion secreta',
        resave: false,
        saveUninitialized: false,
        cookie:{maxAge:60000}
}
))

// Funciones Middleware

// Atenticacion del usuario
function isLoggedMiddleware(req, res, next) {
        if (!req.session.logged) {
                res.redirect('/index');   
        }
        else {
                next();
        }
}
app.use('/consultaProductos', isLoggedMiddleware);
app.use('/historialMovimientos', isLoggedMiddleware);
app.use('/menu', isLoggedMiddleware);
app.use('/venta', isLoggedMiddleware);



// Routing de la pagina
app.get('', function (req, res) {
        res.redirect('/index');

});

app.get('/index', function (req, res) {
        res.render('index')     
});

app.post('/index', function (req, res) {
        console.log(req.body)
        req.session.logged = true; //Solo cuando el usuario existe.
        req.session.userId = req.body.email;
        req.session.password = req.body.password;
        console.log(req.session);
        res.redirect('/menu')     
});

app.get('/consultaProductos', function (req, res) {
        pros = [{ producto: "shampo", disponibilidad: 5, vendidos: 23, sucursal: "Walmart" },{ producto: "cafe", disponibilidad: 1, vendidos: 3, sucursal: "Walmarttt" }];
        console.log(pros["sucursal"]);
        console.log(req)
        res.render('consultaProductos', { productos: pros});
        // console.log(req);
        // console.log(res);
        
});

app.get('/historialMovimientos', function (req, res) {
        res.render('historialMovimientos');
        // console.log(req);
        // console.log(res);

});

app.get('/menu', function (req, res) {
        res.render('menu');
        // console.log(req);
        // console.log(res);

});

app.get('/venta', function (req, res) {
        res.render('venta');
        // console.log(req);
        // console.log(res);

});
app.post('/ventaPOST', function (req, res) {
        // res.render('form_test');
        res.send(req.body)
        console.log(req.body)
        // console.log(req);
        // console.log(res);

});
// Servidor en puerto 8080
app.listen(8080);
