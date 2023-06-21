import { Flex, Text, VStack, StackDivider, Button, FormControl, FormLabel, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Divider from "../../components/divider";
import Footer from "../../components/footer";
import ChatHeader from "../../components/chatheader";
import Messages from "../../components/messages";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { HiChatAlt2 } from "react-icons/hi";
import { RiKakaoTalkFill } from "react-icons/ri";

interface Message {
    id: string,
    from: string,
    text: string
}

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: uuidv4(), from: "computer", text: "Hi, My Name is HoneyChat" },
        { id: uuidv4(), from: "me", text: "Hey there" },
        { id: uuidv4(), from: "me", text: "Myself Ferin Patel" },
        {
            id: uuidv4(),
            from: "computer",
            text: "Nice to meet you. You can send me message and i'll reply you with same message.",
        },
    ]);
    const [chatrooms, setChatrooms] = useState([
        {
            id: uuidv4(), name: "Chat Room 1", messages: [
                { id: uuidv4(), from: "computer", text: "Hi, My Name is LoLChat" },
                { id: uuidv4(), from: "me", text: "Hey there" },
                { id: uuidv4(), from: "me", text: "Myself macdonald kim" },
                {
                    id: uuidv4(),
                    from: "computer",
                    text: "Nice to meet you. You can send me message and i'll reply you with same message.",
                },
            ]
        },
        {
            id: uuidv4(), name: "Chat Room 2", messages: [
                { id: uuidv4(), from: "computer", text: "Hi, My Name is PoPoChat" },
                { id: uuidv4(), from: "me", text: "Hey there" },
                { id: uuidv4(), from: "me", text: "Myself ronot taxi" },
                {
                    id: uuidv4(),
                    from: "computer",
                    text: "Nice to meet you. You can send me message and i'll reply you with same message.",
                },
            ]
        },
        {
            id: uuidv4(), name: "Chat Room 3", messages: [
                { id: uuidv4(), from: "computer", text: "Hi, My Name is HoHoChat" },
                { id: uuidv4(), from: "me", text: "Hey there" },
                { id: uuidv4(), from: "me", text: "Myself super duper" },
                {
                    id: uuidv4(),
                    from: "computer",
                    text: "Nice to meet you. You can send me message and i'll reply you with same message.",
                },
            ]
        },
    ]);
    const [targetChatRoomId, setTargetChatRoomId] = useState("");
    const [targetChatRoomName, setTargetChatRoomName] = useState("");
    const [inputMessage, setInputMessage] = useState("");
    const [selectedChat, setSelectedChat] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSendMessage = (targetChatRoomId: string) => {
        if (!inputMessage.trim().length) {
            return;
        }
        const data = inputMessage;
        const newMessage = { id: uuidv4(), from: "me", text: data }
        setMessages((old) => [...old, newMessage]);
        setInputMessage("");
        handleUpdateMessagesInChatRooms(targetChatRoomId, newMessage);

        setTimeout(() => {
            const newBotMessage = { id: uuidv4(), from: "computer", text: data }
            setMessages((old) => [...old, newBotMessage]);
            handleUpdateMessagesInChatRooms(targetChatRoomId, newBotMessage);
        }, 1000);
    };

    const handleUpdateMessagesInChatRooms = (targetChatRoomId: string, newMessage: Message) => {
        setChatrooms((oldChatrooms) => {
            const updatedChatrooms = [...oldChatrooms];
            const index = updatedChatrooms.findIndex(chatroom => chatroom.id === targetChatRoomId);

            if (index != -1) {
                updatedChatrooms[index] = {
                    ...updatedChatrooms[index],
                    messages: [
                        ...updatedChatrooms[index].messages,
                        newMessage,
                    ],
                };
            }

            return updatedChatrooms;
        });
    }

    const handleAdd = () => {
        const timestamp = new Date().toLocaleString("ja-JP");
        const targetChatRoomId = uuidv4();
        const newChatRoom = { id: targetChatRoomId, name: `${timestamp}`, messages: [] };
        setChatrooms((prevChatrooms) => [newChatRoom, ...prevChatrooms]);

        setSelectedChat(0);
        setTargetChatRoomId(targetChatRoomId);

        const newMessage = { id: uuidv4(), from: "computer", text: `Hi! Chat ${timestamp}` }
        setMessages(() => [newMessage]);
        handleUpdateMessagesInChatRooms(targetChatRoomId, newMessage);
    };

    const handleEdit = (targetChatRoomId: string) => {
        onOpen();
        setTargetChatRoomId(targetChatRoomId);
        const chatRoom = chatrooms.find((chatroom) => chatroom.id === targetChatRoomId);
        setTargetChatRoomName(chatRoom ? chatRoom.name : "");
    };

    const handleSave = () => {
        setChatrooms((prevChatrooms) =>
            prevChatrooms.map((chatroom) =>
                chatroom.id === targetChatRoomId ? { ...chatroom, name: targetChatRoomName } : chatroom
            )
        );
        onClose();
        setTargetChatRoomName("");
    };

    const handleDelete = (targetChatRoomId: string) => {
        if (confirm("Are you sure to delete?")) {
            setChatrooms((prevChatrooms) =>
                prevChatrooms.filter((chatroom) => chatroom.id !== targetChatRoomId)
            );
        }
    }

    const handleChatSelect = (index: number, targetChatRoomId: string) => {
        setSelectedChat(index);
        setTargetChatRoomId(targetChatRoomId);
        const chatRoom = chatrooms.find((chatroom) => chatroom.id === targetChatRoomId);
        setMessages(chatRoom ? chatRoom.messages : [])
    };

    return (
        <Flex w="100%" h="95vh" justify="center" align="center">
            <Flex w="18%" h="95vh" bg="gray.200">
                {/* Chat Select Panel Content */}
                <VStack
                    key={"vst"}
                    divider={<StackDivider />}
                    p={4}
                    width="100%"
                    maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
                    alignItems="stretch"
                    bg="gray.100"
                >
                    <HStack key={"new"}>
                        <IconButton
                            icon={<RiKakaoTalkFill />}
                            isRound={true}
                            aria-label={""}
                        />
                        <Text fontSize='1xl'>New Chat Room</Text>
                        <Spacer />
                        <IconButton
                            icon={<FaPlus />}
                            isRound={true}
                            onClick={() => handleAdd()}
                            aria-label={""}
                        />
                    </HStack>
                    {chatrooms.map((rooms, index) => (
                        <HStack
                            key={`h${rooms.id}`}
                            onClick={() => handleChatSelect(index, rooms.id)}
                            style={{
                                cursor: "pointer",
                                fontWeight: index === selectedChat ? "bold" : "normal",
                            }}
                        >
                            <IconButton
                                icon={<HiChatAlt2 />}
                                isRound={true}
                                key={`iba${rooms.id}`}
                                aria-label={""}
                            />
                            <Text fontSize='1xl' isTruncated>{rooms.name}</Text>
                            <Spacer />
                            <IconButton
                                key={`ibb${rooms.id}`}
                                icon={<FaEdit />}
                                isRound={true}
                                onClick={() => handleEdit(rooms.id)}
                                aria-label={""}
                            />
                            <Modal
                                key={`m${rooms.id}`}
                                isOpen={isOpen}
                                onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Rename Chat Room</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={6}>
                                        <FormControl>
                                            <Input
                                                key={`mi${rooms.id}`}
                                                placeholder="Edit"
                                                value={targetChatRoomName}
                                                onChange={(e) => setTargetChatRoomName(e.target.value)}
                                            />
                                        </FormControl>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            colorScheme="blue"
                                            mr={3}
                                            onClick={() => handleSave()}
                                        >
                                            Save
                                        </Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                            <IconButton
                                key={`ibc${rooms.id}`}
                                icon={<FaTrash />}
                                isRound={true} aria-label={""}
                                onClick={() => handleDelete(rooms.id)}
                            />
                        </HStack>
                    ))}
                </VStack>
            </Flex>
            <Flex w="5px" h="95vh"></Flex>
            <Flex w="82%" h="95vh">
                <Flex w="98%" h="98%" flexDir="column" mt={2}>
                    <ChatHeader />
                    <Divider />
                    <Messages messages={messages} />
                    <Divider />
                    <Footer
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        handleSendMessage={() => handleSendMessage(targetChatRoomId)}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Chat;