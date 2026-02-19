import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

       

const app = express();

app.use(cors({ origin: ENV.FRONT_END_URL, credentials: true }));
// Allow credentials to be sent with requests

app.use(express.json()); // parse Json request bodies
app.use(express.urlencoded({ extended: true })); // parses form data (Like html forms)

app.use(clerkMiddleware()); // auth objects will be attached to req object 

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);



app.listen(ENV.PORT, () => console.log("server is up and running on PORT:", ENV.PORT));
