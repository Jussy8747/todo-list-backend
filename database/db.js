import mongoose from 'mongoose'
import env from 'dotenv'
env.config()

const dbUrl = process.env.DATABASEURL


const connectDb = async()=>{
    
    try {
        const con = await mongoose.connect(dbUrl)
         (`MongoDb conneted: ${con.connection.host}`);
    } catch (error) {
         (`Error : ${error.message}`);
    }
}

export default connectDb