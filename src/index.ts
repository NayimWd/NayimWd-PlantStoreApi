import express from 'express';


const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());


app.get("/", (req, res)=>{
res.send("ok")
})

app.listen(PORT, ()=>{
    console.log("running port:", PORT)
})