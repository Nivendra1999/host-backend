import mongoose from "mongoose";
import bodyParser from "body-parser";
import express from "express";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import postRoute from "./routes/post.route.js";
import conversationRoute from "./routes/conversation.js"
import messageRoute from "./routes/message.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import http from "http";
// import initializeSocketIO from "./socket/socket_connection.js";
const app = express();

// const server = http.createServer(app);

// initializeSocketIO(server);

app.use(bodyParser.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",(req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials",ture);
    res.setHeader("Access-Control-Allow-Origin:*");
});
const url = "mongodb://nivendravishvakarma:nivendra@ac-7buhfx5-shard-00-00.ooafvjm.mongodb.net:27017,ac-7buhfx5-shard-00-01.ooafvjm.mongodb.net:27017,ac-7buhfx5-shard-00-02.ooafvjm.mongodb.net:27017/mywings?ssl=true&replicaSet=atlas-2oejy5-shard-0&authSource=admin&retryWrites=true&w=majority"

// const url = "mongodb+srv://setbug56:setbug56@cluster0.aqsd1j2.mongodb.net/mywings?retryWrites=true&w=majority"
// const url = "mongodb+srv://itsAjay:f0LPeGkDzDoPCZ52@cluster0.p5bdwqq.mongodb.net/mywings?retryWrites=true&w=majority"
mongoose.connect(url)
    .then(result => {
        app.use(cors());
        app.use("/user", userRoute);
        app.use("/admin", adminRoute);
        app.use("/post", postRoute);
        app.use("/conversation",conversationRoute);
        app.use("/message", messageRoute);
        

        app.listen(3000, () => {
            console.log("server started...");
        })
    })
    .catch(err => {
        console.log(err);
    })

