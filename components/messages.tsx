import React, { useEffect, useRef } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";

interface Message {
    id: string,
    from: string;
    text: string;
}

interface MessagesProps {
    messages: Message[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
    const AlwaysScrollToBottom: React.FC = () => {
        const elementRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
            if (elementRef.current) {
                elementRef.current.scrollIntoView();
            }
        });

        return <div ref={elementRef} />;
    };

    return (
        <Flex w="100%" h="98%" overflowY="scroll" flexDirection="column" p="3">
            {messages.map((item, index) => {
                if (item.from === "me") {
                    return (
                        <Flex key={item.id} w="100%" justify="flex-end">
                            <Flex
                                bg="blue.100"
                                minW="100px"
                                maxW="450px"
                                my="1"
                                p="3"
                                borderRadius="15px"
                            >
                                <Text>{item.text}</Text>
                            </Flex>
                        </Flex>
                    );
                } else {
                    return (
                        <Flex key={item.id} w="100%">
                            <Avatar
                                name="Computer"
                                src="./octocat.png"
                                bg="blue.300"
                            ></Avatar>
                            <Flex
                                bg="gray.100"
                                color="black"
                                minW="100px"
                                maxW="450px"
                                my="1"
                                p="3"
                                borderRadius="15px"
                            >
                                <Text>{item.text}</Text>
                            </Flex>
                        </Flex>
                    );
                }
            })}
            <AlwaysScrollToBottom />
        </Flex>
    );
};

export default Messages;