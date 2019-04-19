

// =========================
//         Puerto
// =========================

process.env.PORT = process.env.PORT || 3000; 

//=================
//  Entorno
//=================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================
//  Vencicimento del token
//=================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=================
//  SEED  de autenticacion
//=================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=================
//  Base de datos
//=================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/Cafe';
} else{
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

//mongodb://localhost:27017/Cafe
//mongodb+srv://pablo:FR5aCcpSMxq8ZdxR@cluster0-nppxe.mongodb.net/cafe

//=================
//  Google Client ID
//=================
process.env.CLIENT_ID = process.env.CLIENT_ID || '444885179355-j38chjk9gk7jfvcaivbt09b1rol480bm.apps.googleusercontent.com';
