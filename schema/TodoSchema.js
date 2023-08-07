import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    

    todo: {
        type: String,
        required: true
    },

    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 'User' should match the model name of your User schema
        required: true
    },
},{
    timestamps: true
})

const todos = mongoose.model('TodoList', todoSchema)

export default todos


