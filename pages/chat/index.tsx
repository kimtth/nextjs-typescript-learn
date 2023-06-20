import { Flex, Text, VStack, StackDivider, Button, FormControl, FormLabel, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import Divider from "../../components/divider";
import Footer from "../../components/footer";
import ChatHeader from "../../components/chatheader";
import Messages from "../../components/messages";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiChatAlt2 } from "react-icons/hi";


const Chat = () => {
    const [messages, setMessages] = useState([
        { from: "computer", text: "Hi, My Name is HoneyChat" },
        { from: "me", text: "Hey there" },
        { from: "me", text: "Myself Ferin Patel" },
        {
            from: "computer",
            text: "Nice to meet you. You can send me message and i'll reply you with same message.",
        },
    ]);
    const [chatrooms, setChatrooms] = useState([
        { id: 1, name: "Chat Room 1" },
        { id: 2, name: "Chat Room 2" },
        { id: 3, name: "Chat Room 3" },
    ]);
    const [text, setText] = useState("");
    const [inputMessage, setInputMessage] = useState("");
    const [selectedChat, setSelectedChat] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSendMessage = () => {
        if (!inputMessage.trim().length) {
            return;
        }
        const data = inputMessage;

        setMessages((old) => [...old, { from: "me", text: data }]);
        setInputMessage("");

        setTimeout(() => {
            setMessages((old) => [...old, { from: "computer", text: data }]);
        }, 1000);
    };

    const handleEdit = (index: number) => {
        onOpen();
    };

    const handleSave = () => {
        onClose();
    };

    const handleChatSelect = (chatIndex: number) => {
        setSelectedChat(chatIndex);
    };

    return (
        <Flex w="100%" h="95vh" justify="center" align="center">
            <Flex w="21%" h="95vh" bg="gray.200">
                {/* Chat Select Panel Content */}
                <VStack
                    divider={<StackDivider />}
                    p={4}
                    width="100%"
                    maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
                    alignItems="stretch"
                    bg="gray.100"
                >
                    {chatrooms.map((rooms, index) => (
                        <HStack
                            key={rooms.id}
                            onClick={() => handleChatSelect(index)}
                            style={{
                                cursor: "pointer",
                                fontWeight: index === selectedChat ? "bold" : "normal",
                            }}
                        >
                            <HiChatAlt2 />
                            <Text fontSize='2xl'>{rooms.name}</Text>
                            <Spacer />
                            <IconButton
                                icon={<FaEdit />}
                                isRound={true}
                                onClick={() => handleEdit(index)}
                                aria-label={""}
                            />
                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Rename Chat Room</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={6}>
                                        <FormControl>
                                            {/* <FormLabel>Edit</FormLabel> */}
                                            <Input
                                                placeholder="Edit"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
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
                                icon={<FaTrash />}
                                isRound={true} aria-label={""}                                //onClick={() => deleteTodos(item.id)} aria-label={""}                        
                            />
                        </HStack>
                    ))}
                </VStack>
            </Flex>
            <Flex w="5px" h="95vh"></Flex>
            <Flex w="79%" h="95vh">
                <Flex w="98%" h="98%" flexDir="column" mt={2}>
                    <ChatHeader />
                    <Divider />
                    <Messages messages={messages} />
                    <Divider />
                    <Footer
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        handleSendMessage={handleSendMessage}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Chat;