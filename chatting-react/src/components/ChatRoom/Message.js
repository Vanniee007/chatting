import { Avatar, Typography } from 'antd';
import { formatRelative } from 'date-fns';
import React from 'react';
import styled from 'styled-components';

const WrapperStyled = styled.div`
    margin-bottom: 10px;
    padding: 10px;
    
    .author-date {
        margin-bottom: 5px; /* Space between author/date and message content */
        margin-left: 45px; /* Space between author/date and message content */
    }

    .author {
        font-weight: bold;
        display: inline-block; /* Ensures the author text doesn't stretch across the width */
    }

    .date {
        margin-left: 5px; /* Space for avatar */
        font-size: 11px;
        color: gray;
    }

    .message-container {
        display: flex;
        align-items: flex-start; /* Align items to the start of the container */
    }

    .message-content {
        margin-left: 0px; /* Space for avatar */
        padding: 6px;
        border: 1px solid #dcdcdc; /* Border color */
        border-radius: 8px; /* Rounded corners */
        background-color: #ffffff; /* White background for the content area */
        max-width: 80%; /* Optional: Adjust width to fit content */
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

export default function Message({ text, displayName, createdAt, photoURL, fileURL }) {
    return (
        <WrapperStyled>
            <div className='author-date'>
                <Typography.Text className='author'>{displayName}</Typography.Text>
                <Typography.Text className='date'>
                    {formatDate(createdAt?.seconds)}
                </Typography.Text>
            </div>
            <div className='message-container'>
                <Avatar src={photoURL} style={{ marginRight: '10px' }}>
                    {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div className='message-content'>
                    <div className='content'>
                        {fileURL ? (
                            <Typography.Link href={fileURL} target="_blank">
                                {text || 'Download File'}
                            </Typography.Link>
                        ) : (
                            <Typography.Text>{text}</Typography.Text>
                        )}
                    </div>
                </div>
            </div>
        </WrapperStyled>
    );
}
