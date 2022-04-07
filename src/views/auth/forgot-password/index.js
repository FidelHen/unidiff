import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  return (
    <Box
      style={{ minHeight: "calc(100vh - 78px)" }}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Flex minH={"80vh"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Forgot your password?</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              No worries, we can email you a reset link
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" />
              </FormControl>
              <Stack spacing={5}>
                <Button
                  bg={"green.400"}
                  color={"white"}
                  _hover={{
                    bg: "green.500",
                  }}
                >
                  Request reset link
                </Button>
                <Text color={"gray.600"} align={"center"}>
                  <Link color={"green.400"} href="/auth/sign-in">
                    Sign in
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

export default ForgotPassword;
