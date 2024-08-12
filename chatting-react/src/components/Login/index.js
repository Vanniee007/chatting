import React from "react";
import { Row, Col, Typography, Button } from 'antd';
import { auth, db } from "../../firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { addDocument } from "../../firebase/service.";

const { Title } = Typography;
const ggProvider = new GoogleAuthProvider();

export default function Login() {
    const handleGgLogin = async () => {
        const result = await signInWithPopup(auth, ggProvider);
        console.log(result)
        // console.log({
        //     displayName: user.displayName,
        //     email: user.email,
        //     photoURL: user.photoURL,
        //     uid: user.uid,
        //     providerId: user.providerId,
        // })
        const { _tokenResponse, user } = result;
        console.log("user: ", user)
        console.log("user info: ", {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            providerId: user.providerId,
        })

        if (_tokenResponse?.isNewUser) {
            console.log("New user added")
            addDocument('users', {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: user.providerId,
            });
        }
    };


    return (
        <div>
            <Row justify="center" style={{ height: 800 }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}> Chatting </Title>
                    <Button style={{ width: '100%' }} onClick={handleGgLogin}>
                        Đăng nhập bằng Google
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
