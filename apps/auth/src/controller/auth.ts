import { NextFunction, Request, Response } from "express";
import { createNewUser, getUserByEmail, isUser } from "../service/UserService";
import bcrypt from 'bcrypt'
import { getToken, setToken } from "../service/jwtService";
import { User } from "@repo/db/user";
import { UserPayload } from "../type";
import { JwtPayload } from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
    const {name, email , password} = req.body;

    if(!name || !email || !password ) {
        return res.status(400).json({
            success : false,
            message : "Input is Missing"
        })
    }

    try {
        if(await isUser(email)){
            return res.status(400).json({
                success : false,
                message : "User Already Exist"
            })
        }  

        const hashPass = await bcrypt.hash(password, 10);
        const user = await createNewUser(name, email, hashPass);
        const token = setToken(user.email)
        res.status(200).json({
            success : true,
            message : "User Created Successfully",
            user : {
                _id : user._id,
                name : user.name,
                email : user.email
            },
            token : token
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : (error as Error).message
        })
    }
}

export const loginUser = async (req: Request, res : Response) => {
    console.log("login hit");
    
    const { email , password } = req.body;

    if(!email || !password ) {
        return res.status(400).json({
            success : false,
            message : "Input is Missing"
        })
    }
    try{
        if(await isUser(email)){
            const user = await getUserByEmail(email);
            const pass = await bcrypt.compare(password, user.password);
            if(!pass){
                return res.status(400).json({
                    success : false,
                    message : "Invalid Password"
                })
            }
            const token = setToken(user.email)
            return res.status(200).json({
                success : true,
                message : "Login Successfull",
                user :{
                    _id : user._id,
                    name : user.name,
                    email : user.email
                },
                token : token
            })
        }
        return res.status(404).json({
            success : false,
            message : "User Not found"
        })
    }catch(error) {
        return res.status(500).json({
            success : false,
            message : (error as Error).message
        })
    }
}

export const protectRoute = async (req : Request, res: Response, next: NextFunction) => {
    try{
        
        const headers = req.headers;
        if(!headers.authorization?.startsWith('Bearer ')){
            return next("Not Autorized");
        }
        const token = headers.authorization?.split(" ")[1];
        
        const data = getToken(token as string);
        
        if(await isUser(data)){
            console.log({success : true})
            return next();
        }
        return next("Unautorized");
    }catch(err){
        return res.status(500).json({
            success : false,
            message : (err as Error).message
        })
    }
}

export const protect = async (req:Request, res: Response) => {
    return res.status(200).json({
        success : true
    })
}