import { Form, Modal, Input } from 'antd';
import React, { useContext } from 'react';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/service.';
import { AuthContext } from '../../Context/AuthProvider';

export default function AddRoomModal() {
    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext); // Access state from context
    const [form] = Form.useForm();
    const { uid } = React.useContext(AuthContext)


    const handleOK = () => {
        console.log("form", form.getFieldsValue()); // Retrieve form values
        setIsAddRoomVisible(false);
        addDocument("rooms", { ...form.getFieldsValue(), members: [uid] })
        form.resetFields();
    };

    const handleCancel = () => {
        setIsAddRoomVisible(false);
    };

    return (
        <Modal title="Create room"

            open={isAddRoomVisible}  // Control visibility of the modal
            onOk={handleOK}
            onCancel={handleCancel}>
            <Form form={form} >
                <Form.Item label="Name" name='name'>
                    <Input placeholder="Type room name" />
                </Form.Item>
                <Form.Item label="Description" name='description'>
                    <Input placeholder="Type description" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
