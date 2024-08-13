import React, { useContext, useState } from "react";
import { Row, Col, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Sidebar from "./SideBar";
import ChatWindow from "./ChatWindow";

import { AppContext } from "../../Context/AppProvider";
export default function ChatRoom() {


    return (
        <div >

            <Row >
                <Col xs={24} sm={12} md={10} lg={7} xl={7} >
                    <Sidebar />
                </Col>
                <Col xs={24} sm={12} md={14} lg={17} xl={17}>
                    <ChatWindow />

                </Col>
            </Row>
        </div>
    );
}
