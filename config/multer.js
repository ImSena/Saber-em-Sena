const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, res, cb)=>{
        cb(null, 'uploads/');
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb)=>{
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        console.log(allowedTypes.includes(file.mimetype))
        cb(new Error ('Tipo de arquivo não suportado'), false);
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter});
module.exports = upload;