import express from "express";

const notFoundMiddleware = (req: express.Request, res: express.Response) =>
	res.status(404).send("Route does not exist");

export default notFoundMiddleware;
