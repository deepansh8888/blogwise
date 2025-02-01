//Server with cookie resetting problem

require("./db_connect");
require("dotenv").config();
const Users = require("./users");
const Blogs = require("./blogs");
const jwt = require("jsonwebtoken");
// const formidable = require("formidable");
var http = require("http");
// const fs = require("fs");

// MIDDLEWARE IMPLEMENTED
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "No token provided" }));
      return;
    }

    const token = authHeader.split(" ")[1];
    if (token == null) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "No token provided" }));
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid token" }));
        return;
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error in authenticateUser middleware:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
};

// CREATE HTTP SERVER
http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    //FLIGHT REQUEST HANDLING
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    const unProtectedRoutes = ["/login", "/register"];
    if (!unProtectedRoutes.includes(req.url)) {
      authenticateUser(req, res, () => {
        console.log("User authenticated");
      });
    }

    switch (req.url) {
      case "/authenticate":
        res.end();
        return;
        break;

      //REGISTER POST REQUEST
      case "/register":
        if (req.method == "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const parsedBody = JSON.parse(body);
              const isUserAlreadyExist = await Users.findOne({
                username: parsedBody.username,
              });
              // Case when the user already exists
              if (isUserAlreadyExist) {
                res.writeHead(409);
                res.end(
                  JSON.stringify({ message: "This user already exists" })
                );
                return;
              } else {
                await Users.create({
                  username: parsedBody.username,
                  email: parsedBody.email,
                  password: parsedBody.password,
                  // sessionId: "tempId",
                });
                res.end(
                  JSON.stringify({ message: "Registration Info Received" })
                );
                return;
              }
            } catch (error) {
              console.error("Registration error:", error);
              res.writeHead(500);
              res.end(JSON.stringify({ message: "Internal server error" }));
              return;
            }
          });
          break;
        }

      //LOGIN POST REQUEST
      case "/login":
        if (req.method == "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const parsedBody = JSON.parse(body);
              const checkUsername = await Users.findOne({
                username: parsedBody.username,
              });
              if (!checkUsername) {
                res.end(JSON.stringify({ message: "User doesn't exist" }));
                return;
              }

              if (checkUsername.password === parsedBody.password) {
                //Set COOKIE if user if valid and logged In
                // const sessionId = crypto.randomUUID();
                // res.setHeader('Set-Cookie', `username=${parsedBody.username}; sessionId=${sessionId}; Path=/; Max-Age:3600`);
                // await Users.updateOne({_id: checkUsername._id}, {$set: {sessionId: sessionId}});
                const userObj = {
                  username: checkUsername.username,
                };
                const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: '30min' });

                res.setHeader(
                  "Set-Cookie",
                  `username=${parsedBody.username};  Path=/;`
                );
                // res.setHeader('Authorization', `Bearer ${token}`);
                // res.end(JSON.stringify({message: "Login SuccessFul"}));
                res.end(
                  JSON.stringify({ message: "Login Successful", token: token })
                );

                return;
              } else {
                res.end(
                  JSON.stringify({
                    message: "Username or password Incorrect 2",
                  })
                );
                return;
              }
            } catch (error) {
              console.error("Login error:", error);
              res.writeHead(500);
              res.end(JSON.stringify({ message: "Internal server error" }));
              return;
            }
          });
        }
        break;

      case "/createblog": {
        console.log("chuoshvb");
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            let parsedBody = JSON.parse(body);
            const matchFound = await Blogs.findOne({_id: parsedBody._id});
            if(matchFound){
              await Blogs.updateOne({_id: parsedBody._id}, parsedBody);
            }else{
              const newBlog = await Blogs.create(parsedBody);
            }
            // console.log("blog received", parsedBody);
           
            res.end(JSON.stringify({ message: "Blog saved to database!" }));
          } catch (error) {
            res.end(
              JSON.stringify({
                message: "Unable to submit blog",
                error: error,
              })
            );
          }
        });
        break;
      }

      //GET REQUEST TO SEE ALL THE BLOGS
      case "/getallblogs": {
        (async () => {
          try {
            //MongoDb returns all the results as array of objects
            const result = await Blogs.find();
            res.end(JSON.stringify(result));
            return;
          } catch (error) {
            console.log("Can't fetch all blogs backedn", error);
          }
        })();
        //the above is IIFE, Immediately Invoked Function Expression
        break;
      }

      case "/getSingleBlog": {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            const parsedBody = JSON.parse(body); // Parse body safely

            let blogFound = await Blogs.findOne({ _id: parsedBody._id }); // Query database
            if (blogFound) {
              res.end(JSON.stringify(blogFound)); // Send the blog data as response
            } else {
              res.end(
                JSON.stringify({ message: "Blog with given title not found" })
              ); // Blog not found
            }
          } catch (error) {
            console.error("Error processing /getSingleBlog:", error);
            res.end(
              JSON.stringify({
                message: "An error occurred",
                error: error.message,
              })
            ); // Send error response
          }
        });
        break;
      }

      case "/getmyblogs": {
        console.log("reached hjlks");
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            let parsedBody = JSON.parse(body);
            let filteredBlogs = await Blogs.find({
              username: parsedBody.username,
            });
            res.end(JSON.stringify(filteredBlogs));
          } catch (error) {
            console.error("Error fetching filtered blogs", error);
            res.end(
              JSON.stringify({
                message: "Fetch Failed",
                error: error.message,
              })
            );
          }
        });
        break;
      }

      case "/deleteblog": {
        console.log("reached delete blog");
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            let parsedBody = JSON.parse(body);
            const response = await Blogs.deleteOne({ _id: parsedBody._id });
            res.end(JSON.stringify(response));
            console.log(response);
          } catch (error) {
            res.end(JSON.stringify({ message: "failed to deleted yo!" }));
            console.log(error);
          }
        });
        break;
      }

      default:
        try {
          res.writeHead(404);
          res.end("Not Found"); // End the response after writing headers
        } catch (error) {
          console.error("Error in default switch case:", error);
          // You cannot send headers again, but you can log the error
        }
        return;
    }
  })
  .listen(8080);
