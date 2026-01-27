# Backend Video Streaming Project - [Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)


## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)
- [Liscensing](#liscense)

## Overview
This project is a backend system for a YouTube-like application that supports user registration, login, and logout functionalities. As development progresses, more features like video uploading, comments, likes, and subscriptions are being added.

## Features

### User Management:

- Registration, login, logout, change password
- Profile management (avatar, cover image, other details)
- Watch history tracking and Clearing Watch History
- Liked videos tracking

### Seeding:

- Seed Random Users with Dummy information
- Get Seeded Informaiton of the Pre-seeded users.
- Seed user with @faker-js.

### Video Management:

- Video upload
- Canceling Video upload with all resources cleaned up on backend.
- Visibility control (publish/un-publish)
- Video editing and deletion
- Video Search and pagination

### Tweet Management:

- Tweet creation and publishing
- Viewing user tweets
- Updating and deleting tweets
- Liking-disliking tweets

### Subscription Management:

- Subscribing to channels
- Viewing Channel subscriber
- Viewing Subscribed channel lists

### Playlist Management:

- Creating, updating, and deleting playlists
- Adding videos to playlists
- Removing videos from playlists and undoing them
- Viewing user playlists

### Like Management:

- Liking and Un-liking videos, comments, and tweets
- Viewing liked videos

### Comment Management:

- Adding, updating, and deleting comments on videos

### Dashboard:

- Viewing channel statistics (views, subscribers, videos, likes)
- Accessing uploaded videos and Controls
- Viewing Video statistics (PublishStatus, VideoName, DateUploaded, Views, TotalComments, LikeRatings)

### Health Check:

- Endpoint to verify the server's health

## Technologies Used
- **Backend Framework:** Node.js with Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Message Broker (for future features):** RabbitMQ
- **File Storage:** (e.g., cloudinary, local storage, etc.)
- **Containerization:** (for future features) Docker (for RabbitMQ and other services)

## Installation

### Method 1: Docker-compose.yml

1. **Clone the repository** then do:
    ```bash
    docker compose up -d
    ```

### Method 2: Manual

1. **Clone the repository:**
    ```bash
    git clone git@github.com:Barmanji/Youtube-and-Twitter-Compelete-Backend.git
    cd Youtube-and-Twitter-Compelete-Backend
    ```

2. **Install dependencies:**
    ```bash
    pnpm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root of your project and add the following OR Change `.env.example` -> `.env`
    ```bash
    PORT=8000
    ORIGIN_KEY_CORS=*
    MONGODB_URI=MAKE_IT_YOUR_OWN_ALSO_DONT_AND_I_MEAN_IT_DONT_PUT_@_IN_PASS_SPECIALLY_IN_THE_END
    ACCESS_TOKEN_SECERET = Your ACCESS_TOKEN_SECERET
    ACCESS_TOKEN_EXPIRY = Your ACCESS_TOKEN_EXPIRY
    REFRESH_TOKEN_SECERET = Your REFRESH_TOKEN_SECERET
    REFRESH_TOKEN_EXPIRY = Your REFRESH_TOKEN_EXPIRY //use numbers like 10d === 10days
    CLOUDNARY_APISECRET = Your_Api_Seceret-from-Cloudinary
    CLOUDNARY_APIKEY = Your_Api_Key-from-Cloudinary
    CLOUDNARY_CLOUDNAME = Your-Cloud-name
    ```

4. **Start the server:**
    ```bash
    pnpm run dev
    ```

## Running the Project

Once you have completed the setup, you can run the project using:
```bash
pnpm start
```
This will start the server, and the application will be available on `http://localhost:8000`.

## [API Endpoints](https://app.getpostman.com/join-team?invite_code=7eb59cbca1b4223055e577eaeb6a09078fadf3e5d2d0adadf9745a25c5e7bf37)

### User
| Method | Endpoint                       | Description                                  | Protected |
|--------|--------------------------------|----------------------------------------------|-----------|
| POST   | `/api/v1/user/register`        | Register a new user                          | No        |
| POST   | `/api/v1/user/login`           | Login and get token                          | No        |
| POST   | `/api/v1/user/logout`          | Logout user                                  | Yes       |
| GET    | `/api/v1/user/refresh-token`   | EndPoint to Refresh all Tokens               | Yes       |
| POST   | `/api/v1/user/change-password` | Change password from old to new              | Yes       |
| GET    | `/api/v1/user/current-user`    | Give login user details                      | Yes       |
| PATCH  | `/api/v1/user/update-account`  | Update user fullname and email               | Yes       |
| PATCH  | `/api/v1/user/avatar`          | Change Avatar of the Login user              | Yes       |
| PATCH  | `/api/v1/user/cover-image`     | Change Cover Image of the Login user         | Yes       |
| GET    | `/api/v1/user/c/:username`     | Give channel details like subcribers and all | Yes       |
| GET    | `/api/v1/user/history`         | Give watchHistory of login user              | Yes       |

### dashboard
| Method | Endpoint                          | Description                       | Protected |
|--------|-----------------------------------|-----------------------------------|-----------|
| POST   |`/api/v1/user/seed`                | Seed the database with dummy users.    | No       |
| GET    |`/api/v1/user/seed-credentials`    | Get the credentials of the seeded users.      | No       |

### Videos
| Method | Endpoint                    | Description                       | Protected |
|--------|-----------------------------|-----------------------------------|-----------|
| POST   | `/api/v1/videos/`           | Upload a video                    | Yes       |
| GET    | `/api/v1/videos/`           | Get videos by search              | Yes       |
| GET    | `/api/v1/videos/:videoId`   | Get a specific video by its ID    | Yes       |
| DELETE | `/api/v1/videos/:videoId`   | Delete a video by its ID          | Yes       |
| PATCH  | `/api/v1/videos/:videoId`   | Update video details              | Yes       |
| PATCH  | `/api/v1/videos/toggle/publish:videoId`   | Toggle publish status              | Yes       |

### Comments
| Method | Endpoint                       | Description                       | Protected |
|--------|--------------------------------|-----------------------------------|-----------|
| POST   | `/api/v1/comments/:videoId`    | Post a comment on a video         | Yes       |
| GET    | `/api/v1/comments/:videoId`    | Get comments for a specific video | Yes       |
| DELETE | `/api/v1/comments/c/:commentId`| Delete comments through Id        | Yes       |
| PATCH  | `/api/v1/comments/c/:commentId`| Update comment through Id         | Yes       |

### like
| Method | Endpoint                          | Description                       | Protected |
|--------|-----------------------------------|-----------------------------------|-----------|
| POST   |`/api/v1/likes/toggle/v/:videoId`  | toggle like of video              | Yes       |
| POST   |`/api/v1/likes/toggle/c/:commentId`| toggle like of comment            | Yes       |
| POST   |`/api/v1/likes/toggle/t/:tweetId`  | toggle like of tweet              | Yes       |
| GET    |`/api/v1/likes/videos`             | Get all the Likes of video        | Yes       |

### Tweet(This is similar to community tab)
| Method | Endpoint                          | Description                       | Protected |
|--------|-----------------------------------|-----------------------------------|-----------|
| POST   |`/api/v1/tweets/`                  | Create tweet                      | Yes       |
| GET    |`/api/v1/tweets/user/:userId`      | Get User tweet                    | Yes       |
| PATCH  |`/api/v1/tweets/:tweetId`          | update tweet                      | Yes       |
| DELETE |`/api/v1/tweets/:tweetId`          | delete the Tweet                  | Yes       |

### playlistRouter
| Method | Endpoint                               | Description                       | Protected |
|--------|----------------------------------------|-----------------------------------|-----------|
| POST   |`/api/v1/playlist/`                     | Create Playlist                   | Yes       |
| GET    |`/api/v1/playlist/:playlistId`          | Get Playlist By Id                | Yes       |
| PATCH  |`/api/v1/playlist/:playlistId`          | Update Playlist                   | Yes       |
| DELETE |`/api/v1/playlist/:playlistId`          | delete the Playlist               | Yes       |
| PATCH  |`/api/v1/playlist/add/:videoId/:playlistId`          | Add video to playlist Playlist                   | Yes       |
| PATCH  |`/api/v1/playlist/remove/:videoId/:playlistId`          | Remove video to playlist                   | Yes       |
| GET  |`/api/v1/playlist/user/:userId`          | Get  Playlist of a user                   | Yes       |

### dashboard
| Method | Endpoint                          | Description                       | Protected |
|--------|-----------------------------------|-----------------------------------|-----------|
| GET    |`/api/v1/dashboard/stats`          | Get channel details               | Yes       |
| GET    |`/api/v1/dashboard/videos`         | Get Video upload by channel       | Yes       |

### Subscriptions
| Method | Endpoint                          | Description                       | Protected |
|--------|-----------------------------------|-----------------------------------|-----------|
| POST   |`/api/v1/subscriptions/c/:channelId`| Toggle Subscription to channel                      | Yes       |
| GET    |`/api/v1/subscriptions/c/:channelId`| Got Subsbcriber list of channel | Yes       |
| GET    |`/api/v1/subscriptions/u/:subscriberId` | subscriber list of a User channel                      | Yes       |

### HealthCheck
| Method | Endpoint                          | Description                       | Protected |
|--------|-----------------------------------|-----------------------------------|-----------|
| GET    |`/api/v1/healthcheck`              | Get Health Status                 | Yes       |

## Future Improvements
- **Video Recommendations:** Recommend videos based on user preferences.
- **Analytics:** Track views and other engagement metrics.
- **Notifications:** Real-time notifications for new comments, likes, and subscriptions.
- **Microservices Architecture:** Plan to scale the application by breaking features into microservices.
- **CI/CD:** Set up automated testing and deployment pipelines.

### Liscense
Project is Liscensed under [ChaiAurCode](https://www.youtube.com/@chaiaurcode)
