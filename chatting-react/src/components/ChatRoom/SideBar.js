import React, { useContext } from "react";
import { Row, Col } from "antd";
import UserInfo from "./UserInfo";
import RoomList from "./RoomList";
import styled from "styled-components";

const SidebarStyled = styled.div`
    background-color: #f5f5f5;
    color: white;
height: 100vh;
`;

export default function Sidebar() {

    return <div>
        <SidebarStyled>
            <Row>
                <Col span={24}><UserInfo /></Col>
                <Col span={24}><RoomList /></Col>
            </Row>
        </SidebarStyled>
    </div>
}