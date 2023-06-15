import { Button, Flex, Heading, Input, } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Flex height="80vh" alignItems="center" justifyContent="center">
      <Flex direction="column" width="25vw" background="gray.100" padding={6} rounded={6}>
+        <Heading mb={6}>Hello!</Heading>
+        <Input placeholder="sample@sample.com" variant="outline" mb={3} type="email" />
+        <Input placeholder="********" variant="outline" mb={6} type="password" />
         <Button mb={6} colorScheme="teal">Sign-in</Button>
      </Flex>
    </Flex>
  )
}

// width 100vW