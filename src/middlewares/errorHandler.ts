import express from "express";

const errorHandlerMiddleware = async (
	err: any,
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	console.log(err);
	return res
		.status(500)
		.json({ msg: "Something went wrong, please try again" });
};

export default errorHandlerMiddleware;
