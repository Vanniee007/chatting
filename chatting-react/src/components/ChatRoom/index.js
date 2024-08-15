import React from "react";
import { Row, Col } from "antd";
import Sidebar from "./SideBar";
import ChatWindow from "./ChatWindow";

export default function ChatRoom() {


    return (
        <div >

            <Row >
                <Col xs={24} sm={10} md={10} lg={7} xl={7} >
                    <Sidebar />
                </Col>
                <Col xs={24} sm={14} md={14} lg={17} xl={17}>
                    <ChatWindow />

                </Col>
            </Row>
        </div>
    );
}
