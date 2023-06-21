var jwt = require('jsonwebtoken')
const JWT_SECRET="luffypirate$king"

const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
try{
    const data=jwt.verify(token,JWT_SECRET);
    console.log(data,"data wala")
    req.user=data.user;
    console.log(req.user)
    next();
} catch(error){
    res.status(401).send({error:"please authenticate using a valid token"})
}
}

module.exports=fetchuser;