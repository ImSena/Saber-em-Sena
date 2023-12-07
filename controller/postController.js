const Post = require('../modules/Post');
const fs = require('fs').promises;


let errors = {};

const verify = (title, subtitle, textContent, files) => {
errors={}

    if (!title) {
        errors.title = 'O título é obrigatório.';
    } else if (title.length > 51) {
        errors.title = 'O título deve ter no máximo 50 caracteres.';
    }

    if (!subtitle) {
        errors.subtitle = 'O subtítulo é obrigatório.';
    } else if (subtitle.length > 61) {
        errors.subtitle = 'O subtítulo deve ter no máximo 61 caracteres.';
    }

    if (!Array.isArray(textContent) || textContent.length < 2) {
        errors.textContent = 'Deve haver pelo menos 2 parágrafos de texto.';
    } else {
        textContent.forEach((el, i) => {
            if (typeof el !== 'string' || el.length >= 200 || !el) {
                errors.textContent = 'Cada parágrafo de texto deve ter no máximo 200 caracteres.';
            }
        });
    }

    if(files.length > 0){
        const allowedSize = 90 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        files.forEach(file =>{
            if(file.size > allowedSize){
                errors.files = 'Cada arquivo deve ter 90mb';
            }else if(!allowedTypes.includes(file.mimetype)){
                errors.files = 'Arquivo não suportado';
            }
        })
    }else{
        errors.files = 'Você deve ao menos ter uma imagem';
    }

    return errors;
}

exports.create = async (req, res) => {
    //body
    const { title, subtitle, textContent } = req.body;
    const files = req.files;

    //model
    const newPost = new Post({
        title: title,
        subtitle: subtitle,
        content: []
    });

    //verify
    const validationErrors = verify(title, subtitle, textContent, files);

    if (Object.keys(validationErrors).length === 0) {
        textContent.forEach((el, i) => {
            newPost.content.push({
                type: 'text',
                content: el
            });
        });


        files.forEach(file => {
            const filePath = `uploads/${file.filename}`;
            newPost.content.push({
                type: 'image',
                content: filePath
            });
        });


            //await newPost.save().then(() => res.send('foi')).catch((err) => res.send('erro')); 
            res.status(200).render('admin/addPost', { sucessMessage: "Post salvo com sucesso" });
    } else {
        files.forEach(file => {
            const filePath = `uploads/${file.filename}`;
            fs.unlink(filePath).catch(err => console.log('error' + err));
        });

        res.status(400).render('admin/addPost', {
            error: 'ATENÇÃO!',
            validationErrors: validationErrors,
            title: title,
            subtitle: subtitle,
            textContent: textContent,
            files: files
        });
    }
}
