import {isValidObjectId} from "mongoose"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { deleteFromCloudinary, uploadResultCloudinary } from "../utils/FileUploadCloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const home = await Video.aggregate([
        {
            $match: {
                $or: [ //matches from title and desc. Document 1 ("Funny Video")
                    //  { "title": "Funny Video", "description": "A very fun video" },
                    //   { "title": "Workouts", "description": "Stay fit and healthy" } It will not match Document 3 because neither the title nor the description contains "fun".
                    {
                        title: { $regex: query, $options: "i" }, //With $regex:Matches partial strings or patterns. Case-insensitive if $options: "i" is specified.
                        //Example: Searching for "fun" will match "funny", "FUNNY", "superfun", etc.
                    },
                    {
                        description: { $regex: query, $options: "i" },
                    },
                ],
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "createdBy"
            }
        },
        {
            $unwind: "$createdBy",
        },
        {
            $project: {
                thumbnail: 1,
                videoFile: 1,
                title: 1,
                description: 1,
                createdBy: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                },
            },
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, home, "Fetched All Videos"));

});
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if ([title, description].some((field)=>!field.trim())){
        throw new ApiError(400, "Title and Description cannot be empty")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path; //technically req.files returns array
    if(!videoLocalPath){
        throw new ApiError(400, "Video is necessary")
    }
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if(!thumbnailLocalPath){
        throw new ApiError(404, "Thumbnail not found")
    }

    const videoUpload = await uploadResultCloudinary(videoLocalPath);
    if(!videoUpload?.url){
        throw new ApiError(404, "There is an issue with uploading video")
    }
    const thumbnailUpload = await uploadResultCloudinary(thumbnailLocalPath);
    if(!thumbnailUpload?.url){
        throw new ApiError(404, "Thumbnail hasn't uploaded, there is some error with cloudinary")
    }
//const duration = videoUpload.duration

    const video = await Video.create({
        title: title,
        duration: videoUpload.duration,
        description: description,
        videoFile: videoUpload?.url,
        thumbnail: thumbnailUpload?.url,
        owner: req.user._id,
    })
    if (!video) {
        throw new ApiError(500, "Error occurred while saving the video to the database");
    }

    return res.status(201)
    .json(new ApiResponse(200, video, "Video uploaded succesfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(req.params.videoId);
    if (!video){
        throw new ApiError(400, "Video cant be found")
    }
    //if (video.owner.toString() !== req.user._id.toString()) {
    //    throw new ApiError(403, "You are not allowed to update this video");
    //}
    const getVideoById = await Video.findById(videoId)
    res.status(200)
    .json(new ApiResponse(200, {getVideoById}, "Here's the required video"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {newTitle, newDescription} = req.body;
    if([newTitle, newDescription].some(fields => !fields.trim())){
        throw new ApiError(400, "New description and title cant be empty")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(req.params.videoId);
    if (!video){
        throw new ApiError(400, "Video cant be found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }
    const oldThumbnail = video.thumbnail; //try to delete thumbnail afterwards because what if user didnt upload thumbnail
    if(!oldThumbnail){
        throw new ApiError(400, "oldThumbnail cant be found")
    }
    oldThumbnail && (await deleteFromCloudinary(oldThumbnail))

    const thumbnailLocalPath = req.file.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(404, "Thumbnail not found");
    }
    const thumbnailUpload = await uploadResultCloudinary(thumbnailLocalPath);
    if(!thumbnailUpload?.url){
        throw new ApiError(404, "Thumbnail hasn't uploaded, there is some error with cloudinary")
    }
    const updateVideoFields = await Video.findByIdAndUpdate(
        req.params.videoId, {
            $set: {
                thumbnail: thumbnailUpload.url,
                title: newTitle, //if user hasnt given any value then default original title will be set, same for desc.
                description: newDescription
            }
        }, {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200, updateVideoFields, "Video updated succesfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(req.params.videoId);
    if (!video){
        throw new ApiError(400, "Video cant be found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }


    await deleteFromCloudinary(video.videoFile)
    await deleteFromCloudinary(video.thumbnail)
    await Video.findByIdAndDelete(videoId);
    res.status(200)
        .json(new ApiResponse(200, {}, "Video is deleted succesfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(req.params.videoId);
    if (!video){
        throw new ApiError(400, "Video cant be found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }
    const modifyVideoPublishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished,
            },
        },
        { new: true }
    );
    res.status(200)
        .json(new ApiResponse(200, modifyVideoPublishStatus, "video"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
