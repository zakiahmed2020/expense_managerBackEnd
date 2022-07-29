import jwt from "jsonwebtoken";

function Auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token)
    return res
      .status(401)
      .send({ message: "Access Denied. No token Provided." });
  try {
    const tokn = token.slice(7);
    jwt.verify(tokn, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).send({
          message: "InvalidToken",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    res.status(401).send({ message: `Error: ${error}` });
  }
}

export default Auth;
