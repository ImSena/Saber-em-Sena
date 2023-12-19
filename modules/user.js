const mongoose = require('mongoose');

//conexão deve estar descomentada
/*mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/saberSena').then(() => {
    console.log('Successfully connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB: ' + error);
});*/

//usando hash do bcrypt;
const bcrypt = require('bcrypt');

//criando Schema;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user:{
        type: String,
        require: true,
    },
    password:{
        type:String,
        require: true,
    }
})
const User = mongoose.model('user', UserSchema);

//criando hash
const createHashPassword = async(password)=>{
    try{
        const salt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }catch{
        throw new Error('erro ao gerar');
    }
}

//salvando no banco
const saveBd = async ()=>{
    const password = await createHashPassword(/*senha*/);

    const newUser = new User({
        user: 'sysadmin',
        password: password
    });

    try{
      await newUser.save();  
      console.log('Admin salvo com sucesso')
    }catch(e){
        console.log('não foi Possivel salvar, pois: '+e);
    }
}

module.exports = User;