import React from "react";
import { Row, Col } from "antd";
import Sidebar from "./SideBar";
import ChatWindow from "./ChatWindow";
export default function ChatRoom() {
    return <div>
        <Row>
            <Col span={8}><Sidebar /></Col>
            <Col span={16}><ChatWindow /></Col>
        </Row>
    </div>
}