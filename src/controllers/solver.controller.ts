import { Request, Response, NextFunction } from "express";
import SolverService from "../services/solver.service";

const solveBoard = async (req: Request, res: Response): Promise<void> => {
	SolverService.solveBoard([[]]);
	//res.status(200).json({ board });
};

export { solveBoard };
