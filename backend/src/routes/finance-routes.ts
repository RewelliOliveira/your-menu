import { Router } from "express";

import * as financeController from "../controllers/finance-controller";
import { authenticate } from "../middlewares/authenticate";

export const financeRoutes = Router();

financeRoutes.use(authenticate);
financeRoutes.get("/report", financeController.getReport);
financeRoutes.get("/ledger", financeController.getLedger);
financeRoutes.post("/transactions", financeController.createTransaction);
financeRoutes.put("/transactions/:id", financeController.updateTransaction);
financeRoutes.delete("/transactions/:id", financeController.deleteTransaction);
