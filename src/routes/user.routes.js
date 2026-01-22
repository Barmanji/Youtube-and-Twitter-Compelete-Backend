import { Router } from "express";
import { seedUsers, getGeneratedCredentials } from "../seeds/user.seeds.js";
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    getUserChannelProfile,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
    /* #swagger.tags = ['User']
    #swagger.summary = 'Register a new user'
    #swagger.description = 'Register a user with multiple file uploads (avatar and cover image).'
    #swagger.consumes = ['multipart/form-data']

    #swagger.parameters['fullname'] = { in: 'formData', type: 'string', required: true, example: 'John Doe' }
    #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true, example: 'john@example.com' }
    #swagger.parameters['password'] = { in: 'formData', type: 'string', required: true, example: 'password123' }
    #swagger.parameters['username'] = { in: 'formData', type: 'string', required: true, example: 'johndoe' }

    #swagger.parameters['avatar'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'Profile picture'
    }
    #swagger.parameters['coverImage'] = {
        in: 'formData',
        type: 'file',
        required: false,
        description: 'Cover photo'
    }

    #swagger.responses[201] = {
        description: 'User registered successfully',
        schema: {
            success: true,
            statusCode: 201,
            data: {
                "_id": "69727d547c86ed0f1e5c8ecd",
                "username": "three",
                "email": "three@three.com",
                "fullname": "three",
                "avatar": "http://res.cloudinary.com/barmanji/image/upload/v1769110865/gjqwwa8ls4onv39xqk4n.png",
                "coverImage": "http://res.cloudinary.com/barmanji/image/upload/v1769110867/ik2k4whlkdjiy0fbtdz1.png",
                "watchHistory": [],
                "createdAt": "2026-01-22T19:41:08.298Z",
                "updatedAt": "2026-01-22T19:41:08.298Z",
                "__v": 0
            },
            message: "User Registered succesfully"
        }
    }
*/
    upload.fields([
        //injecting middleware
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
); //confusing Syntax, ====READ ABOUT IT====

router.route("/login").post(
    /* #swagger.tags = ['User']
       #swagger.summary = 'User Login'
       #swagger.description = 'Authenticate user and return access/refresh tokens.'

       #swagger.parameters['body'] = {
            in: 'body',
            description: 'User credentials',
            required: true,
            schema: {
                $username: 'doejohn',
                $password: 'test@123'
            }
       }

       #swagger.responses[200] = {
            description: 'User logged in successfully',
            schema: {
                success: true,
                statusCode: 200,
                data:  {
                    "user": {
                        "_id": "XYZ123",
                        "username": "one",
                        "email": "one@gmail.com",
                        "fullname": "one",
                        "avatar": "http://res.cloudinary.com/barmanji/image/upload/one.png",
                        "coverImage": "http://res.cloudinary.com/barmanji/image/upload/one1.png",
                        "watchHistory": [],
                        "createdAt": "2026-01-22T16:42:24.426Z",
                        "updatedAt": "2026-01-22T19:37:43.177Z",
                        "__v": 0
                    },
                    "accessToken": "one123",
                    "refreshToken": "one2345"
                },
                message: "User logged in succesfully"
            }
       }
       #swagger.responses[401] = { description: 'Invalid user credentials' }
    */
    loginUser
);

//secured routes
router.route("/logout").post(
    verifyJWT,
    /* #swagger.tags = ['User']
    #swagger.summary = 'User Logout'
    #swagger.description = 'Logout user and invalidate refresh token.'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = { description: 'User logged out successfully' }
    #swagger.responses[500] = { description: 'Internal Server Error' }
  */
    logoutUser
);
router.route("/refreshToken").post(
    /* #swagger.tags = ['User']
    #swagger.summary = 'Refresh Access Token'
    #swagger.description = 'Refresh access token using refresh token.'
    #swagger.responses[200] = {
          description: 'Access token refreshed successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {
                  accessToken: 'new-access-token',
                  refreshToken: 'new-refresh-token'
              },
              message: 'Access token refreshed successfully'
          }
    }
    #swagger.responses[401] = { description: 'Unauthorized' }
  */
    refreshAccessToken
);
router.route("/current-user").get(
    verifyJWT,
    /* #swagger.tags = ['User']
    #swagger.summary = 'Get Current User'
    #swagger.description = 'Get the currently logged in user.'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
          description: 'Current user fetched successfully',
          schema: {
              success: true,
              statusCode: 200,
              data: {
                  user: {
                      "_id": "69727d547c86ed0f1e5c8ecd",
                      "username": "three",
                      "email": "three@three.com",
                      "fullname": "three",
                      "avatar": "http://res.cloudinary.com/barmanji/image/upload/v1769110865/gjqwwa8ls4onv39xqk4n.png",
                      "coverImage": "http://res.cloudinary.com/barmanji/image/upload/v1769110867/ik2k4whlkdjiy0fbtdz1.png",
                      "watchHistory": [],
                      "createdAt": "2026-01-22T19:41:08.298Z",
                      "updatedAt": "2026-01-22T19:41:08.298Z",
                      "__v": 0
                  }
              },
              message: 'Current user fetched successfully'
          }
    }
    #swagger.responses[401] = { description: 'Unauthorized' }
  */
    getCurrentUser
);
router.route("/change-password").post(
    verifyJWT,
    /* #swagger.tags = ['User']
    #swagger.summary = 'Change Password'
    #swagger.description = 'Change the current password of the logged in user.'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
          in: 'body',
          description: 'Old and new passwords',
          required: true,
          schema: {
              $oldPassword: 'old-password',
              $newPassword: 'new-password'
          }
    }
    #swagger.responses[200] = { description: 'Password changed successfully' }
    #swagger.responses[400] = { description: 'Invalid old password' }
    #swagger.responses[401] = { description: 'Unauthorized' }
  */
    changeCurrentPassword
);
router.route("/update-account").patch(
    verifyJWT,
    /* #swagger.tags = ['User']
    #swagger.summary = 'Update account details'
    #swagger.description = 'Update fullname and email of the logged in user'
    #swagger.security = [{"bearerAuth": []}]
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User details to update.',
        required: true,
        schema: {
            $fullname: 'John Doe Updated',
            $email: 'john.doe.updated@example.com'
        }
    }
    #swagger.responses[200] = {
        description: 'User details updated successfully.',
        schema: {
            success: true,
            statusCode: 200,
            data: {
                user: {
                    "_id": "69727d547c86ed0f1e5c8ecd",
                    "username": "three",
                    "email": "three@three.com",
                    "fullname": "three",
                    "avatar": "http://res.cloudinary.com/barmanji/image/upload/v1769110865/gjqwwa8ls4onv39xqk4n.png",
                    "coverImage": "http://res.cloudinary.com/barmanji/image/upload/v1769110867/ik2k4whlkdjiy0fbtdz1.png",
                    "watchHistory": [],
                    "createdAt": "2026-01-22T19:41:08.298Z",
                    "updatedAt": "2026-01-22T19:41:08.298Z",
                    "__v": 0
                }
            },
            message: 'Account details updated successfully'
        }
    }
    #swagger.responses[400] = { description: 'Invalid data provided.' }
    #swagger.responses[401] = { description: 'Unauthorized.' } */
    updateAccountDetails
);
router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    /* #swagger.tags = ['User']
      #swagger.summary = 'Update user avatar'
      #swagger.description = 'Update avatar of the logged in user'
      #swagger.security = [{"bearerAuth": []}]
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['avatar'] = {
          in: 'formData',
          type: 'file',
          required: true,
          description: 'New avatar image'
      }
      #swagger.responses[200] = {
          description: 'Avatar updated successfully.',
          schema: {
              success: true,
              statusCode: 200,
              data: {
                  "user": {
                      "_id": "69727d547c86ed0f1e5c8ecd",
                      "avatar": "http://res.cloudinary.com/barmanji/image/upload/v1769110865/gjqwwa8ls4onv39xqk4n.png"
                  }
              },
              message: 'Avatar image updated successfully'
          }
      }
      #swagger.responses[400] = { description: 'Invalid data provided.' }
      #swagger.responses[401] = { description: 'Unauthorized.' }
    */
    updateUserAvatar
);
router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    /* #swagger.tags = ['User']
      #swagger.summary = 'Update user cover image'
      #swagger.description = 'Update cover image of the logged in user'
      #swagger.security = [{"bearerAuth": []}]
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['coverImage'] = {
          in: 'formData',
          type: 'file',
          required: true,
          description: 'New cover image'
      }
      #swagger.responses[200] = {
          description: 'Cover image updated successfully.',
          schema: {
              success: true,
              statusCode: 200,
              data: {
                  "user": {
                      "_id": "69727d547c86ed0f1e5c8ecd",
                      "coverImage": "http://res.cloudinary.com/barmanji/image/upload/v1769110867/ik2k4whlkdjiy0fbtdz1.png"
                  }
              },
              message: 'Cover image updated successfully'
          }
      }
      #swagger.responses[400] = { description: 'Invalid data provided.' }
      #swagger.responses[401] = { description: 'Unauthorized.' }
    */
    updateUserCoverImage
);
router.route("/c/:username").get(
    verifyJWT,
    /* #swagger.tags = ['User']
    #swagger.summary = 'Get user channel profile'
    #swagger.description = 'Get channel profile of a user by username'
    #swagger.security = [{"bearerAuth": []}]
    #swagger.parameters['username'] = {
        in: 'path',
        description: 'Username of the user',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'User channel profile fetched successfully.',
        schema: {
            success: true,
            statusCode: 200,
            data: {
                "_id": "69727d547c86ed0f1e5c8ecd",
                "username": "three",
                "fullname": "three",
                "avatar": "http://res.cloudinary.com/barmanji/image/upload/v1769110865/gjqwwa8ls4onv39xqk4n.png",
                "coverImage": "http://res.cloudinary.com/barmanji/image/upload/v1769110867/ik2k4whlkdjiy0fbtdz1.png",
                "subscribersCount": 0,
                "channelsSubscribedToCount": 0,
                "isSubscribed": false
            },
            message: 'User channel profile fetched successfully'
        }
    }
    #swagger.responses[404] = { description: 'User not found.' }
    #swagger.responses[401] = { description: 'Unauthorized.' }
  */
    getUserChannelProfile
);
router.route("/watch-history").get(
    verifyJWT,
    /*  #swagger.tags = ['User']
    #swagger.summary = "Get user's watch history"
    #swagger.description = "Get the watch history of the logged in user"
    #swagger.security = [{"bearerAuth": []}]
    #swagger.responses[200] = {
        description: 'Watch history fetched successfully.',
        schema: {
            success: true,
            statusCode: 200,
            data: [
                {
                    "_id": "video_id_1",
                    "thumbnail": "http://res.cloudinary.com/barmanji/image/upload/v1769110865/video_thumbnail.png",
                    "title": "Video Title",
                    "duration": 120,
                    "views": 1000,
                    "owner": {
                        "username": "video_owner",
                        "avatar": "http://res.cloudinary.com/barmanji/image/upload/v1769110865/owner_avatar.png"
                    }
                }
            ],
            message: 'Watch history fetched successfully'
        }
    }
    #swagger.responses[401] = { description: 'Unauthorized.' }
  */
    getWatchHistory
);

router.route("/seed").post(
    /*  #swagger.tags = ['User']
    #swagger.summary = "Seed"
    #swagger.description = 'Seed the database with dummy users.'
  */
    seedUsers,
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Users seeded successfully",
        });
    }
);

router.route("/seed-credentials").get(
    /*  #swagger.tags = ['User']
      #swagger.summary = 'Get generated credentials'
      #swagger.description = 'Get the credentials of the seeded users.'
    */
    getGeneratedCredentials
);

export default router;
