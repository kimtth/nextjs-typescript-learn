import { Box, Heading } from '@chakra-ui/react';
import Link from 'next/link';

export default function Header() {
    return (
        <Box as="header" background="teal.500" color="white" py={1} textAlign="left" padding={4}>
            <Heading size="sm">Header</Heading>
        </Box>
    );
};