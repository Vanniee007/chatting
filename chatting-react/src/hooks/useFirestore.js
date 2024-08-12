import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const useFirestore = (collectionName, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        let collectionRef = collection(db, collectionName);
        let q = query(collectionRef, orderBy('createdAt'));

        if (condition) {
            if (condition.compareValue && condition.compareValue.length) {
                q = query(collectionRef,
                    where(condition.fieldName, condition.operator, condition.compareValue)
                );
            } else {
                return;
            }
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setDocuments(data);
        });

        return () => unsubscribe();
    }, [collectionName, condition]);

    return documents;
};

export default useFirestore;
