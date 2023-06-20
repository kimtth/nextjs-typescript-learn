import React from "react";
import { Flex, Input, Button } from "@chakra-ui/react";

interface FooterProps {
    inputMessage: string;
    setInputMessage: (message: string) => void;
    handleSendMessage: () => void;
}


const Footer: React.FC<FooterProps> = ({ inputMessage, setInputMessage, handleSendMessage }) => {
    return (
        <Flex w="100%" mt="5">
            <Input
                placeholder="Type Something..."
                borderRadius="2px"
                _focus={{
                    border: "1px solid black",
                }}
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        handleSendMessage();
                    }
                }}
                marginRight="5px"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            />
            <Button
                colorScheme='messenger' size='md'
                _hover={{
                    bg: "white",
                    color: "black",
                    border: "1px solid black",
                }}
                disabled={inputMessage.trim().length <= 0}
                onClick={handleSendMessage}
            >
                Send
            </Button>
        </Flex>
    );
};

export default Footer;