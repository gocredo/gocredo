import express from "express"
import helmet from "helmet"
import { connectGraphQL } from "@/graphql/graphql.js"
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors'
import { errorMiddleware } from "@/middlewares/error.js"
import morgan from "morgan"
import dotenv from "dotenv"

import bodyParser from "body-parser";
import rateLimit from 'express-rate-limit';

import { clerkMiddleware } from "@clerk/express";
import { startKeepAlivePing } from "./helpers/keepServerAlive.js";
  
dotenv.config({path: './.env',});
  
  export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
  const port = process.env.PORT || 3000;
  

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin:' * ',credentials:true}));  
app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  }))
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});  
app.use(limiter); 

app.use(
  clerkMiddleware({
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

const graphqlMiddleware = await connectGraphQL();
app.use("/graphql", bodyParser.json(), graphqlMiddleware);




app.use(morgan('dev'))
startKeepAlivePing(process.env.SELF_URL);    
  
  // app.get('/', (req, res) => {
  //    res.send('Hello, World!');
  // });
  
  // your routes here
  
    
  // app.get("*", (req, res) => {
  //   res.status(404).json({
  //     success: false,
  //     message: "Page not found",
  //   });
  // });
  
  app.use(errorMiddleware);
    
  app.listen(port, () => console.log('Server is working on Port:'+port+' in '+envMode+' Mode.'));
  