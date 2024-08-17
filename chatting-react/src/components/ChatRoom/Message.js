import { Avatar, Image, Tooltip, Typography } from 'antd';
import { formatRelative } from 'date-fns';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../Context/AuthProvider';

const WrapperStyled = styled.div`
    margin-bottom: 0px;
    padding: 2px;
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
   
        font-weight: lighter;
        font-size: smaller;
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
        padding: 5px;
        border: 1px solid #dcdcdc;
        border-radius: 12px; 
        background-color: #f8f9f9; 
        max-width: 60%; 
        text-align: ${(props) => (props.isCurrentUser ? 'right' : 'left')};
        color: ${(props) => (props.isCurrentUser ? 'red' : '')};
        /* min-width:60%; */
    }
`;

const ImageStyled = styled(Image)`
    border:transparent;
    background-color:red;
    max-width: '400px';
    height:100px;
    max-height: '100%';
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

export default function Message({ isPhoto, text, displayName, createdAt, photoURL, fileURL, uid: author, previousDate, nextAuthor, nextDate, previousAuthor }) {
    const { uid } = useContext(AuthContext)
    const isCurrentUser = uid === author;
    // const currentDate = createdAt?.seconds;

    return (
        <WrapperStyled isCurrentUser={isCurrentUser}>
            {/* <div className='author-date'> */}
            {
                // formatDate(createdAt?.seconds) != formatDate(previousDate)
                (previousAuthor !== author || (createdAt?.seconds - previousDate >= 180))
                    ?
                    (
                        <div>
                            {(createdAt?.seconds - previousDate >= 180) ?
                                <Typography.Text className='date'>
                                    {formatDate(createdAt?.seconds)}
                                </Typography.Text> : ""}

                            <Typography.Text className='author'>{displayName}</Typography.Text>
                        </div>
                    )
                    : (< div style={{ margin: '0px' }}></div>)
            }

            {/* </div> */}
            <div className='message-container'>
                {(author !== uid && !(author === nextAuthor && (nextDate?.seconds - createdAt?.seconds < 180)))
                    ?
                    (

                        <Avatar src={photoURL} style={{ margin: '0px 5px' }}>
                            {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                    )
                    :
                    (
                        author === uid ?
                            (< div style={{ margin: '0px ' }}></div>)
                            :
                            (< div style={{ margin: '0px 21.5px' }}></div>)
                    )}

                <div className='message-content'>
                    <div className='content'>
                        <Tooltip title={formatDate(createdAt?.seconds)}>

                            {isPhoto ?
                                (
                                    <Image
                                        src={fileURL}
                                        alt={text || 'Image preview'}
                                        style={{ maxHeight: '500px', maxWidth: '100%' }}
                                    // preview={false} // Nếu không muốn hiển thị ảnh lớn hơn khi nhấp vào
                                    />


                                ) :
                                (
                                    fileURL ? (
                                        <Typography.Link href={fileURL} target="_blank" >
                                            {text || 'Download File'
                                            }
                                        </Typography.Link>
                                    ) : (
                                        <Typography.Text>{text}</Typography.Text>
                                    )
                                )
                            }
                        </Tooltip>

                    </div>

                </div>

                {
                    (author !== nextAuthor) ?
                        (
                            (< div style={{ margin: '15px ' }}>
                                <p></p>
                            </div>)

                        )
                        : ("")
                }
            </div>
        </WrapperStyled >
    );
}
