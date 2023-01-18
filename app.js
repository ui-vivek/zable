const express=require('express')
const path = require('path')
const cookieParser=require('cookie-parser')
const chalk=require('chalk');
const port=8000;
const app=express();
const expressLayouts=require('express-ejs-layouts')
const db=require('./config/mongoose')

// Used for session cookies
const session=require('express-session')
const passport=require('passport')
const passportLocal=require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware=require('node-sass-middleware')

app.use(sassMiddleware({
    src:'./assets/scss',
    dest: './assets/css',
    debug:true,
    outputStyle:'expanded',
    prefix:'/css'
}))
app.use(express.urlencoded()) // encode the req 
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'assets')));
// app.use(express.static('./assets'));
app.use(expressLayouts)
//extract style and scripts form the sub pages into the layout
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)


// set up view engine
app.set('view engine','ejs')
app.set('views','./views')

//mongo store is used to store the session cookie in db
app.use(session({
    name:'Zable',
    //ToDo change the secret before the deployament
    secret:'blahh_blahh_bllaahh',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    // store: new MongoStore({
    //     mongooseConnection :db,
    //     autoRemove:'desable'
    // },
    // function(err){
    //     console.log(err || 'connect-mongodb setup ok')
    // }    
    // )
    store: MongoStore.create({
            mongoUrl: 'mongodb://127.0.0.1/Zable_development',
            autoRemove: 'disabled',
        })
        
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser)
// express router
app.use('/',require('./routes/index')) // route always below the passport

app.listen(port,(err)=>{
    if(err){
        console.log(chalk.inverse.red("Error to Listed the Express Servier"));
        return;
    }
    console.log(chalk.inverse(`Server is connected ${port}.`))
})