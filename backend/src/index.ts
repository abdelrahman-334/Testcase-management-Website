import express from "express";
import authRouter from "./routes/authRouter";
import connectUserDB from "./connections/userDb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware";
import userRouter from "./routes/userRouter";
import { authenticate, isRole } from "./middleware/authMiddleware";
import projectRouter from "./routes/projectRouter";
import TestcaseRouter from "./routes/testcaseRouter";
import testscriptRouter from "./routes/testscriptRouter";
import TestExecutionrouter from "./routes/testExecutionRoutes";
import TestSuiteRouter from "./routes/testsuiteRouter";


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

const port = process.env.PORT || 5000;

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );


app.use(authRouter);
app.use("/users", authenticate, userRouter);
app.use("/projects", authenticate,projectRouter)
app.use("/api/testscripts",authenticate,testscriptRouter)
app.use("/api/testExecution",authenticate,TestExecutionrouter)
app.use("/api/",authenticate,TestSuiteRouter)
app.use(errorHandler)

app.use("/:projectId/test-cases",authenticate,TestcaseRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

