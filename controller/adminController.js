const User = require('../modules/User');
const Post = require('../modules/Post');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const username = req.body.user;
        const password = req.body.password;

        const admin = await User.findOne({
            user: username
        }).lean()

        if (admin) {
            const correctPassword = await bcrypt.compare(password, admin.password);

            if (correctPassword) {
                req.session.login = true;
                res.redirect('principal')
            } else {
                res.send('usuario ou senha incorretos')
            }
        } else {
            res.send('usuario ou senha incorretos')
        }
    } catch (e) {

    }
}

exports.findPost = async (req, res) => {
    if (req.session.login) {
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

            res.render('admin/principal', {
                postsRecentes: filteredPostsRecentes,
                postsAntigos: filteredPostsSeguintesAteNove
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Erro ao buscar posts');
        }
    } else {
        res.send('Cannot GET /SecretPages/')
    }
}

exports.config = async (req, res) => {
    if (req.session.login) {
        try {
            const allPosts = await Post.find().lean();
            let filteredPosts = null;

            if (req.query.q) {
                const term = req.query.q;
                const searchPost = allPosts.filter(post => post.title.toLowerCase().includes(term.toLowerCase()));

                if (searchPost.length > 0) {
                    filteredPosts = searchPost.map(p => {
                        const firstImage = p.content.find(item => item.type === 'i');
                        return { title: p.title, content: firstImage ? firstImage.content : null, id: p._id };
                    })
                } else {
                    filteredPosts = '';
                }
            } else {
                filteredPosts = allPosts.map(p => {
                    const firstImage = p.content.find(item => item.type === 'i');
                    return { title: p.title, content: firstImage ? firstImage.content : null, id: p._id };
                });
            }

            res.render('admin/configPost', { posts: filteredPosts });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao buscar posts.');
        }
    } else {
        res.send('Cannot GET /SecretPages/')
    }
};

exports.showFormEdit = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findById(id);
        const ordered = [];

        const searchIndex = (array, type) => {
            const index = array.findIndex(item => item.type == type)

            if (index !== -1) {
                return array.splice(index, 1)[0]
            }
        }

        post.order.forEach(type => {
            const matchIndex = searchIndex(post.content, type);
            if (matchIndex) {
                ordered.push(matchIndex);
            }
        });

        res.render('admin/editPost', { id: post._id, title: post.title, subtitle: post.subtitle, content: ordered, order: post.order });
    } catch (error) {

    }

}