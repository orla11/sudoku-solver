import express, { Router } from "express";
import { solveBoard } from "../controllers/solver.controller";

const router: Router = Router();

router.route("/").post(solveBoard);

export default router;
