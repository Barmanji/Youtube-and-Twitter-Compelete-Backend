import { Router } from "express";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/:videoId")
    .get(
        /* #swagger.tags = ['Comment']
      #swagger.summary = 'Get video comments'
      #swagger.description = 'Get all comments for a video'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['videoId'] = { in: 'path', required: true, type: 'string', description: 'Video ID' }
      #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Page number' }
      #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Number of comments per page' }
      #swagger.responses[200] = {
          description: 'Comments fetched successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: [],
              message: 'Comments Fetched'
          }
      }
      #swagger.responses[404] = { description: 'Video not found' }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
        getVideoComments
    )
    .post(
        /* #swagger.tags = ['Comment']
      #swagger.summary = 'Add a comment'
      #swagger.description = 'Add a comment to a video'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['videoId'] = { in: 'path', required: true, type: 'string', description: 'Video ID' }
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Comment content',
          required: true,
          schema: {
              $content: 'This is a comment'
          }
      }
      #swagger.responses[200] = {
          description: 'Comment added successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {
                  comment: {}
              },
              message: 'Comment added succesfully'
          }
      }
      #swagger.responses[400] = { description: 'Invalid video ID or content' }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
        addComment
    );
router
    .route("/c/:commentId")
    .delete(
        /* #swagger.tags = ['Comment']
      #swagger.summary = 'Delete a comment'
      #swagger.description = 'Delete a comment by its ID'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['commentId'] = { in: 'path', required: true, type: 'string', description: 'Comment ID' }
      #swagger.responses[200] = {
          description: 'Comment deleted successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'comment has updated succesfully'
          }
      }
      #swagger.responses[400] = { description: 'Invalid comment ID' }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
        deleteComment
    )
    .patch(
        /* #swagger.tags = ['Comment']
      #swagger.summary = 'Update a comment'
      #swagger.description = 'Update a comment by its ID'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['commentId'] = { in: 'path', required: true, type: 'string', description: 'Comment ID' }
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Comment content',
          required: true,
          schema: {
              $content: 'This is an updated comment'
          }
      }
      #swagger.responses[200] = {
          description: 'Comment updated successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {
                  comment: {},
                  updateComment: {}
              },
              message: 'comment has updated succesfully'
          }
      }
      #swagger.responses[400] = { description: 'Invalid comment ID or content' }
      #swagger.responses[401] = { description: 'Unauthorized' }
  */
        updateComment
    );

export default router;
