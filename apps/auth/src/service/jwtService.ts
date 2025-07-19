import jwt from 'jsonwebtoken'

export const setToken = ( payload : string) => {
    if(!payload) {
        return null;
    }
    return jwt.sign(payload, process.env.SECRET_JWT_KEY as string);
}

export const getToken = (token : string ) : string => {
    try{
        if(!token) return "";
        return jwt.verify(token, process.env.SECRET_JWT_KEY as string) as string;
    }catch(error){
        throw new Error("Jwt Verify Error");
    }
}
