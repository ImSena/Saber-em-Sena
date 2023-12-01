const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const upload = require('../config/multer');

router.get('/', (req, res)=>{
    res.render('admin/adminCadastro')
});

router.get('/principal', (req, res)=>{
    res.send('foi');
})

router.post('/acessarPainel', (req, res, next)=>{
    if(req.body.user == 'bruno' && req.body.password == '123'){
        res.redirect('principal');
        next();
    }else{
        res.send('erro');
    }
});

router.get('/addPost',  (req, res)=>{
    res.render('admin/addPost');
})

router.post('/add',upload.array('image', 5), postController.create)

module.exports = router;