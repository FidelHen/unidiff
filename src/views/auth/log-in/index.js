import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { Field, Form, Formik } from "formik";
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
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

const SignIn = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  });

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
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={(values, actions) => {
                signInWithEmailAndPassword(auth, values.email, values.password)
                  .then(() => {
                    actions.setSubmitting(false);
                    navigate("/", { replace: true });
                    toast({
                      title: "Success",
                      description: "You have successfully signed in",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      position: "top-right",
                    });
                  })
                  .catch(() => {
                    actions.setSubmitting(false);
                    toast({
                      title: "Error",
                      description: "Password or email is incorrect",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                      position: "top-right",
                    });
                  });
              }}
            >
              {(props) => (
                <Form>
                  <Stack spacing={4}>
                    <Field name="email">
                      {({ field }) => (
                        <FormControl isRequired>
                          <FormLabel htmlFor="email">Email address</FormLabel>
                          <Input {...field} type="email" name="email" />
                        </FormControl>
                      )}
                    </Field>

                    <Field name="password">
                      {({ field }) => (
                        <FormControl isRequired>
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Input {...field} type="password" name="password" />
                        </FormControl>
                      )}
                    </Field>

                    <Stack spacing={10}>
                      <Link href="/auth/forgot-password" color={"green.400"}>
                        Forgot password?
                      </Link>
                    </Stack>
                    <Stack spacing={5}>
                      <Button
                        loadingText="Signing in..."
                        bg={"green.400"}
                        color={"white"}
                        _hover={{
                          bg: "green.500",
                        }}
                        type="submit"
                        isLoading={props.isSubmitting}
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
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

export default SignIn;
