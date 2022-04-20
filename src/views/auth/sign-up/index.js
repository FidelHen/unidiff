import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { auth } from "../../../utils/firebase";

const SignUp = ({ isAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  let navigate = useNavigate();

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
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Create account 🎉
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              College doesn’t have to be intimidating
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
                firstName: "",
                lastName: "",
                email: "",
                password: "",
              }}
              onSubmit={(values, actions) => {
                createUserWithEmailAndPassword(
                  auth,
                  values.email,
                  values.password
                )
                  .then(async (userCredentials) => {
                    await userCredentials.user.updateProfile({
                      displayName: "Frank S. Andrew",
                    });
                    actions.setSubmitting(false);
                    navigate("/", { replace: true });
                    toast({
                      title: "Account created",
                      description: "We've created your account for you",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      position: "top-right",
                    });
                  })
                  .catch((error) => {
                    actions.setSubmitting(false);
                    toast({
                      title: "Error",
                      description: "Something went wrong, please try again",
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
                    <HStack>
                      <Box>
                        <Field name="firstName">
                          {({ field }) => (
                            <FormControl isRequired>
                              <FormLabel htmlFor="firstName">
                                First Name
                              </FormLabel>
                              <Input {...field} type="text" name="firstName" />
                            </FormControl>
                          )}
                        </Field>
                      </Box>
                      <Box>
                        <Field name="lastName">
                          {({ field }) => (
                            <FormControl isRequired>
                              <FormLabel>Last Name</FormLabel>
                              <Input {...field} type="text" name="lastName" />
                            </FormControl>
                          )}
                        </Field>
                      </Box>
                    </HStack>
                    <Field name="email">
                      {({ field }) => (
                        <FormControl isRequired>
                          <FormLabel>Email address</FormLabel>
                          <Input {...field} name="email" type="email" />
                        </FormControl>
                      )}
                    </Field>

                    <Field name="password">
                      {({ field }) => (
                        <FormControl isRequired>
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              name="password"
                            />
                            <InputRightElement h={"full"}>
                              <Button
                                variant={"ghost"}
                                onClick={() =>
                                  setShowPassword(
                                    (showPassword) => !showPassword
                                  )
                                }
                              >
                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>

                    <Stack spacing={5} pt={2}>
                      <Button
                        loadingText="Creating account..."
                        size="lg"
                        bg={"green.400"}
                        color={"white"}
                        _hover={{
                          bg: "green.500",
                        }}
                        type="submit"
                        isLoading={props.isSubmitting}
                      >
                        Sign up
                      </Button>
                      <Text align={"center"}>
                        Already a user?{" "}
                        <Link color={"green.400"} href="/auth/sign-in">
                          Login
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

export default SignUp;
