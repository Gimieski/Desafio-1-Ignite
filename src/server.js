const express=require('express')
const app=express()
const {uuid,isUuid}=require("uuidv4");

app.use(express.json())

const Users=[]

function checkExistsUserAccount(request,response,next){
    const {username}=request.headers

    const user=Users.find((user)=>user.username===username)

    if(!user){
        return response.status(404).json({erro:"User not Found"})
    }

    request.user=user

    return next()
}

app.post("/users",(request,response)=>{
    const {name,username}=request.body;
    const user={
        id:uuid(),
        name,
        username,
        todos:[]
    }

    Users.push(user)

    return response.status(200).json()
    
})

app.get("/users",(request,response)=>{
    return response.send(Users)
})

app.post("/todos",checkExistsUserAccount,(request,response)=>{
    const {user}=request
    const {title,deadline}=request.body

    user.todos.push({
        id:uuid(),
        title,
        done: false,
        deadline:new Date(deadline),
        created_at:new Date(),
    })
    // vou receber o deadline no body, que vai ser a data definida e definimos com isso, no obj date

    return response.status(200).json(user.todos)
})

app.get("/todos",checkExistsUserAccount,(request,response)=>{
    const {user}=request

    return response.status(200).json(user.todos)
})

app.put("/todos/:id",checkExistsUserAccount,(request,response)=>{
    const {user}=request
    const {id}=request.params
    const todoIndex = user.todos.findIndex((id)=>id === id)
    console.log(user)

    
    const {title,deadline}=request.body

    let All=user.todos[todoIndex]

    All={
        ...All,
        title:title,
        deadline:deadline
    }
    user.todos[todoIndex]=All

    return response.json(All)
})

app.patch("/todos/:id/done",checkExistsUserAccount,(request,response)=>{
    const {user}=request
    const {id}=request.params
    const todoIndex = user.todos.findIndex((id)=>id === id)

    const {done}=request.body

    let All=user.todos[todoIndex]

    All={
        ...All,
        done:done
    }

    user.todos[todoIndex]=All

    return response.json(All)

})

app.delete("/todos/:id",checkExistsUserAccount,(request,response)=>{
    const {user}=request
    const {id}=request.params
    console.log(user)
    const todoIndex=user.todos.findIndex((id)=>id===id)
    
    user.todos.splice(todoIndex,1)

    return response.status(204).send()
})

app.listen(3000,()=>console.log("iniciou"))

