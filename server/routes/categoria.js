
const express = require('express');

let { verificaToken , verificaAdmin_Role} = require ('../middlewares/autenticacion.js');

const _= require('underscore');

let app = express();

let Categoria = require('../models/categoria');


// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', (req,res) => {

    let body = req.body;

    Categoria.find({}, 'descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err,categorias) => {
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            };

            Categoria.count({}, (err, conteo) => {

                res.json({
                       ok:true,
                       categorias,
                       cuantos:conteo
                   });
           })

        })

});


// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', (req,res) => {

    let id = req.params.id;
    
    Categoria.findById(id , (err,categoria) => {

        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if (!categoria) {
            return res.json({
                ok:true,
                err: {
                    message: 'No existen una categoria con ese id'
                }
            })
        } 
        
        res.json({
                ok:true,
                categoria
            });
        

    })

});

// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken ,  (req,res) => {
    // regresar la nueva categoria
    // req.usuario_id

    let body = req.body;
    let usuario = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario
    });

    categoria.save( (err,categoriaDB) => {
        
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if (!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        res.json({
            ok:true,
            categoria:categoriaDB
        });

    })



});

// ============================
// Actualizar una categoria 
// ============================
app.put('/categoria/:id', verificaToken , (req,res) => {

    let id = req.params.id;
    let body = req.body;

    let categoriaDesc = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate( id, categoriaDesc, {new:true, runValidators: true, context:"query"}, (err,categoriaDB) => {

        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if (!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        };


        res.json({
          ok: true,
          categoria: categoriaDB
        })

      })

});

// ============================
// Eliminar una categoria 
// ============================
app.delete('/categoria/:id', [verificaToken , verificaAdmin_Role ], (req,res) => {
    // solo elimina el administrador
    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if (!categoriaDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El id no existe'
                }
            });
        };
        res.json({
            ok: true,
            message: 'Categoria borrada'
          })

      });


});

module.exports = app;