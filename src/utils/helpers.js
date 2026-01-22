import fs from "fs";

/**
 *
 * @param {number} limit
 * @returns {number}
 */
const getRandomNumber = (limit) => {
    return Math.floor(Math.random() * limit);
};

/**
 *
 * @param {string} localPath
 */
const removeLocalFile = (localPath) => {
    fs.unlink(localPath, (err) => {
        if (err) console.log("Error while removing local file");
    });
};

export { getRandomNumber, removeLocalFile };
