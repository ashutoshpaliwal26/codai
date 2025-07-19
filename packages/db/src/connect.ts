import mongoose from "mongoose";

export const connectToDb = async (connectionString : string) => {
    try{
        const connection = await mongoose.connect(connectionString , {
            dbName : "code_editor"
        })
        console.log(`|---------CONNECTED WITH MONGODB : (${connection.connection.host})------------------|`);
    }
    catch(error){
        console.error((error as Error).message);
    }
}
