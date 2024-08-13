import React, { useContext } from 'react';
import { Button, Collapse, Typography } from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context/AppProvider';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
    &&& {
        .ant-collapse-content-box {
            padding: 0 40px;
        }
    }
    font-weight: bold; 
`;

const LinkStyled = styled(Typography.Link)`
    margin-left: 40px;
    display: block;
    margin-top: 10px;
    color: black !important;
    font-weight: normal;

    &:hover {
        color: #1890ff !important; /* Light blue color for hover effect */
    }
`;

const ContainerStyled = styled.div`
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align items to the left */
`;

const ButtonGroupStyled = styled.div`
    margin-top: 20px; /* Add margin above the buttons */
    margin-left: 40px;
    display: flex;
    gap: 8px; /* Space between buttons */
    flex-wrap: wrap; /* Allows buttons to wrap to the next line */
`;

const ButtonStyled = styled(Button)`
    width: 150px; /* Set a fixed width for buttons */
    color: black; /* Text color for the button */
    background-color: black; /* Button background color */
    align-items: 'left';
    &:hover {
        background-color: black; /* Darker shade on hover */
    }
`;

export default function RoomList() {
    const { rooms, setIsAddRoomVisible, setIsJoinRoomVisible, setSelectedRoomId } = useContext(AppContext); // Access state from context

    const handleAddRoom = () => {
        setIsAddRoomVisible(true);
    };

    const handleJoinRoom = () => {
        setIsJoinRoomVisible(true);
    };

    return (
        <ContainerStyled>
            {/* <Collapse ghost defaultActiveKey={['1']}> */}
            {/* <PanelStyled header="Room list" key="1"> */}
            {rooms.map(room => (
                <LinkStyled key={room.id} onClick={() => setSelectedRoomId(room.id)}>
                    {room.name}
                </LinkStyled>
            ))}
            {/* </PanelStyled> */}
            {/* </Collapse> */}
            <ButtonGroupStyled>
                <ButtonStyled
                    ghost
                    onClick={handleAddRoom}
                    icon={<PlusSquareOutlined />}
                >
                    Create Room
                </ButtonStyled>
                <ButtonStyled
                    ghost
                    onClick={handleJoinRoom}
                    icon={<UsergroupAddOutlined />}
                >
                    Join Room
                </ButtonStyled>
            </ButtonGroupStyled>
        </ContainerStyled>
    );
}
