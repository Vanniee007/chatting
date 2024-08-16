import React, { useContext, useEffect } from 'react';
import { Button, Typography } from 'antd';
import styled from 'styled-components';
import { LogoutOutlined, PlusSquareOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context/AppProvider';
import { auth } from '../../firebase/config';

const LinkStyled = styled(Typography.Link)`
    display: block;
    color: ${props => props.isSelected ? 'white' : 'black'} !important;
    font-weight: normal;
    background-color: ${props => props.isSelected ? 'lightblue' : 'transparent'};
    padding: 10px;
    width: 100%;

    &:hover {
        color: ${props => props.isSelected ? 'white' : '#1890ff'} !important; /* Light blue color for hover effect */
        background-color: ${props => props.isSelected ? 'lightblue' : '#f0f0f0'};
    }
`;

const ContainerStyled = styled.div`
    margin: 0;
    display: flex;
    height:calc(100vh - 110px);
    flex-direction: column;
    align-items: flex-start; /* Align items to the left */
`;

const RoomInfoStyled = styled.div`
    margin-left: 40px;
`;

const ButtonGroupStyled = styled.div`
    /* margin-top: 20px; */
    /* margin-left: 40px; */
    padding:10px 0px;
    background-color:lightgray;
    display: flex;
    width: 100%;
    display: flex;
    align-items:center;
    justify-content: center;
    gap: 8px; 
    flex-wrap: wrap; 
`;

const ButtonStyled = styled(Button)`
    width: 75px; 
    color: black; 
    background-color: black;
    &:hover {
        background-color: #333;
    }
`;

const MessagePreviewStyled = styled.div`
    color: gray;
    font-size: 12px;
`;

export default function RoomList() {
    const { rooms, setIsAddRoomVisible, setIsJoinRoomVisible, setSelectedRoomId, selectedRoomId } = useContext(AppContext); // Access state from context

    const handleAddRoom = () => {
        setIsAddRoomVisible(true);
    };

    const handleJoinRoom = () => {
        setIsJoinRoomVisible(true);
    };
    console.log(rooms);


    return (
        <div>

            <ContainerStyled>
                {rooms.map(room => (
                    <LinkStyled
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        isSelected={room.id === selectedRoomId}
                    >
                        <RoomInfoStyled>
                            <Typography.Text strong>{room.name}</Typography.Text>
                            <MessagePreviewStyled>{room.description || 'No messages yet'}</MessagePreviewStyled>
                        </RoomInfoStyled>
                    </LinkStyled>
                ))}
            </ContainerStyled>

            <ButtonGroupStyled>
                <ButtonStyled
                    ghost
                    onClick={handleAddRoom}
                    icon={<PlusSquareOutlined />}
                >
                    {/* Create */}
                </ButtonStyled>
                <ButtonStyled
                    ghost
                    onClick={handleJoinRoom}
                    icon={<UsergroupAddOutlined />}
                >
                    {/* Join */}
                </ButtonStyled>
                <ButtonStyled ghost
                    onClick={() => auth.signOut()}
                    icon={<LogoutOutlined />}
                >


                </ButtonStyled>

            </ButtonGroupStyled>
        </div>

    );
}
