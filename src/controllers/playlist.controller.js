import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    if([name, description].some(field => !field.trim())){
        throw new ApiError(400, "Name and description are required")
    }
    const sameNamesNotAllowedForSinglePerson = await Playlist.findOne({
        $and: [{
            name: { $regex: `^${req.body.name}$`, $options: "i" } //This ensures an exact match of the playlist name, not just partial matches.
        },//^: Ensures the match starts at the beginning of the string. ${req.body.name}: Dynamically inserts the playlist name provided by the user.
            //$: Ensures the match ends at the end of the string.
            {
                owner: req.user._id
            }] //option i is for insensitive case
    });
    if(sameNamesNotAllowedForSinglePerson){
        throw new ApiError(401, "Same named playlist are now allowed")
    }
    const playlist = await Playlist.create({
        name: name,
        description: description,
        owner: req.user?._id // i Want each playlist to have its own owner
    })
    if(!playlist){
        throw new ApiError(404,"playlist is not found")
    }
    return res.status(200)
        .json(new ApiResponse(200, {sameNamesNotAllowedForSinglePerson, playlist}, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const userPlaylists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            description: 1,
                            owner: 1,
                        },
                    },
                ],
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
                            avatar: 1,
                            fullName: 1,
                            username: 1,
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
            $project: {
                videos: 1,
                createdBy: 1,
                name: 1,
                description: 1,
            },
        },
    ]);
    if (userPlaylists.length === 0) {
        throw new ApiError(504, "No Playlists found");
    }

  return res
    .status(200)
    .json(new ApiResponse(200, userPlaylists, "Playlists Fetched"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
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
                            fullName: 1,
                            username: 1,
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
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                    {
                        $project: {
                            thumbnail: 1,
                            title: 1,
                            duration: 1,
                            views: 1,
                            owner: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                videos: 1,
                description: 1,
                name: 1,
                createdBy: 1,
            },
        },
    ]);

  if (!playlist) {
    throw new ApiError(500, "Error fetching playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Fetched"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    if([playlistId, videoId].some(field => !field.trim())){
        throw new ApiError(400, "Playlist and Video are must")
    }
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Playlist or Video ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "No Playlist found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }
    const videoExists = playlist.video.filter(
        (video) => video.toString() === videoId
    );
    if (videoExists.length > 0) {
        throw new ApiError(400, "Video already in the Playlist");
    }

    const videoAdd = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet : {
                video: videoId
            }
        },
        {new: true}
    )
    return res.status(200)
        .json(new ApiResponse(200,  videoAdd, "Video is successfully added"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    if([playlistId, videoId].some(field => !field.trim())){
        throw new ApiError(400, "Playlist and Video are must")
    }
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Playlist or Video ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "No Playlist found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }
    const videoExists = playlist.video.filter(
        (video) => video.toString() === videoId
    );
    if (videoExists.length < 0) {
        throw new ApiError(400, "Video doesn't exist in playlist");
    }

    await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { video: videoId } }, // pull deletes the videoId in video (all occurence) Example: If playlist.video contains [vid1, vid2, vid3] and videoId = vid2, $pull will update it to [vid1, vid3].
        { new: true } // Return the updated document
    );

    return res.status(200)
    .json(new ApiResponse(200, {}, "video has been deleted successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(404, "plalist is invalid")
    }
    const playlist = await Playlist.findById(playlistId)
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }
    await Playlist.findByIdAndDelete(playlistId)
    return res.status(200)
    .json(new ApiResponse(200, null, "playlist is successfully deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400, "playlist is invalid")
    }
    //if([name, description].some(field => !field.trim())){
    //    throw new ApiError(400, "Name and description are required")
    //}
    const playlist = await Playlist.findById(playlistId)
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    const oldName = playlist.name;
    const oldDescription = playlist.description;
    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: name || oldName,
                description: description || oldDescription
            }
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200, updatePlaylist, "Playlist is updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
