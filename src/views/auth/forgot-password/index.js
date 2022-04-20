import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
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

const ForgotPassword = ({ isAuthenticated }) => {
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
            <Formik
              initialValues={{
                email: "",
              }}
              onSubmit={(values, actions) => {
                sendPasswordResetEmail(auth, values.email)
                  .then(() => {
                    actions.setSubmitting(false);
                    navigate("/auth/sign-in", { replace: true });
                    toast({
                      title: "Success",
                      description: "Password reset email sent",
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
                      description: "Password reset email failed",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
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
                    <Stack spacing={5}>
                      <Button
                        loadingText="Sending reset email..."
                        bg={"green.400"}
                        color={"white"}
                        _hover={{
                          bg: "green.500",
                        }}
                        isLoading={props.isSubmitting}
                        type="submit"
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
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

export default ForgotPassword;
