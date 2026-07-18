import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storeRouter from "./store";
import checkoutRouter from "./checkout";
import purchasesRouter from "./purchases";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storeRouter);
router.use(checkoutRouter);
router.use(purchasesRouter);
router.use(adminRouter);

export default router;
