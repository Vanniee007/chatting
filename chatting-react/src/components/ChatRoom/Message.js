import { Avatar, Tooltip, Typography } from 'antd';
import { formatRelative } from 'date-fns';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../Context/AuthProvider';

const WrapperStyled = styled.div`
    margin-bottom: 0px;
    padding: 5px;
    /* background-color:red; */
    
    .author-date {
        margin-bottom: 0px;
        /* margin-left: 45px;  */

        display: flex;
        justify-content: ${(props) => (props.isCurrentUser ? 'center' : 'flex-start')};
        margin-left: ${(props) => (props.isCurrentUser ? 'auto' : '45px')}; 
        text-align: ${(props) => (props.isCurrentUser ? 'right' : 'right')};
    }

    .author {
        margin-left: 45px; 
        text-align: ${(props) => (props.isCurrentUser ? 'right' : 'left')};
   
        font-weight: bold;
        font-size: small;
        display: ${(props) => (props.isCurrentUser ? 'none' : 'block')}
    }

    .date {
        /* margin-left: ${(props) => (props.isCurrentUser ? 'auto' : '45px')};  */
        display: flex;
        justify-content: center;
        margin-left: 5px;
        font-size: 11px;
        color: gray;
    }

    .message-container {
        display: flex;
        flex-direction: ${(props) => (props.isCurrentUser ? 'row-reverse' : 'row')};
        align-items: flex-start;
    }

    .message-content {
        margin-left: 0px;
        padding: 6px;
        border: 1px solid #dcdcdc;
        border-radius: 8px; 
        background-color: #f8f9f9; 
        max-width: 60%; 
        text-align: ${(props) => (props.isCurrentUser ? 'right' : 'left')};
        color: ${(props) => (props.isCurrentUser ? 'red' : '')};
        /* min-width:60%; */
    }
`;

function formatDate(seconds) {
    let formattedDate = '';

    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());

        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
}

export default function Message({ text, displayName, createdAt, photoURL, fileURL, uid: messageUid, previousDate }) {
    const { uid } = useContext(AuthContext)
    const isCurrentUser = uid === messageUid;
    const currentDate = createdAt?.seconds;
    const showDate = previousDate !== currentDate;
    console.log({ createdAt });
    console.log({ previousDate });

    return (
        <WrapperStyled isCurrentUser={isCurrentUser}>
            {/* <div className='author-date'> */}
            {formatDate(createdAt?.seconds) != formatDate(previousDate)
                ?
                (<Typography.Text className='date'>
                    {formatDate(createdAt?.seconds)}
                </Typography.Text>)
                : ""
            }

            <Typography.Text className='author'>{displayName}</Typography.Text>
            {/* </div> */}
            <div className='message-container'>
                <Avatar src={photoURL} style={{ marginRight: '10px' }}>
                    {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div className='message-content'>
                    <div className='content'>
                        <Tooltip title={formatDate(createdAt?.seconds)}>
                            {fileURL ? (
                                <Typography.Link href={fileURL} target="_blank">
                                    {text || 'Download File'}
                                </Typography.Link>
                            ) : (
                                <Typography.Text>{text}</Typography.Text>
                            )}
                        </Tooltip>

                    </div>
                </div>
            </div>
        </WrapperStyled>
    );
}
