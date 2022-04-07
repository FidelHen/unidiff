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

const SignIn = () => {
  return (
    <Box
      style={{ minHeight: "calc(100vh - 78px)" }}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Flex minH={"80vh"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Welcome back 🏠</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              Glad you’re back, please enter your details below
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
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" />
              </FormControl>
              <Stack spacing={10}>
                <Link href="/auth/forgot-password" color={"green.400"}>
                  Forgot password?
                </Link>
              </Stack>
              <Stack spacing={5}>
                <Button
                  bg={"green.400"}
                  color={"white"}
                  _hover={{
                    bg: "green.500",
                  }}
                >
                  Sign in
                </Button>
                <Text color={"gray.600"} align={"center"}>
                  Don't have an account?{" "}
                  <Link color={"green.400"} href="/auth/sign-up">
                    Sign up for free!
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

export default SignIn;
