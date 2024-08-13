import { Avatar, Button, Typography } from 'antd'
import React, { cloneElement } from 'react'
import styled from 'styled-components'
import { auth, db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../../Context/AuthProvider';
import { LogoutOutlined } from '@ant-design/icons';

const WrapperStyle = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid;
    /* color: black; */

    .username {
        color: black;
        margin-left: 5px
    }
`;
export default function UserInfo() {
    // React.useEffect(() => {
    //     const usersRef = collection(db, 'users');

    //     const unsubscribe = onSnapshot(usersRef, (snapshot) => {
    //         const data = snapshot.docs.map(doc => ({
    //             ...doc.data(),
    //             id: doc.id
    //         }));
    //         console.log(data); // Handle or store the data as needed
    //     });

    //     return () => unsubscribe();
    // }, []);

    const { photoURL, displayName } = React.useContext(AuthContext);

    return (
        <WrapperStyle>
            <div>
                <Avatar src={photoURL}>{photoURL ? '' : displayName[0]}</Avatar>
                <Typography.Text className='username'>{displayName}</Typography.Text>
            </div>
            <Button ghost onClick={() => auth.signOut()} icon={<LogoutOutlined />}>Đăng xuất</Button>
        </WrapperStyle>
    );
}
