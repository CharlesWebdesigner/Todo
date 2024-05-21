const express=require("express");
const bodyParser=require("body-parser")
const app=express();
const mongodb =require("./factor/mongodb")
const Todo =require('./factor/model')
const path=require("path");
const dotenv=require("dotenv")
dotenv.config()
const port=process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"./Public/css")))

app.get("/",async(req,res)=>{
    try{
               const todo= await Todo.find({}).sort({createdAt:-1})
        res.render("index",{title:"List todo", todo})
        // res.locals.moment=moment;
    }catch(e){
        res.status(500).json({message:e.message})
    }
})
app.get("/add-todo",(req,res,next)=>{
    try{
        res.render("newTodo",{title:"New todo"})
    }catch(e){
        res.status(500).json({message:e.message})
    }
})
app.get("/update-todo",async(req,res,next)=>{
    const {id} =req.query;
    try{
        const todo = await Todo.findById(id)
        res.render("update",{title:"update todo", todo})
    }catch(e){
        res.status(500).json({message:e.message})
    }
})
app.get("/delete-todo",(req,res,next)=>{
    const {id} =req.query;
    try{
        res.render("delete",{title:"delete todo", id})
    }catch(e){
        res.status(500).json({message:e.message})
    }
})
app.post("/add-todo",async(req,res)=>{
    const {title,desc}=req.body;
    try{
        if(!title){
            return res.status(400).json({message:"Title is required"});
        }
        const todo=new Todo({title,desc})
        await todo.save()
        res.redirect("/")
    }catch(e){
res.status(500).json({message:e.message})
    }
})
app.post("/update-todo/:id",async(req,res)=>{
try{
    const {id}=req.params;
    const {title,desc}=req.body;
    const todo = await Todo.findById(id)
    console.log(todo)
    if(!todo){
        return res.send(404).json({message:"Todo not found"})
    }
    todo.title=title;
    todo.desc=desc;
    await todo.save()
    res.redirect("/")
}catch(e){
res.status(500).json({message:e.message})
}
})
app.get("/confirm-delete",async(req,res)=>{
    try{
        const {id, confirm}=req.query;
        if(confirm == "yes"){
            await Todo.findByIdAndDelete(id)
            res.redirect("/")
        }else{
            res.redirect("/")
        }
    }catch(e){
        res.status(500).json({message:e.message})
    }
})
app.listen(port,()=>{
    mongodb();
    console.log(`server running in port ${port}`)
})