import express from "express";
import authRouter from "./routes/authRouter";
import connectUserDB from "./connections/userDb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware";
import userRouter from "./routes/userRouter";
import { authenticate } from "./middleware/authMiddleware";


dotenv.config();

connectUserDB();

const app = express();

app.use(bodyParser.json());

app.use(errorHandler);



app.use(cookieParser());

interface UserBasicInfo {
    _id: string;
    username: string;
    email: string;
    role: string;
  }
  
declare global {
  namespace Express {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }
}

const port = process.env.PORT || 3000;

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );


app.use(authRouter);
app.use("/users", authenticate, userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

