import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { supabase } from "../supabase.js";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/health", async (_req, res) => {
  try {
    const { error } = await supabase
      .from("sections")
      .select("id")
      .limit(1)
      .abortSignal(AbortSignal.timeout(5000));

    if (error) {
      res.status(503).json({ status: "error" });
      return;
    }

    res.status(200).json({ status: "ok" });
  } catch (_err) {
    res.status(503).json({ status: "error" });
  }
});

export default router;
