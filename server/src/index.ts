import createError from "http-errors";
import express, { Application, Request, Response, NextFunction } from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin";
import cafesRoutes from "./routes/cafes";

dotenv.config();

const app: Application = express();

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    })
);

// Route setup
app.use("/api/admin", adminRoutes);
app.use("/api/cafes", cafesRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

app.use((err: createError.HttpError, req: Request, res: Response) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});


const port: number = parseInt(process.env.PORT || "4000", 10);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
