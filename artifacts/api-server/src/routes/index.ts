import { Router, type IRouter } from "express";
import healthRouter from "./health";
import publicRouter from "./public";
import enquiriesRouter from "./enquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicRouter);
router.use(enquiriesRouter);

export default router;
