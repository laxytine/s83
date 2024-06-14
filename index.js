// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();



// [SECTION] Server Setup
const app = express();

// [SECTION] Middleware Setup
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// [SECTION] Cors Setup
const corsOptions = {
	origin: ['http://localhost:4000', 'http://localhost:3000'],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

//Routes Middleware
const moviesRoutes = require("./routes/movies");
const userRoutes = require("./routes/user");


// [SECTION] Backend Routes
app.use("/movies", moviesRoutes);
app.use("/users", userRoutes);

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};