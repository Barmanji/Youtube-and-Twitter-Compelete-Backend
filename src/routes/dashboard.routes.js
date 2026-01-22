import { Router } from "express";
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(
    /* #swagger.tags = ['Dashboard']
      #swagger.summary = 'Get channel stats'
      #swagger.description = 'Get statistics for the logged in channel'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = {
          description: 'Channel stats fetched successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {
                  totalViews: 0,
                  totalVideos: 0,
                  totalSubscribers: 0,
                  totalLikes: 0
              },
              message: 'Channel Stats Fetched'
          }
      }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
    getChannelStats
);
router.route("/videos").get(
    /* #swagger.tags = ['Dashboard']
      #swagger.summary = 'Get channel videos'
      #swagger.description = 'Get all videos for the logged in channel'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = {
          description: 'Channel videos fetched successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: [],
              message: 'Channel Videos Fetched'
          }
      }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
    getChannelVideos
);

export default router;
