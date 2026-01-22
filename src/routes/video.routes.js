import { Router } from "express";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(
        /* #swagger.tags = ['Video']
       #swagger.summary = 'Get all videos'
       #swagger.description = 'Get all videos with pagination'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Page number' }
       #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Number of videos per page' }
       #swagger.parameters['query'] = { in: 'query', type: 'string', description: 'Search query' }
       #swagger.parameters['sortBy'] = { in: 'query', type: 'string', description: 'Sort by field' }
       #swagger.parameters['sortType'] = { in: 'query', type: 'string', description: 'Sort type (asc/desc)' }
       #swagger.parameters['userId'] = { in: 'query', type: 'string', description: 'User ID' }
       #swagger.responses[200] = { 
            description: 'Videos fetched successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: {
                    docs: [],
                    totalDocs: 0,
                    limit: 10,
                    totalPages: 1,
                    page: 1,
                    pagingCounter: 1,
                    hasPrevPage: false,
                    hasNextPage: false,
                    prevPage: null,
                    nextPage: null
                },
                message: 'Videos fetched successfully'
            }
       }
       #swagger.responses[500] = { description: 'Internal Server Error' }
    */
        getAllVideos
    )
    .post(
        /* #swagger.tags = ['Video']
       #swagger.summary = 'Publish a video'
       #swagger.description = 'Publish a video with a title, description, video file and thumbnail.'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.consumes = ['multipart/form-data']
       #swagger.parameters['title'] = { in: 'formData', type: 'string', required: true, description: 'Video title' }
       #swagger.parameters['description'] = { in: 'formData', type: 'string', required: true, description: 'Video description' }
       #swagger.parameters['videoFile'] = { in: 'formData', type: 'file', required: true, description: 'Video file' }
       #swagger.parameters['thumbnail'] = { in: 'formData', type: 'file', required: true, description: 'Video thumbnail' }
       #swagger.responses[201] = { 
            description: 'Video published successfully',
            schema: {
                success: true,
                statusCode: 201,
                data: {},
                message: 'Video published successfully'
            }
       }
       #swagger.responses[400] = { description: 'Invalid data provided' }
       #swagger.responses[500] = { description: 'Internal Server Error' }
    */
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(
        /* #swagger.tags = ['Video']
        #swagger.summary = 'Get a video by ID'
        #swagger.description = 'Get a single video by its ID.'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['videoId'] = { in: 'path', type: 'string', required: true, description: 'Video ID' }
        #swagger.responses[200] = {
            description: 'Video fetched successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: {},
                message: 'Video fetched successfully'
            }
        }
        #swagger.responses[404] = { description: 'Video not found' }
        #swagger.responses[500] = { description: 'Internal Server Error' }
    */
        getVideoById
    )
    .delete(
        /* #swagger.tags = ['Video']
        #swagger.summary = 'Delete a video'
        #swagger.description = 'Delete a video by its ID.'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['videoId'] = { in: 'path', type: 'string', required: true, description: 'Video ID' }
        #swagger.responses[200] = {
            description: 'Video deleted successfully',
            schema: {
                success: true,
                statusCode: 200,
                message: 'Video deleted successfully'
            }
        }
        #swagger.responses[404] = { description: 'Video not found' }
        #swagger.responses[500] = { description: 'Internal Server Error' }
    */
        deleteVideo
    )
    .patch(
        /* #swagger.tags = ['Video']
        #swagger.summary = 'Update a video'
        #swagger.description = "Update a video's title, description and thumbnail by its ID."
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['videoId'] = { in: 'path', type: 'string', required: true, description: 'Video ID' }
        #swagger.parameters['title'] = { in: 'formData', type: 'string', description: 'Video title' }
        #swagger.parameters['description'] = { in: 'formData', type: 'string', description: 'Video description' }
        #swagger.parameters['thumbnail'] = { in: 'formData', type: 'file', description: 'Video thumbnail' }
        #swagger.responses[200] = {
            description: 'Video updated successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: {},
                message: 'Video updated successfully'
            }
        }
        #swagger.responses[400] = { description: 'Invalid data provided' }
        #swagger.responses[404] = { description: 'Video not found' }
        #swagger.responses[500] = { description: 'Internal Server Error' }
    */
        upload.single("thumbnail"),
        updateVideo
    );

router.route("/toggle/publish/:videoId").patch(
    /* #swagger.tags = ['Video']
      #swagger.summary = 'Toggle publish status'
      #swagger.description = 'Toggle the publish status of a video by its ID.'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['videoId'] = { in: 'path', type: 'string', required: true, description: 'Video ID' }
      #swagger.responses[200] = {
          description: 'Publish status toggled successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'Publish status toggled successfully'
          }
      }
      #swagger.responses[404] = { description: 'Video not found' }
      #swagger.responses[500] = { description: 'Internal Server Error' }
  */
    togglePublishStatus
);

export default router;
