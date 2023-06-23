import jwt from "jsonwebtoken";
export const verify = (request,response,next)=>{
  let token = request.headers.authorization;
  try{
    if(jwt.verify(token,"fdfxvcvnreorevvvcrerer"))
     throw new Error();
    next();
  }
  catch(err){
    return response.status(401).json({error: "Unauthorized request", status: false});
  }
}