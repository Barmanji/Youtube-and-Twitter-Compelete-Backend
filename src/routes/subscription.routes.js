import { Router } from "express";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(
        /* #swagger.tags = ['Subscription']
        #swagger.summary = 'Get subscribed channels'
        #swagger.description = 'Get all channels a user is subscribed to'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['channelId'] = { in: 'path', required: true, type: 'string', description: 'User ID' }
        #swagger.responses[200] = {
            description: 'Subscribed channels fetched successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: [],
                message: 'Subscribed Channels Fetched'
            }
        }
        #swagger.responses[400] = { description: 'Invalid Channel ID' }
        #swagger.responses[401] = { description: 'Unauthorized' }
    */
        getSubscribedChannels
    )
    .post(
        /* #swagger.tags = ['Subscription']
        #swagger.summary = 'Toggle subscription'
        #swagger.description = 'Toggle subscription to a channel'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['channelId'] = { in: 'path', required: true, type: 'string', description: 'Channel ID' }
        #swagger.responses[200] = {
            description: 'Subscription toggled successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: {},
                message: 'Channel Subscribed'
            }
        }
        #swagger.responses[400] = { description: 'Invalid channel ID' }
        #swagger.responses[401] = { description: 'Unauthorized' }
        #swagger.responses[500] = { description: 'Error while Subscribing or Unsubscribing' }
    */
        toggleSubscription
    );

router.route("/u/:subscriberId").get(
    /* #swagger.tags = ['Subscription']
      #swagger.summary = "Get user's channel subscribers"
      #swagger.description = 'Get all subscribers of a channel'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['subscriberId'] = { in: 'path', required: true, type: 'string', description: 'Channel ID' }
      #swagger.responses[200] = {
          description: 'Subscribers fetched successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: [],
              message: 'Subscribers Fetched Successfully'
          }
      }
      #swagger.responses[400] = { description: 'Invalid Subscriber ID' }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
    getUserChannelSubscribers
);

export default router;
