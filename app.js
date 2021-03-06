const express= require("express")
const bodyParser= require("body-parser");


const app=express();
app.set('view engine','ejs')


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));




app.get("/",function(req,res){
    res.render("login")
})
app.post("/",function(req,res){

    res.redirect("/dashboard");
    
})


app.get("/dashboard",function(req,res){
    res.render("dashboard");
})


app.get("/resource",function(req,res){
    res.render("resource");
})


app.get("/timetable",function(req,res){
    res.render("timetable");
})


app.get("/acedmics",function(req,res){
    res.render("academics");
})


app.get("/announcement",function(req,res){
    res.render("announcement");
})

app.listen(3000,function(){
    console.log("sever started att port 3000")
});