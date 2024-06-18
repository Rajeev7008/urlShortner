const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require('./connect.js');
const urlRoute = require('./routes/url.js');
const staticRoute = require('./routes/staticRouter.js')
const userRoute = require('./routes/user.js')
const URL = require('./models/url.js');
const {checkForAuthentication, restrictTo} = require('./middlewares/auth.js')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));
app.use(express.json()); // // json data parse middleware
app.use(express.urlencoded({ extended: false })); // form data parse middleware
app.use(cookieParser()); // cookie parser middleware

const PORT = 8001;

// Database connection
connectToMongoDB('mongodb://localhost:27017/shortUrls')
    .then(() => console.log('mongoDB Connected'));

app.use(checkForAuthentication);
app.use('/url', restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use('/user', userRoute);
app.use('/', staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            },
        },
    }
    
    );
    res.redirect(entry.redirectURL)
})
app.listen(PORT, ()=> console.log(`server Started at Port ${PORT}`))