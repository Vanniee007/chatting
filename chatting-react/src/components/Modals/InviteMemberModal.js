import React, { useContext, useState } from 'react';
import { Form, Modal, Select, Spin, Avatar, Button, message } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { debounce } from 'lodash';
import { db } from '../../firebase/config';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

function DebounceSelect({
    fetchOptions,
    debounceTimeout = 300,
    curMembers,
    ...props
}) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, props.curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    React.useEffect(() => {
        return () => {
            setOptions([]);
        };
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size='small' src={opt.photoURL}>
                        {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {` ${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

async function fetchUserList(search, curMembers = []) {
    const usersRef = collection(db, 'users');
    const q = query(
        usersRef,
        where('displayName', '>=', search),
        where('displayName', '<=', search + '\uf8ff'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        label: doc.data().displayName,
        value: doc.data().uid,
        photoURL: doc.data().photoURL,
    })).filter((opt) => !curMembers.includes(opt.value));
}

export default function InviteMemberModal() {
    const {
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        selectedRoomId,
        selectedRoom,
    } = useContext(AppContext);
    const [value, setValue] = useState([]);
    const [form] = Form.useForm();

    const handleOk = async () => {
        form.resetFields();
        setValue([]);

        const roomRef = doc(db, 'rooms', selectedRoomId);
        await updateDoc(roomRef, {
            members: [...selectedRoom.members, ...value.map((val) => val.value)],
        });

        setIsInviteMemberVisible(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setValue([]);
        setIsInviteMemberVisible(false);
    };

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(selectedRoomId).then(() => {
            message.success('Room ID copied to clipboard!');
        }, (err) => {
            message.error('Failed to copy Room ID.');
            // console.error('Copy failed', err);
        });
    };

    return (
        <div>
            <Modal
                title='Invite member'
                open={isInviteMemberVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
                footer={[
                    <Button key='copy-room-id' onClick={handleCopyRoomId}>
                        Copy Room ID
                    </Button>,
                    <Button key='cancel' onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key='submit' type='primary' onClick={handleOk}>
                        Invite
                    </Button>
                ]}
            >
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode='multiple'
                        name='search-user'
                        label='Name of member'
                        value={value}
                        placeholder='Type name'
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: '100%' }}
                        curMembers={selectedRoom.members ? selectedRoom.members : []}
                    />
                </Form>
            </Modal>
        </div>
    );
}
