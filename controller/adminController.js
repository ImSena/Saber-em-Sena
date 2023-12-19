const User = require('../modules/User');
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
        }else{
            res.send('usuario ou senha incorretos')
        }
    } catch (e) {

    }
}