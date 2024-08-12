import React, { useContext, useState } from 'react';
import { Form, Modal, Input, Button, message } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function JoinRoomModal() {
    const { isJoinRoomVisible, setIsJoinRoomVisible }
        = useContext(AppContext);
    const { uid } = useContext(AuthContext);
    const [roomId, setRoomId] = useState('');
    const [form] = Form.useForm();

    const handleOk = async () => {
        if (!roomId) {
            message.error('Please enter a room ID.');
            return;
        }

        try {
            const roomRef = doc(db, 'rooms', roomId);
            const roomSnapshot = await getDoc(roomRef);

            if (roomSnapshot.exists()) {
                const roomData = roomSnapshot.data();
                const updatedMembers = roomData.members ? [...roomData.members, uid] : [uid];

                await updateDoc(roomRef, { members: updatedMembers });

                message.success('Joined the room successfully!');
                form.resetFields();
                setRoomId('');
                setIsJoinRoomVisible(false);
            } else {
                message.error('Room not found.');
            }
        } catch (error) {
            console.error('Error joining room:', error);
            message.error('Failed to join the room.');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setRoomId('');
        setIsJoinRoomVisible(false);
    };

    return (
        <Modal
            title='Join Room'
            onOk={handleOk}
            open={isJoinRoomVisible}
            onCancel={handleCancel}
        >
            <Form form={form} layout='vertical'>
                <Form.Item
                    name='roomId'
                    label='Room ID'
                    rules={[{ required: true, message: 'Please enter the room ID.' }]}
                >
                    <Input
                        placeholder='Enter room ID'
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
