const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const mongoose = require('mongoose');
const postController = require('./controller/postController');
const Handlebars = require('handlebars');
const crypto = require('crypto');
const session = require('express-session');

// Configurar express-handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: Handlebars, // Passar a instância do Handlebars
    helpers: {
        isEqual: function (a, b, options) {
            return a === b ? options.fn(this) : options.inverse(this);
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware para analisar dados codificados em URL
app.use(express.urlencoded({ extended: false }));

// Configurar diretório estático
app.use(express.static(path.join(__dirname, 'public')));

//configurar sessão
    //criação do segredo;
const secret = crypto.randomBytes(64).toString('hex');
app.use(session({secret: secret, resave: false, saveUninitialized: false}))

// Configurar mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/saberSena').then(() => {
    console.log('Successfully connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB: ' + error);
});

// Rotas
app.get('/', postController.find);
app.get('/post/:id', postController.findAPost);
app.use('/SecretPages', admin);



// Iniciar servidor
const PORT = 8081;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta ' + PORT);
});
