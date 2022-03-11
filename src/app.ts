import express from "express";
import config from "./config/config";
//import connectDB from "./db/connect";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
import solverRouter from "./routes/solver.route";

import SolverService from "./services/solver.service";

SolverService.solveBoard([[]]);

import "express-async-errors";

const app: express.Application = express();
const port: any = config.server.port;

app.use(express.json());

// routes
app.get("/", (req: express.Request, res: express.Response) =>
	res.send(
		"<h1>Sudoku Solver API</h1><a href='/api/v1/solver'>Sudoku solver</a>"
	)
);

app.use("/api/v1/solver", solverRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
	try {
		//await connectDB(process.env.MONGO_URI);
		app.listen(port, () => console.log(`Server is listening on ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
