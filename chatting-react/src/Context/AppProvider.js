import React, { useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
    const { uid } = React.useContext(AuthContext)
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [isJoinRoomVisible, setIsJoinRoomVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);


    const roomsCondition = React.useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    }, [uid])

    const rooms = useFirestore('rooms', roomsCondition)

    // console.log({ rooms });

    const selectedRoom = React.useMemo(
        () => rooms.find(room => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId]
    );

    const usersCondition = React.useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members
        }
    }, [selectedRoom.members])

    const members = useFirestore('users', usersCondition)
    // console.log({ members });

    return (
        <AppContext.Provider value={{
            rooms,
            selectedRoom,
            members,

            isAddRoomVisible, setIsAddRoomVisible,
            selectedRoomId, setSelectedRoomId,
            isInviteMemberVisible, setIsInviteMemberVisible,
            isJoinRoomVisible, setIsJoinRoomVisible,
            isSidebarVisible, setIsSidebarVisible,
        }}>
            {children}
        </AppContext.Provider>
    )
}