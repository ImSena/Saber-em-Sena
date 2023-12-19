const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const upload = require('../config/multer');
const adminController = require('../controller/adminController');

router.get('/', (req, res)=>{
    res.render('admin/adminCadastro')
});

router.get('/principal', (req, res)=>{
    if(req.session.login){
        res.render('admin/principal');
    }else{
        res.send('Cannot GET /SecretPages/principal')
    }
})

router.post('/acessarPainel', adminController.login);

router.get('/addPost',  (req, res)=>{
    if(req.session.login){
        res.render('admin/addPost');
    }else{
        res.send('Cannot GET /SecretPages/addPost')
    }
})

router.post('/add',upload.array('image'), postController.create)

module.exports = router;