const JWT = require('jsonwebtoken');

module.exports = async(req,res,next) =>{

    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({
                success: false,
                message: 'Auth Failed: No token provided',
            });
        }




    
        const token = authHeader.split(" ")[1];
        JWT.verify(token, process.env.JWT_SECRET, (err,decode) =>{
            if(err){
                return res.status(401).send({
                    success:false,
                    message:'Auth Failed',
                });
            }else{
                req.body.userId = decode.userId;
                next();
            }
        });
        
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            success:false,
            error,
            message:'Auth Failed',
        });
        
    }
};