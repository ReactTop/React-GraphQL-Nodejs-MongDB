const express = require('express');
const bodyParser= require('body-parser');
const cors = require('cors')
const graphqlHttp = require('express-graphql'); //graphql middleware function
const {buildSchema} =require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event.js');
const User = require('./models/user.js')
const {CLIENT_ORIGIN } = require('./config')
const app=express();

// const events =[]; //global variable

app.use(bodyParser.json());

//cors error fix
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
//     if(req.method === 'OPTIONS'){
//         return res.sendDate(200);
//     }
// });

// Accept requests from the client
app.use(cors({
    origin: CLIENT_ORIGIN
}));

app.use('/graphql',graphqlHttp({
      

     schema:buildSchema(`
         
           type Event {
               _id:ID!
               title:String!
               description:String!
               price:Float!
               date:String!
           }

           type User{
               _id:ID!
               email:String!
               password:String!

           }

           input EventInput{
               title:String!
               description:String!
               price:Float!
               date:String!
           }

           input UserInput{
               email:String!
               password:String!
           }
         
            type RootQuery{

                events:[Event!]!

            }

            type RootMutation {
                  createEvent(eventInput:EventInput) : Event
                  createUser(userInput:UserInput):User
            }

            schema {
                 query:RootQuery
                 mutation:RootMutation
            }
           
     `),
     rootValue:{

        events:() =>{

            return Event.find().then(events =>{
                 
                return events.map(event =>{
                      
                    return {...event._doc,_id:event._doc._id.toString()};
                });
            })
            .catch(err =>{
                throw err;
            });
        },
        createEvent:(args) =>{
            const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date:args.eventInput.date
            });
           return event.save().then(result=>{
                console.log(result);
                return {...result._doc};
            }).catch(err=>{
                console.log(err);
                throw err;
                
            });    

        },
        createUser:(args)=>{

            const user = new User({
                email:args.userInput.email,
                password:args.userInput.password
            });

            return user.save().then(result=>{
                console.log(result)
                return {...result._doc};
            }).catch(err=>{
                console.log(err)
                throw err;
            });
     },
     },
     graphiql:true

}));

mongoose.connect(`mongodb+srv://Admin:Qd0FfcJo3Au0lS1X@cluster0-mo4rx.mongodb.net/events_react_dev?retryWrites=true&w=majority`
).then(()=>{
    app.listen(8000);
})
.catch(error=>{
    console.log(error)
});

