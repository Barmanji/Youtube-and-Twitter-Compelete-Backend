import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

router.route("/").get(
    /* #swagger.tags = ['Healthcheck']
        #swagger.summary = 'Healthcheck'
        #swagger.description = 'Check if the server is up and running'
        #swagger.responses[200] = {
            description: 'Server is up and running',
            schema: {
                success: true,
                statusCode: 200,
                data: {},
                message: 'Server is up and running'
            }
        }
    */
    healthcheck
);

export default router;
