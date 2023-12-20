const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const upload = require('../config/multer');
const adminController = require('../controller/adminController');

router.get('/', (req, res)=>{
    res.render('admin/adminCadastro')
});

router.get('/principal', adminController.findPost)

router.post('/acessarPainel', adminController.login);

router.get('/addPost',  (req, res)=>{
    res.render('admin/addPost');
    /*if(req.session.login){
        
    }else{
        res.send('Cannot GET /SecretPages/addPost')
    }*/
});

router.get('/configuracao', adminController.config);

router.post('/add',upload.array('image'), postController.create);

router.get('/editPost/:id', adminController.showFormEdit);

router.get('/deletePost/:id', postController.delete);


module.exports = router;