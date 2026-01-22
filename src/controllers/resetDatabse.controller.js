import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import fs from "fs";

const resetDatabase = asyncHandler(async (req, res) => {
  // Check if connection exists
  if (!mongoose.connection.db) {
    throw new ApiError(500, "Database connection not established");
  }

  try {
    // Option A: Attempt to drop the entire database
    await mongoose.connection.db.dropDatabase();
  } catch (error) {
    console.error(
      "Full drop failed, attempting collection cleanup:",
      error.message
    );

    // Option B: Fallback - Delete all documents in all collections
    // This works even if your Atlas user doesn't have 'dropDatabase' permissions
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }

  // Clean up the credentials file
  const credPath = "./public/temp/seed-credentials.json";
  if (fs.existsSync(credPath)) {
    fs.unlinkSync(credPath);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Database cleared successfully"));
});

export { resetDatabase };

