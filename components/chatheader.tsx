import React from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";

const ChatHeader = () => {
    return (
        <Flex w="100%">
            <Avatar size="sm" name="Azure" src="./azure.png">
                <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Flex flexDirection="column" mx="5" justify="center">
                <Text fontSize="lg" fontWeight="bold">
                    Azure OpenAI ChatGPT
                </Text>
                <Text color="green.500">Online</Text>
            </Flex>
        </Flex>
    );
};

export default ChatHeader;