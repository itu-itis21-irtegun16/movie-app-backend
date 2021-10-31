const express =  require('express');
const cors =  require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Register = require('./models/register')

const PORT= 3000;
const server = express();

server.use(cors());
server.use(express.json())
server.use(bodyParser.json())

// const dbUrl= "mongodb+srv://Kaan:12300321mk@mongodb.zpfds.mongodb.net/deneme?retryWrites=true&w=majority";
const dbUrl = "mongodb+srv://Kaan:12300321mk@movie-app.ev8ms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then((result) => console.log("bağlantı oky"))
    .catch((err) => console.log("olmadı"))



server.get('/', (req,res) =>{
    res.send('selam')
})


server.post('/register', (req,res,next)=>{
    const newUser = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        birthday: req.body.birthday,
        wight: req.body.weight,
        tall: req.body.tall,
        favoriteList: [],
    });

    newUser.save(err => {
        if(err){
            return res.status(400).json({
                error: 'email in use',
                title: error
            })
        }
        return res.status(200).json({
            title: 'register is successfuly',
        })
    })
})


server.post('/add-like',(req,res,next) =>{
    Register.findOne({_id : req.body.user_id}, (err,user) =>{
        if(err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        if(!user){
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
        var updateValue = user.favoriteList;
        if(!req.body.isLiked){
            updateValue.push(req.body.movie_id);
        }else{
            updateValue.forEach((element,index) => {
                if(element == req.body.movie_id){
                    updateValue.splice(index,1)
                }
            });
        }
        
        Register.findByIdAndUpdate(req.body.user_id, { favoriteList : updateValue}, (err,message) =>{
            if(err){
                return res.status(500).json({
                    title : 'something wrong'
                })
            }else {
                return res.status(200).json({
                    title: 'like has ben sent succesfully'
                })
            }
        })
    })
})

server.post('/sign-in', (req,res,next) => {
    Register.findOne({ email: req.body.email}, (err,user) => {
        if(err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        if(!user){
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
        let token = jwt.sign({ userId: user._id}, 'secretkey');
        return res.status(200).json({
            title: 'login success',
            token: token,
            user: user
        })
    })
})

server.post('/get-favorite-list', (req,res,next) =>{
    Register.findOne({_id : req.body.id}, (err,user) =>{
        if(err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        if(!user){
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
        return res.status(200).json({
            favoriteList: user.favoriteList,
            title : 'successfull'
        })
    })
})


server.listen(3000, ()=>{
    console.log(`server started on port ${PORT}`)
})