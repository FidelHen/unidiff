import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Heading,
  Text,
  Textarea,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  NumberInput,
  NumberInputField,
  Link,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import {
  doc,
  collection,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  increment,
  Timestamp,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import collegeData from "../../../data/college-data/index";
import collegeMajors from "../../../data/college-majors/index";
import { db } from "../../../utils/firebase";
const WriteUniReview = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const auth = getAuth();
  const toast = useToast();
  const { uni_id } = useParams();
  let navigate = useNavigate();
  var currentTime = new Date();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        onOpen();
      }
    });
  }, [auth, onOpen]);

  return (
    <Flex minH={"80vh"} align={"center"} justify={"center"}>
      <Stack spacing={2} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Write review ✍️
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Thanks for writing a review for your university
          </Text>
        </Stack>
        <Box rounded={"lg"} p={8}>
          <Formik
            initialValues={{
              university: uni_id
                .split("_")
                .map((val) => {
                  // Upper case first letter of each word
                  return val.charAt(0).toUpperCase() + val.slice(1);
                })
                .join(" "),
              major: "",
              year_of_class: 0,
              coursework: 2,
              counselors: 2,
              vibe: 2,
              food: 2,
              description: "",
            }}
            onSubmit={async (values, actions) => {
              const userTuitionSubmissionQuery = query(
                collection(db, "tuition"),
                where("uni_id", "==", uni_id),
                where("created_by", "==", auth.currentUser.uid)
              );
              const userTuitionSubmissionDocs = await getDocs(
                userTuitionSubmissionQuery
              );

              if (userTuitionSubmissionDocs.docs.length !== 0) {
                const dateTimestamp = new Date(Timestamp.now().seconds * 1000);
                let userAverage =
                  (values.food +
                    values.vibe +
                    values.counselors +
                    values.coursework) /
                  4;

                const userUid = auth.currentUser.uid;
                const schoolId = uni_id;

                const batch = writeBatch(db);
                const schoolDocRef = doc(db, "schools", schoolId);
                const schoolReviewsRef = doc(
                  collection(db, "schools", schoolId, "reviews")
                );

                const userDocRef = doc(db, "users", userUid);

                const schoolDoc = await getDoc(schoolDocRef);

                batch.set(schoolReviewsRef, {
                  created: serverTimestamp(),
                  created_unix: dateTimestamp.valueOf(),
                  created_by: userUid,
                  review: userAverage,
                  ...values,
                });

                let reviewAverage = schoolDoc.data().reviews_average ?? 1;
                let reviewCount = schoolDoc.data().reviews_count ?? 1;

                const newReviewAverage =
                  (reviewAverage * reviewCount + userAverage) /
                  (reviewCount + 1);

                batch.set(
                  schoolDocRef,
                  {
                    reviews_average: schoolDoc.data().reviews_average
                      ? newReviewAverage
                      : userAverage,
                    reviews_count: increment(1),
                  },
                  { merge: true }
                );

                batch.set(
                  userDocRef,
                  {
                    reviews: arrayUnion(schoolReviewsRef.id),
                  },
                  { merge: true }
                );

                await batch
                  .commit()
                  .then(() => {
                    actions.setSubmitting(false);
                    navigate(`/universities/view/${uni_id}`, { replace: true });
                    toast({
                      title: "Submitted review",
                      description:
                        "You have successfully submitted your review",
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
            }}
          >
            {(props) => (
              <Form>
                <Stack spacing={4}>
                  <Field name="university">
                    {() => (
                      <FormControl isRequired isDisabled={true}>
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
                            value={props.values.university}
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

                  <Field name="year_of_class">
                    {() => (
                      <FormControl id="year_of_class" isRequired>
                        <FormLabel htmlFor="year_of_class">
                          Year of class
                        </FormLabel>
                        <NumberInput
                          min={2000}
                          max={currentTime.getFullYear() + 12}
                          allowMouseWheel
                          name="year_of_class"
                          onChange={(value) =>
                            props.setFieldValue(
                              "year_of_class",
                              parseInt(value)
                            )
                          }
                        >
                          <NumberInputField bg={"gray.50"} border={0} />
                        </NumberInput>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="coursework">
                    {() => (
                      <FormControl isRequired>
                        <FormLabel htmlFor="coursework">
                          Coursework related to major was:
                        </FormLabel>
                        <Slider
                          defaultValue={3}
                          min={1}
                          max={5}
                          step={1}
                          onChange={(val) => {
                            props.setFieldValue("coursework", val);
                          }}
                        >
                          <SliderTrack>
                            <Box position="relative" right={10} />
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={5} />
                          <SliderMark value={1} mt="3" ml="-3" fontSize="sm">
                            Poor
                          </SliderMark>
                          <SliderMark value={3} mt="3" ml="-6" fontSize="sm">
                            Average
                          </SliderMark>
                          <SliderMark value={5} mt="3" ml="-7" fontSize="sm">
                            Amazing
                          </SliderMark>
                        </Slider>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="counselors">
                    {() => (
                      <FormControl isRequired>
                        <FormLabel mt={4} htmlFor="counselors">
                          Guidance counselors were:
                        </FormLabel>
                        <Slider
                          defaultValue={3}
                          min={1}
                          max={5}
                          step={1}
                          onChange={(val) => {
                            props.setFieldValue("counselors", val);
                          }}
                        >
                          <SliderTrack>
                            <Box position="relative" right={10} />
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={5} />
                          <SliderMark value={1} mt="3" ml="-3" fontSize="sm">
                            Poor
                          </SliderMark>
                          <SliderMark value={3} mt="3" ml="-6" fontSize="sm">
                            Average
                          </SliderMark>
                          <SliderMark value={5} mt="3" ml="-7" fontSize="sm">
                            Amazing
                          </SliderMark>
                        </Slider>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="vibe">
                    {() => (
                      <FormControl isRequired>
                        <FormLabel mt={4} htmlFor="vibe">
                          School vibe was:
                        </FormLabel>
                        <Slider
                          defaultValue={3}
                          min={1}
                          max={5}
                          step={1}
                          onChange={(val) => {
                            props.setFieldValue("vibe", val);
                          }}
                        >
                          <SliderTrack>
                            <Box position="relative" right={10} />
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={5} />
                          <SliderMark value={1} mt="3" ml="-3" fontSize="sm">
                            Poor
                          </SliderMark>
                          <SliderMark value={3} mt="3" ml="-6" fontSize="sm">
                            Average
                          </SliderMark>
                          <SliderMark value={5} mt="3" ml="-7" fontSize="sm">
                            Amazing
                          </SliderMark>
                        </Slider>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="food">
                    {() => (
                      <FormControl isRequired>
                        <FormLabel mt={4} htmlFor="food">
                          Food was:
                        </FormLabel>
                        <Slider
                          defaultValue={3}
                          min={1}
                          max={5}
                          step={1}
                          onChange={(val) => {
                            props.setFieldValue("food", val);
                          }}
                        >
                          <SliderTrack>
                            <Box position="relative" right={10} />
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={5} />
                          <SliderMark value={1} mt="3" ml="-3" fontSize="sm">
                            Poor
                          </SliderMark>
                          <SliderMark value={3} mt="3" ml="-6" fontSize="sm">
                            Average
                          </SliderMark>
                          <SliderMark value={5} mt="3" ml="-7" fontSize="sm">
                            Amazing
                          </SliderMark>
                        </Slider>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="description">
                    {() => (
                      <FormControl id="description" isRequired>
                        <FormLabel mt={4} htmlFor="description">
                          Description
                        </FormLabel>
                        <Textarea
                          onChange={(e) => {
                            props.setFieldValue("description", e.target.value);
                          }}
                          minLength={15}
                          placeholder="Tell us how was your experience?"
                        />
                      </FormControl>
                    )}
                  </Field>

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
              <AlertDialogHeader>
                Consider submitting your tuition 🌟
              </AlertDialogHeader>
              <AlertDialogBody>
                In order to ensure Unidiff's integrity we make sure all of our
                submissions are from students that attended this university.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Link href="/add-tuition">
                  <Button colorScheme="green" ml={3}>
                    Submit tuition
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

export default WriteUniReview;
