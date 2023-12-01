const Post = require('../modules/Post');
const fs = require('fs').promises;

const verify = (title, subtitle, textContent) => {
    const errors = {};

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
            if (typeof el !== 'string' || el.length >= 150 || !el) {
                errors.textContent = 'Cada parágrafo de texto deve ter no máximo 150 caracteres.';
            }
        });
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
    const validationErrors = verify(title, subtitle, textContent);

    if (Object.keys(validationErrors).length === 0) {
        textContent.forEach((el, i) => {
            newPost.content.push({
                type: 'text',
                content: el
            });
        });

        const filesUpload = []
        const filesDelete = [];

        files.forEach(file => {
            const allowedSize = 90 * 1024;
            const filePath = `uploads/${file.filename}`;
            if (file.size <= allowedSize) {
                newPost.content.push({
                    type: 'image',
                    content: filePath
                });
                filesUpload.push(filePath);
            } else {
                filesDelete.push(filePath);
            }
        });

        if (filesDelete.length > 0) {
            const totalFiles = [...filesUpload, ...filesDelete];
            totalFiles.forEach((el, i) => {
                fs.unlink(el).catch(err => console.log('errão'))
            })

            
        } else {
            //await newPost.save().then(() => res.send('foi')).catch((err) => res.send('erro')); 
            res.render('admin/addPost', {sucessMessage: "Post salvo com sucessso"});
        }
    } else {
        files.forEach(file => {
            const filePath = `uploads/${file.filename}`;
            fs.unlink(filePath).catch(err => console.log('error' + err));
        });



        res.status(400).render('admin/addPost', {
            error: 'Cheio de erros',
            validationErrors: validationErrors,
            title: title,
            subtitle: subtitle,
            textContent: textContent,
            files: files
        });
    }
}
