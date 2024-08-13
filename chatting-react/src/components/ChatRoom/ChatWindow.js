import { UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Form, Input, Tooltip, Upload } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/service.";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const WrapperStyle = styled.div`
    height: 100vh;
`;

const HeaderStyled = styled.div`
    background-color:#9AD0EC;
    display:flex;
    justify-content:space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid;

    .header{
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        &__title{
            margin: 0;
            font-weight: bold;
        }
        &__description {
            font-size: 12px;
        }
    }
`;
const ButtonGroupStyled = styled.div`
    display:flex;
    align-items: center;
    
`;
const ContentStyled = styled.div`
    height: calc(100% - 57px)   ;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; 
`;

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    border: 1px solid rgb(230,230,230);

    .ant-form-item{
        flex: 1;
        margin: 0;
    }
    border: 0px;
`;

const MessageListStyled = styled.div`
    margin: 10px;
    overflow-y: scroll;
    max-height: 100%;
`;
export default function ChatWindow() {
    const { selectedRoom, members, setIsInviteMemberVisible, } = useContext(AppContext);
    const { uid, photoURL, displayName } = useContext(AuthContext)
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef(null); // Ref for the input field

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }
    const messageListRef = useRef(null);
    const [form] = Form.useForm()
    const handleOnSubmit = () => {
        addDocument('messages', {
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName
        })
        form.resetFields(['message'])
        inputRef.current.focus()
    }
    const condition = React.useMemo(
        () => ({
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoom.id,
        }),
        [selectedRoom.id]
    );
    const messagesFromFirestore = useFirestore("messages", condition);

    const messages = React.useMemo(() => {
        return [...messagesFromFirestore].sort((a, b) => {
            const dateA = a.createdAt
                ? new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000)
                : new Date(0); // Default to a very old date if createdAt is null

            const dateB = b.createdAt
                ? new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000)
                : new Date(0); // Default to a very old date if createdAt is null

            return dateA - dateB;
        });
    }, [messagesFromFirestore]);


    const handleUpload = ({ file }) => {
        if (!file) return;

        // Create a storage reference
        const storageRef = ref(storage, `/files/${file.name}`);

        // Upload the file
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress function, if you want to display progress
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                // console.error("Upload failed:", error);
            },
            () => {
                // Get the download URL and store it in Firestore
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    addDocument('messages', {
                        text: file.name,
                        uid,
                        photoURL,
                        roomId: selectedRoom.id,
                        displayName,
                        fileURL: url, // Store the file URL
                    });
                });
            }
        );
    };

    console.log(messages)
    useEffect(() => {
        if (messageListRef?.current) {
            messageListRef.current.scrollTop =
                messageListRef.current.scrollHeight + 50;
        }
    }, [messages]);
    let previousDate = null;

    return <WrapperStyle>
        {
            selectedRoom.id ? (
                <>
                    <HeaderStyled>
                        <div className="header__info">
                            <p className="header__title">{selectedRoom.name}</p>
                            <span className="header__description">{selectedRoom.description}</span>
                        </div>
                        <ButtonGroupStyled>
                            <Button type="text" icon={<UserAddOutlined />} onClick={() => setIsInviteMemberVisible(true)}>
                                Invite
                            </Button>
                            <Avatar.Group size="small" maxCount={2}>
                                {
                                    members.map((member) =>
                                        <Tooltip title={member.displayName}>
                                            <Avatar src={member.photoURL}>
                                                {member.displayName ? '' : member.displayName[0]}
                                            </Avatar>
                                        </Tooltip>

                                    )
                                }
                            </Avatar.Group>
                        </ButtonGroupStyled>
                    </HeaderStyled>
                    <ContentStyled>
                        <MessageListStyled ref={messageListRef}>
                            {messages.map((mes, index) => {
                                const { text, displayName, createdAt, photoURL, fileURL, uid, id } = mes;
                                const currentDate = createdAt?.seconds;

                                // Lấy tác giả của tin nhắn tiếp theo nếu tồn tại
                                const nextAuthor = messages[index + 1]?.uid || null;

                                // Tạo đối tượng messageProps với previousDate và nextAuthor
                                const messageProps = {
                                    text,
                                    displayName,
                                    createdAt,
                                    photoURL,
                                    fileURL,
                                    uid,
                                    previousDate,
                                    nextAuthor,
                                    id
                                };

                                // Cập nhật previousDate cho lần lặp tiếp theo
                                previousDate = currentDate;

                                return (
                                    <Message
                                        key={id}
                                        {...messageProps}
                                    />
                                );
                            })}
                        </MessageListStyled>
                        <FormStyled form={form}>
                            <Upload style={{ border: '10px' }}
                                customRequest={handleUpload}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}></Button>
                            </Upload>
                            <Form.Item name="message" style={{ margin: '0px 5px 0px 5px ' }}>
                                <Input
                                    ref={inputRef}
                                    onChange={handleInputChange}
                                    onPressEnter={handleOnSubmit}
                                    placeholder="Type message"
                                    autoComplete="off" />
                            </Form.Item>

                            <Button onClick={handleOnSubmit}>Send</Button>
                        </FormStyled>
                    </ContentStyled>
                </>)
                : (<Alert
                    message="Please choose room"
                    type="info"
                    showIcon
                    style={{ margin: 5 }}
                    closable
                />)
        }
    </WrapperStyle>
}