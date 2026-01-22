import { Router } from "express";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(
    /* #swagger.tags = ['Playlist']
      #swagger.summary = 'Create a playlist'
      #swagger.description = 'Create a new playlist'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Playlist name and description',
          required: true,
          schema: {
              $name: 'My Playlist',
              $description: 'This is a playlist'
          }
      }
      #swagger.responses[200] = {
          description: 'Playlist created successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'Playlist created successfully'
          }
      }
      #swagger.responses[400] = { description: 'Name and description are required' }
      #swagger.responses[401] = { description: 'Unauthorized or Same named playlist are now allowed' }
  */
    createPlaylist
);

router
    .route("/:playlistId")
    .get(
        /* #swagger.tags = ['Playlist']
        #swagger.summary = 'Get playlist by ID'
        #swagger.description = 'Get a playlist by its ID'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['playlistId'] = { in: 'path', required: true, type: 'string', description: 'Playlist ID' }
        #swagger.responses[200] = {
            description: 'Playlist fetched successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: [],
                message: 'Playlist Fetched'
            }
        }
        #swagger.responses[400] = { description: 'Invalid playlist ID' }
        #swagger.responses[401] = { description: 'Unauthorized' }
        #swagger.responses[500] = { description: 'Error fetching playlist' }
    */
        getPlaylistById
    )
    .patch(
        /* #swagger.tags = ['Playlist']
        #swagger.summary = 'Update a playlist'
        #swagger.description = 'Update a playlist by its ID'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['playlistId'] = { in: 'path', required: true, type: 'string', description: 'Playlist ID' }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Playlist name and description',
            required: true,
            schema: {
                $name: 'My Updated Playlist',
                $description: 'This is an updated playlist'
            }
        }
        #swagger.responses[200] = {
            description: 'Playlist updated successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: {},
                message: 'Playlist is updated successfully'
            }
        }
        #swagger.responses[400] = { description: 'playlist is invalid' }
        #swagger.responses[401] = { description: 'Unauthorized' }
        #swagger.responses[403] = { description: 'You are not allowed to modify this playlist' }
    */
        updatePlaylist
    )
    .delete(
        /* #swagger.tags = ['Playlist']
        #swagger.summary = 'Delete a playlist'
        #swagger.description = 'Delete a playlist by its ID'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['playlistId'] = { in: 'path', required: true, type: 'string', description: 'Playlist ID' }
        #swagger.responses[200] = {
            description: 'Playlist deleted successfully',
            schema: {
                success: true,
                statusCode: 200,
                data: null,
                message: 'playlist is successfully deleted'
            }
        }
        #swagger.responses[401] = { description: 'Unauthorized' }
        #swagger.responses[403] = { description: 'You are not allowed to modify this playlist' }
        #swagger.responses[404] = { description: 'plalist is invalid' }
    */
        deletePlaylist
    );

router.route("/add/:videoId/:playlistId").patch(
    /* #swagger.tags = ['Playlist']
      #swagger.summary = 'Add video to playlist'
      #swagger.description = 'Add a video to a playlist'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['videoId'] = { in: 'path', required: true, type: 'string', description: 'Video ID' }
      #swagger.parameters['playlistId'] = { in: 'path', required: true, type: 'string', description: 'Playlist ID' }
      #swagger.responses[200] = {
          description: 'Video added to playlist successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'Video is successfully added'
          }
      }
      #swagger.responses[400] = { description: 'Invalid Playlist or Video ID or Video already in the Playlist' }
      #swagger.responses[401] = { description: 'Unauthorized' }
      #swagger.responses[403] = { description: 'You are not allowed to modify this playlist' }
  */
    addVideoToPlaylist
);
router.route("/remove/:videoId/:playlistId").patch(
    /* #swagger.tags = ['Playlist']
      #swagger.summary = 'Remove video from playlist'
      #swagger.description = 'Remove a video from a playlist'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['videoId'] = { in: 'path', required: true, type: 'string', description: 'Video ID' }
      #swagger.parameters['playlistId'] = { in: 'path', required: true, type: 'string', description: 'Playlist ID' }
      #swagger.responses[200] = {
          description: 'Video removed from playlist successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {},
              message: 'video has been deleted successfully'
          }
      }
      #swagger.responses[400] = { description: "Invalid Playlist or Video ID or Video doesn't exist in playlist" }
      #swagger.responses[401] = { description: 'Unauthorized' }
      #swagger.responses[403] = { description: 'You are not allowed to modify this playlist' }
  */
    removeVideoFromPlaylist
);

router.route("/user/:userId").get(
    /* #swagger.tags = ['Playlist']
      #swagger.summary = "Get user's playlists"
      #swagger.description = 'Get all playlists of a user'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['userId'] = { in: 'path', required: true, type: 'string', description: 'User ID' }
      #swagger.responses[200] = {
          description: 'Playlists fetched successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: [],
              message: 'Playlists Fetched'
          }
      }
      #swagger.responses[400] = { description: 'Invalid User ID' }
      #swagger.responses[401] = { description: 'Unauthorized' }
      #swagger.responses[504] = { description: 'No Playlists found' }
  */
    getUserPlaylists
);

export default router;
