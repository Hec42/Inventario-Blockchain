// Modulos y bibliotecas
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var ledgerCommunication = require('./ledgerCommunication');
var app = express();

const path = require('path');
const fs = require('fs');
const { errorMonitor } = require('events');


// Simulacion de una base de datos, en una aplicacion real se implementaria un base de datos relacional
// las contraseñas en la base de datos no se guarda, solo el hash
var DATABASE = {
        "sucursal1@walmart.com":{'usuario':'appUserOrg1', 'organizacion':'Walmart', 'password':'123', 'logo':'images/walmart.png'},
        "sucursal1@samsclub.com":{'usuario':'appUserOrg2', 'organizacion':'SamsClub', 'password':'123','logo':'images/samsclub.png'},
        "sucursal1@superama.com":{'usuario':'appUserOrg3', 'organizacion':'Superama', 'password':'123','logo':'images/superama.png'},
        "sucursal1@aurrera.com":{'usuario':'appUserOrg4', 'organizacion':'Aurrera', 'password':'123','logo':'images/aurrera.png'},
        "sucursal1@bodega.com":{'usuario':'appUserOrg5', 'organizacion':'Bodega', 'password':'123','logo':'images/bodega.png'}
}

// Catalogo de organizaciones
var ORGANIZACIONES = [
        {tienda:'Walmart'},
        {tienda:'SamsClub'},
        {tienda:'Superama'},
        {tienda:'Aurrera'},
        {tienda:'Bodega'}       
]
// Configuracion del servidor
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); //vistas
app.use(session({
        secret: 'sesion secreta',
        resave: false,
        saveUninitialized: false,
        cookie:{maxAge:600000}
}
))

// Funciones Middleware
// Protege el acceso sin autenticacion de usuario
function isLoggedMiddleware(req, res, next) {
        if (!req.session.logged) {
                res.redirect('/index');   
        }
        else {
                next();
        }
}

// Protege el acceso de las tiendas a las funcionalidades de la bodega
function protectBodegaMiddleware(req, res, next){
        if (req.session.organizacion === "Bodega"){
                next();
        }
        else{
                res.redirect('/menu');
        }
}

// Protege el acceso de la bodega a las funcionalidades de las tiendas
function protectTiendaMiddleware(req, res, next){
        if (req.session.organizacion === "Bodega"){
                res.redirect('/menuBodega');
        }
        else{
                next();
        }
}

app.use('/consultaProductos', isLoggedMiddleware);
app.use('/historialMovimientos', isLoggedMiddleware);
app.use('/menu', isLoggedMiddleware);
app.use('/venta', isLoggedMiddleware);
app.use('/menuBodega', isLoggedMiddleware)
app.use('/suministroProductos', isLoggedMiddleware);

app.use('/menuBodega', protectBodegaMiddleware);
app.use('/suministroProductos', protectBodegaMiddleware);
app.use('/menu', protectTiendaMiddleware);
app.use('/venta', protectTiendaMiddleware);

// Routing de la pagina
app.get('', function (req, res) {
        res.redirect('/index');

});

app.get('/index', function (req, res) {
        res.render('index')     
});

app.post('/index', function (req, res) {
        if (DATABASE[req.body.email]){
                if(DATABASE[req.body.email]['password']===req.body.password){
                        req.session.logged = true;
                        req.session.userId = DATABASE[req.body.email]['usuario']; 
                        req.session.organizacion = DATABASE[req.body.email]['organizacion']; 
                        req.session.logo = DATABASE[req.body.email]['logo']; 
                        // Inicia un objeto para la interaccion con el ledger
                        LedgerInteraction = new ledgerCommunication.LedgerInteraction(req.session.userId);
                        res.redirect('/menu');
                }
        }
        else{
                res.redirect('/index');
        }  
});

app.get('/cerrarSesion', function (req, res){
        req.session.logged = false;
        console.log("Sesion cerrada");
        res.redirect('/index');
});

app.get('/consultaProductos', function (req, res) {
        productosInLedger = LedgerInteraction.queryProductos(req.session.organizacion);
        productosInLedger.then((data)=>{
                data=JSON.parse(data);
                res.render('consultaProductos', { productos: data});
        },(error)=>{
            console.log("Hubo un error al solicitar los productos");
        });
});

app.get('/historialMovimientos', function (req, res) {
        transactionsInLedger = LedgerInteraction.queryAllTxn();
        transactionsInLedger.then((data)=>{
                data=JSON.parse(data);
                res.render('historialMovimientos', { movimientos: data});
        },(error)=>{
                
            console.log("Hubo un error al solicitar los productos");
        });
});

app.get('/menu', function (req, res) {
        res.render('menuTienda', {logo:req.session.logo});
});

app.get('/venta', function (req, res) {
        transactionsInLedger = LedgerInteraction.queryProductos(req.session.organizacion);
        transactionsInLedger.then((data)=>{
                data=JSON.parse(data);
                res.render('venta', { productos: data});
        },(error)=>{
            console.log("Hubo un error al solicitar los productos");
        });
});

app.post('/venta', function (req, res) {
        transactionsInLedger = LedgerInteraction.sellProducto(req.body.producto, req.body.cantidad);
        transactionsInLedger.then((data)=>{
                if(data===true){
                        res.render('ventaConcluida',{exito:true});
                }
                else{
                        res.render('ventaConcluida',{exito:false, error:data});
                }
        },(error)=>{
                console.log(error);
                res.render('ventaConcluida',{exito:false, error:data});
        });
});

app.get('/menuBodega', function (req, res) {
        res.render('menuBodega');
});

app.get('/suministroProductos', function (req, res) {
        transactionsInLedger = LedgerInteraction.queryProductos(req.session.organizacion);
        transactionsInLedger.then((data)=>{
                data=JSON.parse(data);
                res.render('suministro', { productos: data, organizaciones:ORGANIZACIONES});
        },(error)=>{
                console.log("Hubo un error al solicitar los productos");
                return error;
        });   
});

app.post('/suministroProductos', function (req, res) {
        var producto = req.body.producto.split(':');
        transactionsInLedger = LedgerInteraction.supplyTienda(producto[0], producto[1], req.body.tienda, req.body.cantidad);
        transactionsInLedger.then((data)=>{
                if(data === true){
                        res.render('suministroConcluido',{exito:true});
                }
                else{
                        res.render('suministroConcluido', {exito:false, error:data});
                }
        },(error)=>{
                console.log(error);
                res.render('suministroConcluido',{exito:false, error:data});
        });

});

// Servidor en puerto 8080
app.listen(8080);
