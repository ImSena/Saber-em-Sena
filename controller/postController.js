const Post = require('../modules/Post');
const fs = require('fs').promises;


let errors = {};

const verify = (title, subtitle, textContent, files) => {
    errors = {}

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
            if (typeof el !== 'string' || el.length >= 250 || !el) {
                errors.textContent = 'Cada parágrafo de texto deve ter no máximo 200 caracteres.';
            }
        });
    }

    if (files.length > 0) {
        const allowedSize = 90 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        files.forEach(file => {
            if (file.size > allowedSize) {
                errors.files = 'Cada arquivo deve ter 90mb';
            } else if (!allowedTypes.includes(file.mimetype)) {
                errors.files = 'Arquivo não suportado';
            }
        })
    } else {
        errors.files = 'Você deve ao menos ter uma imagem';
    }

    return errors;
}

exports.create = async (req, res) => {
    //body
    const { title, subtitle, content, order } = req.body;
    const files = req.files;
    const orderArray = order.split(',').filter(Boolean).map(item => item.charAt(0));

    //model
    const newPost = new Post({
        title: title,
        subtitle: subtitle,
        content: [],
        order: orderArray,
    });

    //verify
    const validationErrors = verify(title, subtitle, content, files);

    if (Object.keys(validationErrors).length === 0) {


        content.forEach((el, i) => {
            newPost.content.push({
                type: 't',
                content: el
            })
        });

        files.forEach(file => {
            const filePath = `uploads/${file.filename}`
            newPost.content.push({
                type: 'i',
                content: filePath
            })
        })

        await newPost.save().then(() => res.status(200).render('admin/addPost', { sucessMessage: "Post salvo com sucesso" })).catch((err) => res.status(400).render('admin/addPost', {
            error: 'ATENÇÃO! HOUVE ALGUM ERRO'
        }))

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
            textContent: content,
            files: files
        });
    }
}

exports.find = async (req, res) => {
    try {
        const posts = await Post.find().lean();

        // Pegando os 3 posts mais recentes
        const postsRecentes = posts.slice(0, 3);

        // Pegando os posts de 4 a 9 (os próximos 6 posts)
        const postsSeguintesAteNove = posts.slice(3, 9);

        // Mapeando os posts para o formato desejado
        const filteredPostsRecentes = postsRecentes.map(post => {
            const firstImage = post.content.find(item => item.type === 'i');
            return { title: post.title, content: firstImage ? firstImage.content : null, id: post._id };
        });

        const filteredPostsSeguintesAteNove = postsSeguintesAteNove.map(post => {
            const firstImage = post.content.find(item => item.type === 'i');
            return { title: post.title, content: firstImage ? firstImage.content : null, id: post._id };
        });

        res.render('client/principal', {
            postsRecentes: filteredPostsRecentes,
            postsAntigos: filteredPostsSeguintesAteNove
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar posts');
    }
};

exports.findAPost = async (req, res) => {
    try {
        const id = req.params.id;

        const post = await Post.findById(id).lean();

        const orderedContent = [];

        // Função para encontrar e remover um item do array original
        const findAndRemove = (array, type) => {
            const index = array.findIndex(item => item.type === type);
            if (index !== -1) {
                return array.splice(index, 1)[0];
            }
        };

        post.order.forEach((type) => {
            const matchingContent = findAndRemove(post.content, type);
            if (matchingContent) {
                orderedContent.push(matchingContent);
            }
        });

        res.render('client/post', { post: { ...post, content: orderedContent } });
    } catch (error) {

    }
}

exports.update = async (req, res) => {
    const id = req.params.id;

}

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findById({ _id: id }).lean();

        await Post.deleteOne({ _id: id }).then(() => {
            post.content.map(content => {
                if (content.type == 'i') {
                    const filePath = 'public/'+content.content;
                    fs.unlink(filePath).catch((error)=> console.log('houve um erro para excluir imagem', error, content.content));
                }
            })
        }).catch((error)=>{
            console.log('Erro ou deletar no banco');
        })
    } catch (error) {
        console.log('Ocorreu algum erro', error);
    }finally{
        res.redirect('/SecretPages/configuracao');
    }
}
