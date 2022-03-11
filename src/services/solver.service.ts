import { spawn } from "child_process";

const solveBoard = async function (board: Number[][]) {
	// solver.py spawning process
	const solver = spawn("python", ["./scripts/solver.py"]);

	solver.stderr.on("data", (data) => {
		console.error("err: ", data.toString());
	});

	solver.on("error", (error) => {
		console.error("error: ", error.message);
	});

	solver.on("close", (code) => {
		console.log("child process exited with code ", code);
	});
};

export default { solveBoard };
