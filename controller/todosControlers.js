import asyncHandler from 'express-async-handler'
import todos from '../schema/TodoSchema.js'


    const getTodo = asyncHandler(async (req, res)=>{

        const {dayofweek} = req.query
      const userId = req.user._id
     
      const Todos = await todos.find({dayOfWeek: dayofweek, user: userId})

        res.status(200).json(Todos)
        
    })
    

    const addTodo = asyncHandler(async(req, res) =>{
        const {todo, dayOfWeek} = req.body
       const userId = req.user._id
       
        const Todo = await todos.create({
            todo:  todo,
            dayOfWeek: dayOfWeek,
            user: userId
        })

        if(Todo){
            res.status(201).json('successfully added to do list')
        }else{
            res.status(401).json("feild to add todo")
        }
        
    })


    const deleteTodo = asyncHandler(async (req, res)=>{
        const id= req.params.itemId;
    
    const deleted = await todos.deleteOne({ _id: id })

    if(deleted){
        res.status(201).json('item delected')
    }else{
        res.status(401).json('unable to delete item')
    }
        
    })


    const clearTodo = asyncHandler( async (req, res) =>{
        const {dayOfWeek} = req.params

        const clear = await todos.deleteMany({ dayOfWeek: dayOfWeek});

        if(clear){
            res.status(201).json({
                message:'all items for the selected date have been cleared'
            })
        }else{
            res.status(401).json({'message': 'couldnt complete '})
        }
    })


    const searchTodo = asyncHandler( async(req, res)=>{
        const {query} = req.query

        const search = await todos.find({todo: {
            $regex: query,
            $options:"i"
        }})
        
        if(search){
            res.status(201).json(search)
        }else{
            res.status(401).json({'message': 'couldnt complete '})
        }
    })


    const searchTodoInDay = asyncHandler(async (req, res) => {
        const { dayofweek, query } = req.query;
        const search = await todos.find({
          dayOfWeek: dayofweek,
          todo: { $regex: query, $options: "i" },
        });
        
        if (search.length > 0) {
          res.status(200).json(search);
        } else {
          res.status(404).json({ message: "No results found." });
        }
        
      });
   


export {addTodo, getTodo, deleteTodo,
     clearTodo, searchTodo, searchTodoInDay}
