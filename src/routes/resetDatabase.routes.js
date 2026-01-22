import { Router } from "express";
import { resetDatabase } from "../controllers/resetDatabse.controller.js";

const router = new Router();
router.route("/").delete(
/* #swagger.tags = ['DANGER ZONE']
       #swagger.summary = 'Reset Database'
       #swagger.description = 'This action is NOT UNDOABLE. It will drop all collections and delete the credentials file.'
       #swagger.security = [{"bearerAuth": []}]

       #swagger.responses[200] = {
           description: 'Database dropped successfully',
           schema: {
               success: true,
               statusCode: 200,
               data: null,
               message: "Database dropped successfully"
           }
       }

       #swagger.responses[401] = {
           description: 'Unauthorized - Missing or invalid token'
       }

       #swagger.responses[500] = {
           description: 'Internal Server Error - Database drop failed'
       }
    */


    resetDatabase);
export default router;
