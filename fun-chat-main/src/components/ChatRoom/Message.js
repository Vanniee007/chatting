import React, { useContext } from 'react';
import { Avatar, Typography } from 'antd';
import styled from 'styled-components';
import { formatRelative } from 'date-fns/esm';
import { AuthContext } from '../../Context/AuthProvider';

const WrapperStyled = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  align-items: flex-start;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
    padding: 10px;
    border-radius: 8px;
    background-color: ${props => props.isCurrentUser ? '#dcf8c6' : '#fff'};
  }
`;

function formatDate(seconds) {
  let formattedDate = '';

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export default function Message({ text, displayName, createdAt, photoURL, uid }) {
  const { uid: currentUserUid } = useContext(AuthContext);

  const isCurrentUser = uid === currentUserUid;

  return (
    <WrapperStyled isCurrentUser={isCurrentUser}>
      <div>
        <Avatar size='small' src={photoURL}>
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='author'>{displayName}</Typography.Text>
        <Typography.Text className='date'>
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>
      <div>
        <Typography.Text className='content'>{text}</Typography.Text>
      </div>
    </WrapperStyled>
  );
}
