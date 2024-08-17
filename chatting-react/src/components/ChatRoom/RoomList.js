import React, { useContext, useEffect } from 'react';
import { Avatar, Button, Typography } from 'antd';
import styled from 'styled-components';
import { LogoutOutlined, PlusSquareOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context/AppProvider';
import { auth } from '../../firebase/config';

const LinkStyled = styled(Typography.Link)`
    display: block;
    color: ${props => props.isSelected ? 'white' : 'black'} !important;
    font-weight: normal;
    background-color: ${props => props.isSelected ? 'lightblue' : 'transparent'};
    padding: 5px;
    width: 100%;

    &:hover {
        color: ${props => props.isSelected ? 'white' : '#1890ff'} !important; /* Light blue color for hover effect */
        background-color: ${props => props.isSelected ? 'lightblue' : '#f0f0f0'};
    }
`;


const ContainerStyled = styled.div`
    height:calc(100vh - 105px);
`;

const RoomListContainer = styled.div`
    display: flex;
    height:100%;
    width: 100%;
    overflow-y: auto;
    flex-direction: column;    
    scrollbar-color:grey transparent;
    /* scroll-snap-align:none; */
    /* scrollbar-width: none;  */

    align-items: flex-start; /* Align items to the left */
`;

const AvatarStyled = styled(Avatar)`
    margin: 2px 10px;
    width: 45px; 
    height: 45px;
    /* padding:5px; */
`;

const RoomInfoStyled = styled.div`
    display: flex; /* Use flexbox layout */
    align-items: center; /* Center items vertically */
    /* margin-left: 20px; Adjust margin as needed */
    
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
    background-color: transparent;
    &:hover {
        background-color: #333;
    }
`;

const MessagePreviewStyled = styled.div`
    color: gray;
    font-size: 12px;
`;

export default function RoomList() {
    const { rooms, setIsAddRoomVisible, setIsCollapse, setIsJoinRoomVisible, setSelectedRoomId, selectedRoomId } = useContext(AppContext); // Access state from context
    const handleAddRoom = () => {
        setIsAddRoomVisible(true);
    };

    const handleJoinRoom = () => {
        setIsJoinRoomVisible(true);
    };
    const handleClickChat = (id) => {
        setSelectedRoomId(id)
        // console.log('sadasdsa', id);

        // setIsCollapse(true)
    }
    const roomsOrdered = React.useMemo(() => {

        return [...rooms].sort((a, b) => {
            return -(a.updatedAt?.seconds * 1000 + a.updatedAt?.nanoseconds / 1000000)
                + (b.updatedAt?.seconds * 1000 + b.updatedAt?.nanoseconds / 1000000);
        });
    }, [rooms]);
    // const { text, displayName } = rooms.latestMessage;


    return (
        <ContainerStyled>

            <RoomListContainer>
                {roomsOrdered.map(room => (
                    <LinkStyled
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        isSelected={room.id === selectedRoomId}
                    >
                        <RoomInfoStyled onClick={() => setIsCollapse(true)}>

                            <AvatarStyled
                                src={room.photoURL ? room.photoURL : "https://cdn-icons-png.flaticon.com/512/4807/4807598.png"}
                            >
                                gr
                            </AvatarStyled>

                            <div>
                                <Typography.Text strong>{room.name}</Typography.Text>

                                {room.lastestMessage ?
                                    (
                                        <MessagePreviewStyled>{room.lastestMessage.displayName}: {room.lastestMessage.text}</MessagePreviewStyled>
                                    ) :
                                    (
                                        <MessagePreviewStyled>No messages yet</MessagePreviewStyled>
                                    )
                                }
                            </div>
                        </RoomInfoStyled>
                    </LinkStyled>
                ))}
            </RoomListContainer>
            <ButtonGroupStyled>
                <ButtonStyled
                    onClick={handleAddRoom}
                    icon={<PlusSquareOutlined />}
                >
                    {/* Create */}
                </ButtonStyled>
                <ButtonStyled
                    onClick={handleJoinRoom}
                    icon={<UsergroupAddOutlined />}
                >
                    {/* Join */}
                </ButtonStyled>
                <ButtonStyled
                    onClick={() => auth.signOut()}
                    icon={<LogoutOutlined />}
                >


                </ButtonStyled>

            </ButtonGroupStyled>


        </ContainerStyled >

    );
}
