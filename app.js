const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const mongoose = require('mongoose');


//config
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//handlebars
app.engine('handlebars',handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//static
app.use(express.static(path.join(__dirname, 'public')));
//mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/saberSena').then((e)=>{
    console.log('Sucessfully connected');
}).catch((error)=>{
    console.error('error! '+error)
})

//rotas


app.get('/', (req, res)=>{
    res.render('client/principal');
})


app.use('/SecretPages', admin);
//servidor
const PORT = 8081;
app.listen(PORT, ()=>{
    console.log('Servidor rodando na porta, '+PORT);
})