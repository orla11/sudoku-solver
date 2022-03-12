import { Request, Response, NextFunction } from "express";
import { IBoard } from "../interfaces/IBoard";

const boardValidator = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let board = (req.body as IBoard).board;

	if (board.length === 0 || board[0].length === 0) {
	}
};
