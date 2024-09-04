import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "antd";
import Sidebar from "./SideBar";
import ChatWindow from "./ChatWindow";
import styled from 'styled-components';
import { AppContext } from "../../Context/AppProvider";

const ContainerStyled = styled.div`
    height: 100vh;
    overflow: hidden; /* Prevent scrolling */
`;

const MainContent = styled.div`
    height: 100%;
    overflow: auto; /* Allow scrolling if needed */
`;
// new command

export default function ChatRoom() {
    const { isSmallScreen, isCollapse } = useContext(AppContext)

    useEffect(() => {
        console.log({ isCollapse });

    }, [isCollapse])
    return (
        <ContainerStyled>
            <Row style={{ height: '100%' }}>
                <Col
                    xs={isCollapse ? 0 : 24}
                    sm={isCollapse ? 0 : 24}
                    md={10} lg={7} xl={7}
                    style={{ height: '100%' }}
                >
                    <Sidebar />
                </Col>
                <Col
                    xs={isCollapse ? 24 : 0}
                    sm={isCollapse ? 24 : 0}
                    md={14} lg={17} xl={17}
                    style={{ height: '100%' }}
                >
                    <ChatWindow />
                </Col>
            </Row>
        </ContainerStyled>
    );
}
