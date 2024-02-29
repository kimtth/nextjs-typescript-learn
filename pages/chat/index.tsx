import { Flex, Text, VStack, StackDivider, Button, FormControl, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure, Switch } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import Divider from "../../components/divider";
import Footer from "../../components/footer";
import ChatHeader from "../../components/chatheader";
import Messages from "../../components/messages";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { HiChatAlt2 } from "react-icons/hi";
import { RiKakaoTalkFill } from "react-icons/ri";
import type { Message, Chat } from "../../interfaces";
import { Spinner } from '@chakra-ui/react'
import { chatAllfetcher, chatGetMsgs, chatAddMsg, chatCreate, chatDeleteById, chatUpdateById, chatGetResponse } from "../../interfaces/api";
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';


const Chat = () => {
    const { data, error } = useSWR('/api/chat', chatAllfetcher);
    // add an alias to data and error
    const [targetChatRoomId, setTargetChatRoomId] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatrooms, setChatrooms] = useState<Chat[]>([]);
    // const uniqueId = () => Math.round(Date.now() * Math.random());

    const [targetChatRoomName, setTargetChatRoomName] = useState("");
    const [initFlag, setInitFlag] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [isInThinking, setIsInThinking] = useState(false);
    const [isGPTmode, setIsGPTmode] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (initFlag) {
            setMessages([]);
            setInitFlag(false);
        }
    }, [initFlag])

    useEffect(() => {
        console.log(data);
        // error handling, if data is null, return empty array
        if (data) {
            if (data.length === 0) {
                setChatrooms([]);
            } else {
                setChatrooms(data);
                handleChatSelect(targetChatRoomId);
            }
        }
    }, [data])

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    const handleSendMessage = (targetChatRoomId: string) => {
        if (!inputMessage.trim().length) {
            return;
        }
        setIsInThinking(true);
        const newMessageMeId = uuidv4();
        const newMessage = { chat_id: targetChatRoomId, id: newMessageMeId, from_who: "me", msg: inputMessage }

        setMessages((old) => [...old, newMessage]);
        setInputMessage("");
        handleUpdateMessagesInChatRooms(targetChatRoomId, newMessage);

        const newMessageComId = uuidv4();
        setTimeout(() => {
            const botResponsePromise = chatGetResponse(targetChatRoomId, inputMessage, isGPTmode ? "gpt" : "work");
            // get value from const botResponse: Promise<any>
            botResponsePromise.then((botResponse) => {
                console.log(botResponse);
                const newBotMessage = { chat_id: targetChatRoomId, id: newMessageComId, from_who: "computer", msg: botResponse }
                // Check if botResponse has status property and stauts is not 200
                if (botResponse.hasOwnProperty('status') && botResponse.status !== 200) {
                    alert("Error: " + botResponse.statusText);
                    setIsInThinking(false);
                    return;
                }
                setMessages((old) => [...old, newBotMessage]);
                handleUpdateMessagesInChatRooms(targetChatRoomId, newBotMessage);
                if(newBotMessage){
                    setIsInThinking(false);
                }
            }).catch((error) => {
                alert(error);
                setIsInThinking(false);
            });
        }, 300);
    };

    const handleUpdateMessagesInChatRooms = (targetChatRoomId: string, newMessage: Message) => {
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
        const newChatRoomId = uuidv4();
        const newChatRoom = { id: newChatRoomId, name: `${timestamp}` };
        setChatrooms((prevChatrooms) => [newChatRoom, ...prevChatrooms]);

        setTargetChatRoomId(newChatRoomId);
        chatCreate(newChatRoom);

        const newMessage = { chat_id: newChatRoomId, id: uuidv4(), from_who: "computer", msg: `Hi! Chat ${timestamp}` }
        setMessages([newMessage]);
        handleUpdateMessagesInChatRooms(newChatRoomId, newMessage);
        setIsInThinking(false);
    };

    const handleEdit = (targetChatRoomId: string) => {
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

    const handleDelete = (targetChatRoomId: string) => {
        if (confirm("Are you sure to delete?")) {
            setChatrooms((prevChatrooms) => {
                setInitFlag(true);
                return prevChatrooms.filter((chatroom) => chatroom.id !== targetChatRoomId)
            });

            chatDeleteById(targetChatRoomId);
        }
    }

    const handleChatSelect = async (targetChatRoomId: string) => {
        console.log(targetChatRoomId);
        if (targetChatRoomId !== null && targetChatRoomId !== undefined && targetChatRoomId.trim().length !== 0) {
            setTargetChatRoomId(targetChatRoomId);
            const messages = await chatGetMsgs(targetChatRoomId);
            console.log(messages);
            if (messages) {
                const sortedChatRoomMsgs = messages.sort((a: Message, b: Message) => {
                    if (a.created_at && b.created_at) {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateA.getTime() - dateB.getTime();
                    } else {
                        return 0;
                    }
                });
                setMessages(sortedChatRoomMsgs ? sortedChatRoomMsgs : []);
            }
        }
    };

    function handleMode(event: ChangeEvent<HTMLInputElement>): void {
        setIsGPTmode(!isGPTmode);
    }

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
                        {/* Uncaught TypeError: chatrooms.map is not a function */}
                        {chatrooms?.map((rooms) => (
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
                    { /* add a conditon for show and hide Flex area by isInThinking */}
                    {isInThinking ?
                        <Flex ml={2} bg='teal.50'><Spinner size='sm' color='blue.500' mr={2} label="Thinking ..." /><Text size='sm' as='b'>Thinking ...</Text></Flex>
                        : ""}
                    <Flex mt={2} mr={3} justifyContent="flex-end" align="center"><Text size='sm' as='b'>Generated by GPT</Text><Switch size='md' ml={2} isChecked={isGPTmode} onChange={handleMode}/></Flex>
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


