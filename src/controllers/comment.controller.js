import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    //const options = {
    //    page,
    //    limit,
    //};
    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                createdBy: {
                    $first: "$createdBy",
                },
            },
        },
        {
            $unwind: "$createdBy",
        },
        {
            $project: {
                content: 1,
                createdBy: 1,
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
        .json(new ApiResponse(200, comments, "Comments Fetched"));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "video is invalid");
    }
    if (!content) {
        throw new ApiError(404, "Comment required");
    }
    const video = await Video.findById(req.params.videoId);
    if (!video) {
        throw new ApiError(400, "Video is unavailable");
    }
    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user._id,
    });
    if (!comment) {
        throw new ApiError(400, "comment is failed to create itself");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { comment }, "Comment added succesfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if (
        [content, commentId].some((fields) => !fields.trim()) ||
        !isValidObjectId(commentId)
    ) {
        throw new ApiError(400, "comment is must");
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        throw new ApiError(400, "comment is not found");
    }
    if (!(comment.owner.toString() == req.user._id.toString())) {
        throw new ApiError(401, "unauthorized");
    }
    const updateComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content,
            },
        },
        { new: true }
    );
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { comment, updateComment },
                "comment has updated succesfully"
            )
        );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, "comment is invalid");
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        throw new ApiError(400, "comment is not found");
    }
    if (!(comment.owner.toString() == req.user._id.toString())) {
        throw new ApiError(401, "unauthorized");
    }
    await Comment.findByIdAndDelete(comment);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "comment has updated succesfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
