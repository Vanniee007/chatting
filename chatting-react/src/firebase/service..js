import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "./config"; // Make sure this is correctly exporting the initialized Firestore instance
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const addDocument = async (collectionName, data) => {
    try {
        await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(), // Correct usage of serverTimestamp
            updatedAt: serverTimestamp(), // Correct usage of serverTimestamp
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const updateDocument = async (collectionName, id, data) => {
    try {
        await updateDoc(doc(db, collectionName, id), {
            ...data,
            updatedAt: serverTimestamp(), // Correct usage of serverTimestamp
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<string>} - The download URL of the uploaded file.
 */
export const uploadFile = async (file) => {
    if (!file) {
        throw new Error("No file provided.");
    }

    try {
        // Create a storage reference
        const storageRef = ref(storage, `/files/${file.name}`);

        // Upload the file
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Wait for upload to complete
        await new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                null, // Optionally handle progress here
                (error) => {
                    reject(error);
                },
                () => {
                    resolve();
                }
            );
        });

        // Get the download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};



/**
 * Uploads an image file to Firebase Storage and updates the avatar URL in Firestore.
 * @param {File} file - The image file to be uploaded.
 * @param {string} id - The ID of the user or room whose avatar is being updated.
 * @param {'users' | 'rooms'} type - The type of the object being updated ('users' or 'rooms').
 * @returns {Promise<void>} - Resolves when the upload and update are complete.
 */
export const updateAvatar = async (file, id, type) => {
    if (!file) {
        throw new Error("No file provided.");
    }

    // Check if the file is an image
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error("Only image files are allowed.");
    }

    try {
        // Create a storage reference for the file
        const storageRef = ref(storage, `${type}/${id}/${file.name}`);

        // Upload the file
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Wait for upload to complete
        await new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                null, // Optionally handle progress here
                (error) => {
                    reject(error);
                },
                () => {
                    resolve();
                }
            );
        });

        // Get the download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Update the avatar URL in Firestore
        const docRef = doc(db, type, id); // 'type' could be 'users' or 'rooms'
        await updateDoc(docRef, { avatarURL: downloadURL });

        console.log("Avatar updated successfully. File URL:", downloadURL);
    } catch (error) {
        console.error("Error updating avatar:", error);
        throw error;
    }
};