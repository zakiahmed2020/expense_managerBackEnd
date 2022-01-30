const jwt=require("jsonwebtoken");
const config=require("config");

function Auth(req, res,next) {
    const token=req.headers["x-auth-token"]
    if(!token) return res.status(401).send("access Denied. No Token Provided..");
    try {
        const Decoded=jwt.verify(token,"jwtPriviteKey");
        // const Decoded=jwt.verify(token,config.get("jwtPriviteKey"));
        req.user=Decoded;
        next();
        
    } catch (error) {
        res.status(401).send("Invalid Token");
        
    }
}
module.exports = Auth;