import { UserAddOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Form, Input, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/service.";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";

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
    const messages = useFirestore("messages", condition)
    useEffect(() => {
        if (messageListRef?.current) {
            messageListRef.current.scrollTop =
                messageListRef.current.scrollHeight + 50;
        }
    }, [messages]);
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
                            {messages.map((mes) => (
                                <Message
                                    key={mes.id}
                                    text={mes.text}
                                    photoURL={mes.photoURL}
                                    displayName={mes.displayName}
                                    createdAt={mes.createdAt}
                                />
                            ))}
                        </MessageListStyled>
                        <FormStyled form={form}>
                            <Form.Item name="message">
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