import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'
import cors from "cors";
       

const app = express();

app.use(cors({ origin: ENV.FRONT_END_URL }));

app.use(clerkMiddleware()) // auth objetcs will be attached to req objet 

app.use(express.json()); // parse Json request bodies

app.use(express.urlencoded({ extended: true })) // parses form data (Like html forms).

app.get("/", (req, res) => res.send("Hello World!"));


app.listen(ENV.PORT, () => console.log("server is up and running on PORT:", ENV.PORT));
