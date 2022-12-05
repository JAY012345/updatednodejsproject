const jwt = require("jsonwebtoken");
const SECRET_KEY = 'JayGajjar'
// var user = require('../models/users');

// const config = 'JayGajjar';

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];


  if (!token) {
    // console.log("Hello::::"+token)
    return res.status(403).send("A token is required for authentication");

  }
  try {

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;


// const auth = (req, res, next) => {
//     try{


//         const token = req.body.token || req.query.token || req.headers["x-access-token"];

//         // let token = req.headers.authorization;
//         if(token){
//             // token = token.split(" ")[1];
//             // let user = jwt.verify(token, SECRET_KEY);
//             // req.userId = user.id;

//             const decoded = jwt.verify(token, SECRET_KEY);
//             req.user = decoded;

//         }
//         else{
//             res.status(401).json({message: "Unautherized User"})
//         }

//     }catch(error){

//     }
// }

// module.exports = auth;