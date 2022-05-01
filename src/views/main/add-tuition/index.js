import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  NumberInputField,
  NumberInput,
  Select,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Link,
  useToast,
  FormHelperText,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";
import {
  doc,
  collection,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  increment,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import collegeData from "../../../data/college-data/index";
import collegeMajors from "../../../data/college-majors/index";
import { db } from "../../../utils/firebase";

const AddTuition = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const auth = getAuth();
  const toast = useToast();
  let navigate = useNavigate();
  const formatSemester = (val) => `$` + val;
  var currentTime = new Date();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        onOpen();
      }
    });
  }, [auth, onOpen]);

  const paymentHelp = [
    {
      value: "Personal Savings",
      label: "Personal Savings 💰",
    },
    {
      value: "Family",
      label: "Family 👪",
    },
    {
      value: "Loans",
      label: "Loans 🏦",
    },
    {
      value: "Fafsa",
      label: "Fafsa 🤲",
    },
    {
      value: "Scholarships",
      label: "Scholarships ✉️",
    },
  ];

  return (
    <Flex minH={"80vh"} align={"center"} justify={"center"}>
      <Stack spacing={2} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Add tuition 🎒
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Thanks for passing information to your younger self
          </Text>
        </Stack>
        <Box rounded={"lg"} p={8}>
          <Formik
            initialValues={{
              university: "",
              major: "",
              cost_per_semester: "",
              paid_per_semester: "",
              help_pay_with: [],
              household_income: "",
              year: 0,
              semester: "",
              school_gpa: "",
              in_state: "",
              on_campus: "",
            }}
            onSubmit={async (values, actions) => {
              if (values.cost_per_semester > values.paid_per_semester) {
                if (auth.currentUser) {
                  const dateTimestamp = new Date(
                    Timestamp.now().seconds * 1000
                  );

                  const userUid = auth.currentUser.uid;
                  const schoolId = values.university
                    .toLowerCase()
                    .split(" ")
                    .join("_");

                  const batch = writeBatch(db);
                  const tuitionDocRef = doc(collection(db, "tuition"));
                  const schoolDocRef = doc(db, "schools", schoolId);
                  const schoolMonthlyTuitionDocRef = doc(
                    db,
                    "schools",
                    schoolId,
                    "monthly_tuition",
                    `${dateTimestamp.getMonth()}, ${dateTimestamp.getFullYear()}`
                  );
                  const userDocRef = doc(db, "users", userUid);

                  const tuitionData = {
                    created_by: userUid,
                    ...values,
                  };

                  batch.set(tuitionDocRef, {
                    created: serverTimestamp(),
                    created_by: userUid,
                    created_unix: dateTimestamp.valueOf(),
                    uni_id: schoolId,
                    ...tuitionData,
                  });

                  batch.set(
                    schoolDocRef,
                    {
                      uni_name: values.university,
                      uni_id: schoolId,
                      last_tuition_submission: serverTimestamp(),
                      tuition_submissions: arrayUnion(tuitionDocRef.id),
                      tuition_submission_count: increment(1),
                    },
                    { merge: true }
                  );

                  batch.set(
                    schoolMonthlyTuitionDocRef,
                    {
                      last_tuition_submission: serverTimestamp(),
                      tuition_submissions: arrayUnion({
                        created: Timestamp.now(),
                        ...tuitionData,
                      }),
                      tuition_submission_count: increment(1),
                      year: dateTimestamp.getFullYear().toString(),
                      month: dateTimestamp.getMonth().toString(),
                    },
                    { merge: true }
                  );

                  batch.set(
                    userDocRef,
                    {
                      last_tuition_submission: serverTimestamp(),
                      tuition_submissions: arrayUnion(tuitionDocRef.id),
                      tuition_submission_count: increment(1),
                    },
                    { merge: true }
                  );

                  await batch
                    .commit()
                    .then(() => {
                      actions.setSubmitting(false);
                      navigate("/", { replace: true });
                      toast({
                        title: "Submitted tuition",
                        description:
                          "You have successfully submitted your tuition",
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
                        description: "Something went wrong, please try again",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top-right",
                      });
                    });
                } else {
                  onOpen();
                }
              } else {
                actions.setSubmitting(false);
                toast({
                  title: "Invalid input",
                  description:
                    "Tuition per semester cannot be less than paid per semester",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "top-right",
                });
              }

              actions.setSubmitting(false);
            }}
          >
            {(props) => (
              <Form>
                <Stack spacing={4}>
                  <Field name="university">
                    {() => (
                      <FormControl isRequired>
                        <FormLabel htmlFor="university">University</FormLabel>
                        <AutoComplete
                          openOnFocus
                          maxSuggestions={5}
                          onChange={(value) => {
                            props.setFieldValue("university", value);
                          }}
                        >
                          <AutoCompleteInput
                            bg={"gray.50"}
                            border={0}
                            autoComplete="off"
                            name="university"
                          />
                          <AutoCompleteList>
                            {collegeData.map((school) => {
                              return (
                                <AutoCompleteItem
                                  key={`option-${school.college_name}`}
                                  value={school.college_name}
                                  textTransform="capitalize"
                                >
                                  {school.college_name}
                                </AutoCompleteItem>
                              );
                            })}
                          </AutoCompleteList>
                        </AutoComplete>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="major">
                    {() => (
                      <FormControl isRequired>
                        <FormLabel htmlFor="major">Major</FormLabel>
                        <AutoComplete
                          openOnFocus
                          maxSuggestions={5}
                          onChange={(value) => {
                            props.setFieldValue("major", value);
                          }}
                        >
                          <AutoCompleteInput
                            bg={"gray.50"}
                            border={0}
                            autoComplete="off"
                            name="major"
                          />
                          <AutoCompleteList>
                            {collegeMajors.map((major) => {
                              return (
                                <AutoCompleteItem
                                  key={`option-${major.Major}`}
                                  value={major.Major.toLowerCase()
                                    .split(" ")
                                    .map(
                                      (s) =>
                                        s.charAt(0).toUpperCase() +
                                        s.substring(1)
                                    )
                                    .join(" ")}
                                  textTransform="capitalize"
                                >
                                  {major.Major.toLowerCase()}
                                </AutoCompleteItem>
                              );
                            })}
                          </AutoCompleteList>
                        </AutoComplete>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="cost_per_semester">
                    {() => (
                      <FormControl id="cost_per_semester" isRequired>
                        <FormLabel htmlFor="cost_per_semester">
                          Cost per semester
                        </FormLabel>
                        <NumberInput
                          name="cost_per_semester"
                          onChange={(value) =>
                            props.setFieldValue(
                              "cost_per_semester",
                              parseFloat(value)
                            )
                          }
                          value={formatSemester(props.values.cost_per_semester)}
                          min={0}
                        >
                          <NumberInputField bg={"gray.50"} border={0} />
                        </NumberInput>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="paid_per_semester">
                    {() => (
                      <FormControl id="paid_per_semester" isRequired>
                        <FormLabel htmlFor="paid_per_semester">
                          Paid per semester
                        </FormLabel>
                        <NumberInput
                          name="paid_per_semester"
                          onChange={(value) =>
                            props.setFieldValue(
                              "paid_per_semester",
                              parseFloat(value)
                            )
                          }
                          value={formatSemester(props.values.paid_per_semester)}
                          min={0}
                        >
                          <NumberInputField bg={"gray.50"} border={0} />
                        </NumberInput>
                        <FormHelperText>
                          After Fafsa and Scholarships
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="help_pay_with">
                    {() => (
                      <FormControl isRequired>
                        <FormLabel htmlFor="help_pay_with">
                          Helped pay with
                        </FormLabel>
                        <AutoComplete
                          openOnFocus
                          multiple
                          onChange={(value) => {
                            props.setFieldValue("help_pay_with", value);
                          }}
                        >
                          <AutoCompleteInput
                            bg={"gray.50"}
                            border={0}
                            autoComplete="off"
                          >
                            {({ tags }) =>
                              tags.map((tag, tid) => (
                                <AutoCompleteTag
                                  key={tid}
                                  label={tag.label}
                                  onRemove={tag.onRemove}
                                />
                              ))
                            }
                          </AutoCompleteInput>
                          <AutoCompleteList>
                            {paymentHelp.map((method, cid) => (
                              <AutoCompleteItem
                                key={`option-${cid}`}
                                value={method.value}
                                textTransform="capitalize"
                              >
                                {method.label}
                              </AutoCompleteItem>
                            ))}
                          </AutoCompleteList>
                        </AutoComplete>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="household_income">
                    {() => (
                      <FormControl id="household_income" isRequired>
                        <FormLabel htmlFor="household_income">
                          Household income
                        </FormLabel>
                        <Select
                          placeholder="Select range"
                          bg={"gray.50"}
                          border={0}
                          onChange={(e) =>
                            props.setFieldValue(
                              "household_income",
                              e.target.value
                            )
                          }
                          value={props.values.household_income}
                          name="household_income"
                        >
                          <option value="lowest">{"$0 < $35,000"}</option>
                          <option value="lower_middle">
                            {"$35,000 < $50,000"}
                          </option>
                          <option value="middle">{"$50,000 < $125,000"}</option>
                          <option value="upper_middle">
                            {"$125,000 < $188,000"}
                          </option>
                          <option value="upper">{"$188,000 and up"}</option>
                        </Select>
                      </FormControl>
                    )}
                  </Field>

                  <HStack>
                    <Field name="year">
                      {() => (
                        <FormControl id="year" isRequired>
                          <FormLabel htmlFor="year">Year</FormLabel>
                          <NumberInput
                            max={currentTime.getFullYear()}
                            min={2000}
                            allowMouseWheel
                            name="year"
                            onChange={(value) =>
                              props.setFieldValue("year", parseInt(value))
                            }
                          >
                            <NumberInputField bg={"gray.50"} border={0} />
                          </NumberInput>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="semester">
                      {() => (
                        <FormControl id="semester" isRequired>
                          <FormLabel htmlFor="semester">Semester</FormLabel>
                          <Select
                            placeholder="Select option"
                            bg={"gray.50"}
                            border={0}
                            onChange={(e) =>
                              props.setFieldValue("semester", e.target.value)
                            }
                            name="semester"
                          >
                            <option value={"fall"}>Fall</option>
                            <option value={"spring"}>Spring</option>
                            <option value={"summer"}>Summer</option>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                  </HStack>
                  <Field name="school_gpa">
                    {() => (
                      <FormControl id="school_gpa" isRequired>
                        <FormLabel htmlFor="school_gpa">
                          High school or College GPA
                        </FormLabel>
                        <NumberInput
                          max={6}
                          step={0.01}
                          min={0}
                          allowMouseWheel
                          name="school_gpa"
                          onChange={(value) =>
                            props.setFieldValue("school_gpa", parseFloat(value))
                          }
                        >
                          <NumberInputField bg={"gray.50"} border={0} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    )}
                  </Field>
                  <HStack>
                    <Field name="in_state">
                      {() => (
                        <FormControl id="in_state" isRequired>
                          <FormLabel htmlFor="in_state">In state?</FormLabel>
                          <Select
                            placeholder="Select option"
                            bg={"gray.50"}
                            border={0}
                            onChange={(e) =>
                              props.setFieldValue(
                                "in_state",
                                JSON.parse(e.target.value)
                              )
                            }
                            name="in_state"
                          >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </Select>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="on_campus">
                      {() => (
                        <FormControl id="on_campus" isRequired>
                          <FormLabel htmlFor="on_campus">On campus?</FormLabel>
                          <Select
                            placeholder="Select option"
                            bg={"gray.50"}
                            border={0}
                            name="on_campus"
                            value={props.values.on_campus}
                            onChange={(e) => {
                              props.setFieldValue(
                                "on_campus",
                                JSON.parse(e.target.value)
                              );
                            }}
                          >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                  </HStack>
                  <Stack spacing={5} pt={2}>
                    <Button
                      loadingText="Submitting..."
                      size="lg"
                      bg={"green.400"}
                      color={"white"}
                      _hover={{
                        bg: "green.500",
                      }}
                      disabled={!auth.currentUser}
                      type="submit"
                      isLoading={props.isSubmitting}
                    >
                      {!auth.currentUser ? "Login to submit" : "Submit"}
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
          >
            <AlertDialogOverlay />

            <AlertDialogContent>
              <AlertDialogHeader>Consider signing up 🌟</AlertDialogHeader>
              <AlertDialogBody>
                In order to ensure Unidiff's integrity we make sure all of our
                submissions are from registered users.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Link href="/auth/sign-up">
                  <Button colorScheme="green" ml={3}>
                    Sign up
                  </Button>
                </Link>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Box>
      </Stack>
    </Flex>
  );
};

export default AddTuition;
