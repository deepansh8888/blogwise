//Server with cookie resetting problem

require('./db_connect');
require('dotenv').config();
const Users = require('./users');
const Blogs = require('./blogs');
const jwt = require('jsonwebtoken');

var http = require('http');

const authenticateUser = (req, res, next) => {
    const tokenCookie = req.headers.cookie ? req.headers.cookie.split(";")[1].split("=")[1] : null;
    console.log(tokenCookie);
    if(tokenCookie == null) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "No token provided" }));
        return;
    }

    jwt.verify(tokenCookie, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid token" }));
            return;
        }
        req.user = user;
        next();
    });
}

http.createServer( async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      console.log(req.url);

      const protectedRoutes = ["/getallblogs", "/getSingleBlog", "/createblog"];
      if(protectedRoutes.includes(req.url)) {
        console.log("Protected Route yes");
        console.log(req.headers.cookie);
        console.log(req.headers.cookie.split(";")[1].split("=")[1]);
         authenticateUser(req, res, () => {console.log("User authenticated"); });
      }
       //Handle the pre-flight request 
        // PRE FLIGHT REQUESTS: are http requests that check if it's safe to send a request to the server
        //They are used to request permission from a website before sending an HTTP Request that might have side effects
        if(req.method === 'OPTIONS'){
            res.writeHead(204);
            res.end();
            return;
            }
    
//     if (req.url && req.method !== 'OPTIONS' && (req.url !== "/login" && req.url !== "/register")) {
//         try{
//         (async () => {
//                 if(!req.headers.cookie){
//                     res.writeHead(401, { 'Content-Type': 'application/json' });
//                     res.end(JSON.stringify({ message: "Unauthorized: No cookie provided" }));
//                     return ;
//                 }
//                 console.log(req.headers.cookie);
//                 const sessionId = req.headers.cookie.split(";")[1].split("=")[1];
//                 console.log(sessionId);
//                 const findUser = await Users.findOne({sessionId: sessionId});
//                 if(!findUser) {
//                     res.writeHead(402);
//                     res.end(JSON.stringify({ message: "Unauthorized: No cookie provided" }));
//                     return ;
//                 }
          
//         })();
//         }
//         catch(error){
//         console.log("is this it",error)
//     };
// }

    switch(req.url){
        //REGISTER POST REQUEST
        case "/register":
            if(req.method == "POST"){
                let body = '';
                req.on('data', (chunk)=>{
                    body += chunk.toString();
                });

                req.on('end', async ()=> {
                    try {
                        const parsedBody = JSON.parse(body);
                        const isUserAlreadyExist = await Users.findOne({ username: parsedBody.username });
                        // Case when the user already exists
                        if(isUserAlreadyExist){
                            res.writeHead(409);
                            res.end(JSON.stringify({message: "This user already exists"}));
                        }
                        else {
                            await Users.create({
                                username: parsedBody.username,
                                email: parsedBody.email,
                                password: parsedBody.password,
                                // sessionId: "tempId",
                            });
                            res.end(JSON.stringify({message: "Registration Info Received"}));
                            return;
                        }
                    } catch (error) {
                        console.error("Registration error:", error);
                        res.writeHead(500);
                        res.end(JSON.stringify({message: "Internal server error"}));
                        return;
                        
                    }
                });
                break;
            }

        //LOGIN POST REQUEST
        case "/login":
            if(req.method == "POST"){
                let body = '';
                req.on('data', (chunk)=>{
                    body += chunk.toString();
                });

                req.on('end', async ()=>{
                    const parsedBody = JSON.parse(body);
                    const checkUsername = await Users.findOne({username: parsedBody.username});
                    if(!checkUsername){
                        res.end(JSON.stringify({message: "User doesn't exist"}));
                        return;
                    }

                    if( checkUsername.password === parsedBody.password ){
                        //Set COOKIE if user if valid and logged In
                        // const sessionId = crypto.randomUUID();
                        // res.setHeader('Set-Cookie', `username=${parsedBody.username}; sessionId=${sessionId}; Path=/; Max-Age:3600`);
                        // await Users.updateOne({_id: checkUsername._id}, {$set: {sessionId: sessionId}});
                        const userObj = {
                            username: checkUsername.username,
                        }
                        const token = jwt.sign(userObj, process.env.JWT_SECRET);

                        res.setHeader('Set-Cookie', [`username=${parsedBody.username};  Path=/;`, `jwtToken=${token}`]);
                        res.end(JSON.stringify({message: "Login Successful"}));
                        return;
                        }
                        else {
                            res.end(JSON.stringify({message: "Username or password Incorrect 2"}));
                            return;
                        }
                });
            }
            break;

        //CREATE BLOG REQUEST
        case "/createblog":
            (() => {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });

                req.on('end', async () => {
                    try {
                        if (!body) {
                            res.end(JSON.stringify({ message: "Empty request body" }));
                            return;
                        }
                        const cookieHeader = req.headers.cookie;
                        
                        const username = cookieHeader.split(";")[0].split("=")[1];
             
                        const parsedBody = JSON.parse(body);
                        await Blogs.create({
                            title: parsedBody.title,
                            content: parsedBody.content,
                            username: username,
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: "Post saved successfully" }));
                        return;
                    } catch (error) {
                        console.error("Create blog error in backend:", error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: "Failed to create blog at server side" }));
                    }
                });
            })();
            break;

        //GET REQUEST TO SEE ALL THE BLOGS
        case "/getallblogs":
            ( async ()=>{
                try {
                    //MongoDb returns all the results as array of objects
                    const result = await Blogs.find();
                    res.end(JSON.stringify(result));
                    return;
                }
                catch(error){
                    console.log("Can't fetch all blogs backedn",error);
                }
            })();
            //the above is IIFE, Immediately Invoked Function Expression
            break;


        case "/getSingleBlog":
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
        
            req.on('end', async () => {
                try {
                    const parsedBody = JSON.parse(body); // Parse body safely
        
                    const blogFound = await Blogs.findOne({ title: parsedBody.title }); // Query database
                    if (blogFound) {
                        res.end(JSON.stringify(blogFound)); // Blog found
                        return;
                    } else {
                        res.end(JSON.stringify({ message: "Blog with given title not found" })); // Blog not found
                        return;
                    }
                } catch (error) {
                    console.error("Error processing /getSingleBlog:", error);
                    res.end(JSON.stringify({ message: "An error occurred", error: error.message })); // Send error response
                    return;
                }
            });
            break;

        default: 
            res.end(JSON.stringify({message:"Default Switch Case"}));
            return;
    }
})
.listen(8080)