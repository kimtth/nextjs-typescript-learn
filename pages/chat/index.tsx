import { Flex, Text, VStack, StackDivider, Button, FormControl, LinkBox, LinkOverlay, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure, Box, Icon, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Divider from "../../components/divider";
import Footer from "../../components/footer";
import ChatHeader from "../../components/chatheader";
import Messages from "../../components/messages";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { HiChatAlt2 } from "react-icons/hi";
import { RiKakaoTalkFill } from "react-icons/ri";
import type { Message, Chat } from "../../interfaces";
import { chatAllfetcher, chatAddMsg, chatCreate, chatDeleteById, chatUpdateById } from "../../interfaces/api";
import useSWR from 'swr';


const Chat = () => {
    const { data, error } = useSWR('/api/chat', chatAllfetcher)

    const [messages, setMessages] = useState<Message[]>([]);
    const [chatrooms, setChatrooms] = useState<Chat[]>([]);
    const uniqueId = () => Math.round(Date.now() * Math.random());

    const [targetChatRoomId, setTargetChatRoomId] = useState(0);
    const [targetChatRoomName, setTargetChatRoomName] = useState("");
    const [initFlag, setInitFlag] = useState(false);
    const [inputMessage, setInputMessage] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (initFlag) {
            setMessages([]);
            setInitFlag(false);
        }
    }, [initFlag])

    useEffect(() => {
        setChatrooms(data);
    }, [data])

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    const handleSendMessage = (targetChatRoomId: number) => {
        if (!inputMessage.trim().length) {
            return;
        }
        const data = inputMessage;
        const newMessageMeId = uniqueId();
        const newMessage = { chat_id: targetChatRoomId, id: newMessageMeId, fromWho: "me", text: data }

        setMessages((old) => [...old, newMessage]);
        setInputMessage("");
        handleUpdateMessagesInChatRooms(targetChatRoomId, newMessage);

        const newMessageComId = uniqueId();
        setTimeout(() => {
            const newBotMessage = { chat_id: targetChatRoomId, id: newMessageComId, fromWho: "computer", text: data }
            setMessages((old) => [...old, newBotMessage]);
            handleUpdateMessagesInChatRooms(targetChatRoomId, newBotMessage);
        }, 1000);
    };

    const handleUpdateMessagesInChatRooms = (targetChatRoomId: number, newMessage: Message) => {
        setChatrooms((oldChatrooms) => {
            const updatedChatrooms = [...oldChatrooms];
            const index = updatedChatrooms.findIndex(chatroom => chatroom.id === targetChatRoomId);
            console.log(targetChatRoomId);

            if (index != -1) {
                updatedChatrooms[index] = {
                    ...updatedChatrooms[index],
                    messages: [
                        ...updatedChatrooms[index].messages ?? [],
                        newMessage,
                    ],
                };
            }

            return updatedChatrooms;
        });

        chatAddMsg(targetChatRoomId, newMessage);
    }

    const handleAdd = () => {
        const timestamp = new Date().toLocaleString("ja-JP");
        const newChatRoomId = uniqueId();
        const newChatRoom = { id: newChatRoomId, name: `${timestamp}` };
        setChatrooms((prevChatrooms) => [newChatRoom, ...prevChatrooms]);

        setTargetChatRoomId(newChatRoomId);
        chatCreate(newChatRoom);

        const newMessage = { chat_id: newChatRoomId, id: 1, fromWho: "computer", text: `Hi! Chat ${timestamp}` }
        setMessages([newMessage]);
        handleUpdateMessagesInChatRooms(newChatRoomId, newMessage);
    };

    const handleEdit = (targetChatRoomId: number) => {
        onOpen();
        setTargetChatRoomId(targetChatRoomId);
        const chatRoom = chatrooms.find((chatroom) => chatroom.id === targetChatRoomId);
        setTargetChatRoomName(chatRoom ? chatRoom.name : "");

        if (chatRoom) {
            chatUpdateById(targetChatRoomId, chatRoom);
        }
    };

    const handleSave = () => {
        setChatrooms((prevChatrooms) =>
            prevChatrooms.map((chatroom) =>
                chatroom.id === targetChatRoomId ? { ...chatroom, name: targetChatRoomName } : chatroom
            )
        );
        onClose();

        if (targetChatRoomName) {
            const updateChat = { id: targetChatRoomId, name: targetChatRoomName }
            chatUpdateById(targetChatRoomId, updateChat);
        }
        setTargetChatRoomName("");
    };

    const handleDelete = (targetChatRoomId: number) => {
        if (confirm("Are you sure to delete?")) {
            setChatrooms((prevChatrooms) => {
                setInitFlag(true);
                return prevChatrooms.filter((chatroom) => chatroom.id !== targetChatRoomId)
            });

            chatDeleteById(targetChatRoomId);
        }
    }

    const handleChatSelect = (targetChatRoomId: number) => {
        if (targetChatRoomId) {
            setTargetChatRoomId(targetChatRoomId);
            const chatRoom = chatrooms.find((chatroom) => chatroom.id === targetChatRoomId);
            // nullish coalescing operator (??) to provide a default value for the array if it is undefined. 
            // setMessages(chatRoom ? chatRoom.messages?? [] : [])
            const chatRoomMsgs = chatRoom?.messages;
            if (chatRoomMsgs) {
                const sortedChatRoomMsgs = chatRoomMsgs.sort((a: Message, b: Message) => {
                    if (a.created_at && b.created_at) {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateA.getTime() - dateB.getTime();
                    } else {
                        return 0
                    }
                });
                setMessages(sortedChatRoomMsgs ? sortedChatRoomMsgs : [])
            }
        }
    };

    return (
        <Flex w="100%" h="95vh" justify="center" align="center">
            <Flex w="18%" h="95vh" bg="gray.200">
                <VStack width="100%">
                    <VStack
                        divider={<StackDivider />}
                        p={4}
                        width="100%"
                        height="95%"
                        maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
                        alignItems="stretch"
                        bg="gray.100"
                    >
                        {/* Chat Add Panel */}
                        <HStack>
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
                        {/* Chat Select Panel */}
                        {chatrooms?.map((rooms, index) => (
                            <HStack
                                key={`h${rooms.id}`}
                                onClick={() => handleChatSelect(rooms.id)}
                                style={{
                                    cursor: "pointer",
                                    fontWeight: rooms.id === targetChatRoomId ? "bold" : "normal",
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
                    <VStack>
                        {/* Chat Setting Panel */}
                        <HStack spacing={1}>
                            <Button width='17vw' leftIcon={<FiSettings />} colorScheme='gray' justifyContent="flex-start">
                                <Text>Settings</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </Flex>
            <Flex w="5px" h="95vh"></Flex>
            {/* Chat Panel */}
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


