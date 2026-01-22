import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(
    /* #swagger.tags = ['Tweet']
      #swagger.summary = 'Create a tweet'
      #swagger.description = 'Create a new tweet'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Tweet content',
          required: true,
          schema: {
              $content: 'This is a tweet'
          }
      }
      #swagger.responses[200] = {
          description: 'Tweet created successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'Tweet created successfully'
          }
      }
      #swagger.responses[400] = { description: 'Tweet Content is missing!' }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
    createTweet
);
router.route("/user/:userId").get(
    /* #swagger.tags = ['Tweet']
      #swagger.summary = "Get user's tweets"
      #swagger.description = 'Get all tweets of a user'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['userId'] = { in: 'path', required: true, type: 'string', description: 'User ID' }
      #swagger.responses[200] = {
          description: 'Tweets fetched successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: [],
              message: 'Tweets fetched successfully'
          }
      }
      #swagger.responses[400] = { description: 'Invalid user id' }
      #swagger.responses[401] = { description: 'Unauthorized' }
      #swagger.responses[404] = { description: 'No tweets found' }
  */
    getUserTweets
);
router
    .route("/:tweetId")
    .patch(
        /* #swagger.tags = ['Tweet']
        #swagger.summary = 'Update a tweet'
        #swagger.description = 'Update a tweet by its ID'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['tweetId'] = { in: 'path', required: true, type: 'string', description: 'Tweet ID' }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Tweet content',
            required: true,
            schema: {
                $content: 'This is an updated tweet'
            }
        }
        #swagger.responses[201] = {
            description: 'Tweet updated successfully',
            schema: {
                success: true,
                statusCode: 201,
                data: {},
                message: 'Tweet updated successfully'
            }
        }
        #swagger.responses[400] = { description: 'Content field is missing or Tweet ID is invalid' }
        #swagger.responses[401] = { description: 'Unauthorized' }
    */
        updateTweet
    )
    .delete(
        /* #swagger.tags = ['Tweet']
        #swagger.summary = 'Delete a tweet'
        #swagger.description = 'Delete a tweet by its ID'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['tweetId'] = { in: 'path', required: true, type: 'string', description: 'Tweet ID' }
        #swagger.responses[200] = {
            description: 'Tweet deleted successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: {},
                message: 'Tweet deleted successfully'
            }
        }
        #swagger.responses[400] = { description: 'Invalid Tweet ID' }
        #swagger.responses[401] = { description: 'Unauthorized' }
        #swagger.responses[403] = { description: 'You are not allowed to delete this tweet' }
        #swagger.responses[404] = { description: 'Tweet not found' }
    */
        deleteTweet
    );

export default router;
