
const express = require('express');

let { verificaToken } = require ('../middlewares/autenticacion.js');

//const _= require('underscore');

let app = express();

let Producto = require('../models/producto');

// ===================================
// Obtener todos los productos
// ===================================

app.get('/productos', verificaToken ,  (req,res) => {
    // traer todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible:true})
        .skip(desde)
        .limit(limite)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec( (err,productosDB) => {

            if (err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            };

            res.json({
                ok:true,
                productos:productosDB
            });
        });

});

// ===================================
// Obtener un producto por ID
// ===================================

app.get('/producto/:id', verificaToken,  (req,res) => {
    // populate: usuario categoria

    let id = req.params.id;
    
    Producto.findById(id)
        .populate('usuario')
        .exec((err,productoDB) => {

        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if (!productoDB) {
            return res.json({
                ok:true,
                err: {
                    message: 'No existen un producto con ese id'
                }
            })
        } 
        
        res.json({
                ok:true,
                producto: productoDB
            });
        
    
    })

});


// ===================================
// Buscar productos
// ===================================

app.get('/productos/buscar/:termino' , verificaToken , (req,res) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({nombre : regexp})
        .populate('categoria','nombre')
        .exec((err,productos) => {
            if (err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            };

            res.json({
                ok:true,
                productos
            });
        })

})

// ===================================
// Crear un producto
// ===================================

app.post('/producto', verificaToken ,  (req,res) => {

    let body = req.body;
    let usuario = req.usuario._id;
    
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: usuario,
        categoria: body.categoria
    });

    producto.save( (err,productoDB) => {
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if (!productoDB){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        res.json({
            ok:true,
            producto: productoDB
        });

    });

    // grabar un usuario
    // grabar una categoria del listado
    
});


// ===================================
// Actualizar un producto
// ===================================

app.put('/producto/:id', verificaToken , (req,res) => {
    // grabar un usuario
    // grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;
    let usuario = req.usuario._id;
    

    Producto.findById( id , (err,productoDB) => {

        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if (!productoDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El ID no existe'
                }
            });
        };


        productoDB.nombre =  body.nombre,
        productoDB.precioUni = body.precioUni,
        productoDB.descripcion = body.descripcion,
        productoDB.categoria = body.categoria
        productoDB.disponible = body.disponible;

        productoDB.save( (err, productoGuardado) => {

            if (err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            };

            res.json({
                ok:true,
                producto: productoGuardado
            });

        });
    
});

});

// ===================================
// Borrar un producto
// ===================================

app.delete('/producto/:id', (req,res) => {
    // actualizar el estado del campo disponible

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible:false}, {new:true},(err,productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok:false,
                err:err
            });
        };

        if (!productoBorrado){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Producto no encontradp'
                }
            });
        }
        

       res.json({
            ok:true,
            producto:productoBorrado
        });



    })
    
});

module.exports = app;