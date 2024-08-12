import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./config"; // Make sure this is correctly exporting the initialized Firestore instance

export const addDocument = async (collectionName, data) => {
    try {
        await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(), // Correct usage of serverTimestamp
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};


