import React, { useState } from "react";
import { Button, useDisclosure, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

const EditeChat = () => {
    const { isOpen, onClose } = useDisclosure();
    const [chatRoomName, setChatRoomName] = useState("");

    const handleSave = () => {
        onClose();
    };

    return (
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
                            value={chatRoomName}
                            onChange={(e) => setChatRoomName(e.target.value)}
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
    );
};

export default EditeChat;