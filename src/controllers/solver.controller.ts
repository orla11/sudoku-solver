import { Request, Response, NextFunction } from "express";
import { IBoard } from "../interfaces/IBoard";
import SolverService from "../services/solver.service";

const solveBoard = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	let request: IBoard = req.body as IBoard;
	let solution = await SolverService.solveBoard(request.board);
	res.status(200).json({ board: solution });
};

export { solveBoard };
