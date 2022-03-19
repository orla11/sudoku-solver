import express from "express";
import yargs from "yargs";
import cors from "cors";
import config from "./config/config";
//import connectDB from "./db/connect";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
import solverRouter from "./routes/solver.route";

const argv = yargs
	.option('cors', {
		alias: 'c',
		description: 'Allow CORS',
		type: 'boolean'
	})
	.option('python', {
		alias: 'p',
		description: 'Python interpreter',
		type: 'string'
	})
	.help()
	.alias('help', 'h').argv;

// import SolverService from "./services/solver.service";
// SolverService.solveBoard(
// 	[
// 		[7, 8, 0, 4, 0, 0, 1, 2, 0],
// 		[6, 0, 0, 0, 7, 5, 0, 0, 9],
// 		[0, 0, 0, 6, 0, 1, 0, 7, 8],
// 		[0, 0, 7, 0, 4, 0, 2, 6, 0],
// 		[0, 0, 1, 0, 5, 0, 9, 3, 0],
// 		[9, 0, 4, 0, 6, 0, 0, 0, 5],
// 		[0, 7, 0, 3, 0, 0, 0, 1, 2],
// 		[1, 2, 0, 0, 0, 7, 4, 0, 0],
// 		[0, 4, 9, 2, 0, 6, 0, 0, 7]
// 	]
// );

import "express-async-errors";

const app: express.Application = express();
const port: any = config.server.port;

export const python: string = argv.python || 'python';
console.log(`Python interpreter: ${python}`)

if(argv.cors){
	console.log('Allowing CORS...');
	app.use(cors());
}

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
