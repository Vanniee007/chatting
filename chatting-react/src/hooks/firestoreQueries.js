import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function fetchUserList(search) {
    const usersRef = collection(db, 'users');
    const q = query(
        usersRef, 
        where('displayName', '>=', search), 
        where('displayName', '<=', search + '\uf8ff'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        label: doc.data().displayName,
        value: doc.id,
        photoURL: doc.data().photoURL,
    }));
}