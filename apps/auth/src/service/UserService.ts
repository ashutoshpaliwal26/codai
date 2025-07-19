import { User } from '@repo/db/user'

export const createNewUser = async (name: string, email: string, password: string): Promise<any> => {
    try{
        return await User.create({name, email, password});
    }catch(error){
        throw new Error((error as Error).message);
    }
}

export const getUserByEmail = async (email: string): Promise<any> => {
    try{
        return await User.findOne({ email });
    }catch(error){
        throw new Error((error as Error).message)
    }
}

export const isUser = async (email: string): Promise<boolean> => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return false;
        }
        return true;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}
