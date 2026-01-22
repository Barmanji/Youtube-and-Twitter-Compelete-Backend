import { faker } from "@faker-js/faker";
import fs from "fs";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRandomNumber, removeLocalFile } from "../utils/helpers.js";
import { USERS_COUNT } from "./_constants.js";

// Array of fake users
const users = Array.from({ length: USERS_COUNT }, () => ({
    // In Faker v8+, these are the correct methods:
    avatar: faker.image.avatar(), // internet.avatar still works, but image.avatar is preferred
    coverImage: faker.image.url(),
    username: faker.internet.username(),
    email: faker.internet.exampleEmail(), // exampleEmail avoids sending spam to real domains
    password: faker.internet.password({ length: 12 }), // New syntax for password options
    fullname: faker.person.fullName(),
}));

/**
 * @description Seeding middleware for users api which other api services can use which are dependent on users
 */
const seedUsers = asyncHandler(async (req, res, next) => {
    const userCount = await User.countDocuments();
    if (userCount >= USERS_COUNT) {
        // Don't re-generate the users if we already have them in the database
        console.log("Users are already seeded.");
        next();
        return;
    }
    await User.deleteMany({}); // delete all the existing users from previous seedings

    // remove cred json
    removeLocalFile("./public/temp/seed-credentials.json"); // remove old credentials

    const credentials = [];

    // create Promise array
    const userCreationPromise = users.map(async (user) => {
        credentials.push({
            username: user.username.toLowerCase(),
            password: user.password,
        });
        await User.create(user);
    });

    // pass promises array to the Promise.all method
    await Promise.all(userCreationPromise);

    console.log("Users seeded successfully.");

    // Once users are created dump the credentials to the json file
    const json = JSON.stringify(credentials);

    fs.writeFileSync(
        "./public/temp/seed-credentials.json",
        json,
        "utf8",
        (err) => {
            if (err) {
                console.error("Error while writing the credentials", err);
            }
        }
    );

    // proceed with the request
    next();
});

/**
 * @description This api gives the saved credentials generated while seeding.
 */
const getGeneratedCredentials = asyncHandler(async (req, res) => {
    try {
        const json = fs.readFileSync(
            "./public/temp/seed-credentials.json",
            "utf8"
        );
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    JSON.parse(json),
                    "Dummy credentials fetched successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            404,
            "No credentials generated yet. Make sure you have seeded the data first."
        );
    }
});

export { getGeneratedCredentials, seedUsers };
