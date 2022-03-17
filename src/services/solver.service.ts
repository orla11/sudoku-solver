import { spawn } from "child_process";
import path from "path";

const solveBoard = async function (board: Number[][]) {
	let resolve: Function, reject: Function;
	let res = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});

	const solver = spawn("python", [
		path.join(__dirname, "../scripts/solver.py"),
		JSON.stringify(board)
	]);

	solver.stdout.on("data", function (data) {
		console.log("data: ", data.toString());
		resolve(JSON.parse(data.toString())); 
	});

	solver.stderr.on("error", (error) => {
		console.error("error: ", error.message);
		reject(error.message);
	});

	solver.on("close", (code) => {
		console.log("child solver process exited with code ", code);
	});

	return res;
};

export default { solveBoard };
