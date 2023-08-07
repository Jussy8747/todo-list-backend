import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },

    email: {
        type:String,
        unique:true,
        lowercase: true, 
       
    },

    password: {
        type:String,
        
    },
    provider: {
        type:String, 
    },
    resetToken: {
        token: String,
        expiresAt: Date,
      },

    
},{
    timestamps: true
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
       next()
    }else{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt);
    }
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema)

export default User