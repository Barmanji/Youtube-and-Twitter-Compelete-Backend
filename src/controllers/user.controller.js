import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadResultCloudinary, deleteFromCloudinary } from "../utils/FileUploadCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//--------------------------- Generally a good idea to make a method for----------------------------//
//                            accesstoken and refresh, becusae we have to
//                            use to alot

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
const registerUser = asyncHandler(async(req, res) => {
    //S.1: get data from forntend-
    //S.2: Encrypt Decrypt pass with hasings ( considering the fact that we have validated all the form input values in frontend)
    //S.3: Save in database so that if user will login in future it will help. THATS it.
    //------------------------------------------------------------------- RIGHT ONEs -------------------------------------------------
     // get user details from frontend [x]
    // validation - not empty[x]
    // check if user already exists: username, email[x]
    // check for images, check for avatar[x]
    // upload them to cloudinary, avatar[x]
    // create user object - create entry in db[x]
    // remove password and refresh token field from response[x]
    // check for user creation[]
    // return re[]
    const {username, email, fullname, password} = req.body;
    //console.log("req.body: ", req.body)
    if([username, email, fullname, password].some((field)=> field?.trim() === "")) {
        //read about some, advance JS code
        throw new ApiError(400,"all fields are compulsory")  //i am writing all the apierror according to the class ApiError that i made insite UTILS
    }
    /*
    User we make by mongoose, we make make dis to help aus , and yes i am writing this in my full consiousness
    that we can use and apply many things to it, like findOne which helps to find a field or target read in mongooooooooose
    ========================== ASSIGNMNET = Console.log everything, FIGURE IT OUT! ==========================================
    */
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    });

    if (existedUser) { // retuns true then;
        throw new ApiError(409, "User with this email already exists")
    };

    const avatarLocalPath = req.files?.avatar[0]?.path;

    //const coverImageLocalPath = req.files?.coverImage[0]?.path; //[0] is for first property
       let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is necessary")
    }
    const avatarUpload = await uploadResultCloudinary(avatarLocalPath);
    const coverImageUpload = await uploadResultCloudinary(coverImageLocalPath);
    if (!avatarUpload) {
        throw new ApiError(400, "Avatar image is very necessary")
    }

    //console.log("req.files: ",req.files)

    const user = await User.create({
        fullname,
        avatar: avatarUpload.url,
        coverImage: coverImageUpload?.url,
        email,
        password,
        username: username.toLowerCase()
    })
//READ ABOUT USER.findbyid, by ._id
    const createdUser = await User.findById(user._id).select("-password -refreshToken")  //- sign means discard it " " means
    if (!createdUser) throw new ApiError(500, "Error with registering user, We are trying to fix it!")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered succesfully")
    )}
)
//
//After register -
//{
//    "statusCode": 200,
//    "data": {
//        "_id": "6788f10f0e3aa9e484fccf7f",
//        "username": "four",
//        "email": "four@gmail.com",
//        "fullname": "four",
//        "avatar": "http://res.cloudinary.com/barmanji/image/upload/v1737027848/ekw6mcj2zrixhkgqb8i1.png",
//        "coverImage": "",
//        "watchHistory": [],
//        "createdAt": "2025-01-16T11:44:15.839Z",
//        "updatedAt": "2025-01-16T11:44:15.839Z",
//        "__v": 0
//    },
//    "message": "User Registered succesfully",
//    "success": true
//}
//------------------------------ LOGIN USER --------------------------------//
// req body -> data
// username or email
//find the user
//password check
//access and referesh token
//send cookie
const loginUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body;
    if(!username && !email) {
        throw new ApiError(400, "Atleast one of the field is required -> Email or Username")
    }

    //User.findOne({email}) --> this is valid as wellfor email only or for username just change it to username
    const findUser = await User.findOne({
        $or: [{email}, {username}] //better syntax
    })

    if(!findUser) {
        throw new ApiError(404, "This user doesn't exist with this email or username");
    }

    const passwordValidity = await findUser.isPasswordCorrect(password)
        if(!passwordValidity) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {refreshToken, accessToken} = await generateAccessAndRefreshTokens(findUser._id)
    const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken") //little optional
    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, {
                findUser: loggedInUser, accessToken, refreshToken
            }, "User logged in succesfully")
        )
})

//-------------------------------- LOGOUT USER --------------------------------------//
//Assignment-
//s1: check if user is login or not only then we can logout, i.e. check if loginUser returns 200 code.
//s2: clear cookies and refresh tokens from user model
const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {refreshToken: 1} //this removes the field of the doc
        },
        {
            new: true
        }
    );

    const option = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
    .clearCookie("accessToken", option) //method by cookieparser to clear
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User Logged Out"))
});

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken  //.cookies for pc, .body for mobiles

    if(!incomingRefreshToken) {
        throw new ApiError(404, "Unauthorized request")
    }
    //now refresh the incoming ref.
    try {

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)

    if(!user) {
        throw new ApiError(400, "Fictitious Token")
    }

    if (incomingRefreshToken !== user?.refreshToken) { //i didnt understand this part - READ ABOUT IT LATER!
    throw new ApiError(401, "Refresh token is expired or used")
    }
    //why do we even use this
    const options = {
        httpOnly: true,
        secure: true
    }
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(200, {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                    "access token refreshed"
                )
            )} catch(error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})
//-------------- CHANGE PASS --------------------/
const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid Old password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res.status(200)
    .json(new ApiResponse(
            200, {}, "Password change successfully"
        ))
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    return res.status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {username, fullname} = req.body;
    if(!fullname || !username){
        throw new ApiError(400, "All fields are necessary")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname, //only fullname can be enf due to ES6 , READ about ES6
                email: email
            }
        },
        {new: true}).select("-password")

    return res.status(200)
    .json(new ApiResponse(200, user, "Account details added succesfully"))
})

const updateUserAvatar = asyncHandler(async(req, res)=>{
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const oldAvatar = req.user?.avatar;
    oldAvatar && (await deleteFromCloudinary(oldAvatar)); //not understood
    const avatarUpload = await uploadResultCloudinary(avatarLocalPath)

    if(!avatarUpload.url){
        throw new ApiError(400, "Error while uploading avatar")
    }
    const AvatarUpdate = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatarUpload.url,
        }
    },
        {new: true}).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, AvatarUpdate, "Avatar added succesfully")) //avatar.url is unnecrary and has been put by none other than BARMANJI
})
//DELETE THE OLD IMAGE! avatar- preferabaly delete it after uploading new one.

const updateUserCoverImage = asyncHandler(async(req, res)=>{
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover Image is missing")
    }

    const oldCoverImage = req.user?.coverImage;
    oldCoverImage && (await deleteFromCloudinary(oldCoverImage));
    const coverImage = await uploadResultCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading CoverImage")
    }

   const coverImageUpdate =  await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: coverImage.url,
        }
    },
        {new: true}).select("-password")

     return res.status(200)
    .json(new ApiResponse(200, coverImageUpdate, "CoverImage added succesfully")) //just return empty PAYLOAD
})

const getUserChannelProfile = asyncHandler(async(req, res)=>{
    const {username} = req.params;
    if(!username?.trim()){  //can be done as !username?.trim()
        throw new ApiError(400, "Username is not found");
    }

    //------------------- Aggrigation pipelines ------------------------//
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: { //looks from, localkey and foregn key are as said by the name
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: { //adds field
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: { //takes three param {if: then: else: } or [.. , .. , ..]/{ $cond: [ <boolean-expression>, <true-case>, <false-case> ] } withut if else bla blaC
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},//{ $in: [ <expression>, <array expression> ] }                         //{ $in: [ "abc", [ "xyz", "abc" ] ] } returns TRUE
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            //{ $project: { <specification(s)> } }
            $project: {
                fullname: 1, //1 means give info 0 means dont
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        },
    ])

    if(!channel?.length) {
        throw new ApiError(404, "channel doesnt exist")
    }
    console.log("channel: ", channel)
    console.log("req.params :", req.params);
    return res.status(200)
        .json(new ApiResponse(200, channel[0], "User channel fetched succesfully"))

})

const getWatchHistory = asyncHandler(async(req, res)=>{
//req.user._id returns a string not actuall ID
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id) //becuase req.user_id returns an string but we need obect ID SDE-2, dont do parseInd because we are inside an aggrigate pipeline in mongoose and it will not accept RAW ES6
                //objectId was comming as strikethrough so i added createFromHexString, remove if error!
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [  //nested pipelinnig
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fillname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                //read about first
                                $first: "$owner" //$owner here means we are taking data from field
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res.status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "Watch History fetched succesfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    generateAccessAndRefreshTokens,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}
