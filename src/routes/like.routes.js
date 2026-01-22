import { Router } from "express";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(
    /* #swagger.tags = ['Like']
      #swagger.summary = 'Toggle video like'
      #swagger.description = 'Toggle like for a video'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['videoId'] = { in: 'path', required: true, type: 'string', description: 'Video ID' }
      #swagger.responses[200] = {
          description: 'Video like toggled successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'User Liked the video'
          }
      }
      #swagger.responses[400] = { description: 'Invalid Video ID' }
      #swagger.responses[401] = { description: 'Unauthorized' }
      #swagger.responses[500] = { description: 'Error while liking/unliking the video' }
  */
    toggleVideoLike
);
router.route("/toggle/c/:commentId").post(
    /* #swagger.tags = ['Like']
      #swagger.summary = 'Toggle comment like'
      #swagger.description = 'Toggle like for a comment'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['commentId'] = { in: 'path', required: true, type: 'string', description: 'Comment ID' }
      #swagger.responses[200] = {
          description: 'Comment like toggled successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'Comment Liked'
          }
      }
      #swagger.responses[400] = { description: 'Invalid Comment ID' }
      #swagger.responses[401] = { description: 'Unauthorized' }
      #swagger.responses[500] = { description: 'Error while liking/unliking comment' }
  */
    toggleCommentLike
);
router.route("/toggle/t/:tweetId").post(
    /* #swagger.tags = ['Like']
      #swagger.summary = 'Toggle tweet like'
      #swagger.description = 'Toggle like for a tweet'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['tweetId'] = { in: 'path', required: true, type: 'string', description: 'Tweet ID' }
      #swagger.responses[200] = {
          description: 'Tweet like toggled successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'Tweet Liked'
          }
      }
      #swagger.responses[400] = { description: 'Invalid Tweet ID' }
      #swagger.responses[401] = { description: 'Unauthorized' }
      #swagger.responses[500] = { description: 'Error while Liking/unliking the Tweet' }
  */
    toggleTweetLike
);
router.route("/videos").get(
    /* #swagger.tags = ['Like']
      #swagger.summary = 'Get liked videos'
      #swagger.description = 'Get all videos liked by the user'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = {
          description: 'Liked videos fetched successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: [],
              message: 'liked videos'
          }
      }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
    getLikedVideos
);

export default router;
