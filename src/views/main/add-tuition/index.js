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
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import React, { useState } from "react";
import collegeData from "../../../data/college-data/index";
import collegeMajors from "../../../data/college-majors/index";

const AddTuition = () => {
  const [semesterCost, setSemesterCost] = useState("");
  const formatSemester = (val) => `$` + val;
  const parseSemester = (val) => val.replace(/^\$/, "");
  var currentTime = new Date();

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
          <Stack spacing={4}>
            <FormControl id="university" isRequired>
              <FormLabel>University</FormLabel>
              <AutoComplete maxSuggestions={5}>
                <AutoCompleteInput
                  bg={"gray.50"}
                  border={0}
                  autoComplete="off"
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
            <FormControl id="major" isRequired>
              <FormLabel>Major</FormLabel>
              <AutoComplete openOnFocus maxSuggestions={20}>
                <AutoCompleteInput
                  bg={"gray.50"}
                  border={0}
                  autoComplete="off"
                />
                <AutoCompleteList>
                  {collegeMajors.map((major) => {
                    return (
                      <AutoCompleteItem
                        key={`option-${major.Major}`}
                        value={major.Major.toLowerCase()
                          .split(" ")
                          .map(
                            (s) => s.charAt(0).toUpperCase() + s.substring(1)
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
            <FormControl id="cost_per_semester" isRequired>
              <FormLabel>Cost per semester</FormLabel>
              <NumberInput
                onChange={(valueString) =>
                  setSemesterCost(parseSemester(valueString))
                }
                value={formatSemester(semesterCost)}
                min={0}
              >
                <NumberInputField bg={"gray.50"} border={0} />
              </NumberInput>
            </FormControl>
            <FormControl id="household_income" isRequired>
              <FormLabel>Household income</FormLabel>
              <Select placeholder="Select range" bg={"gray.50"} border={0}>
                <option value="lowest">{"$0 < $35,000"}</option>
                <option value="lower_middle">{"$35,000 < $50,000"}</option>
                <option value="middle">{"$50,000 < $125,000"}</option>
                <option value="upper_middle">{"$125,000 < $188,000"}</option>
                <option value="upper">{"$188,000 and up"}</option>
              </Select>
            </FormControl>
            <HStack>
              <Box>
                <FormControl id="year" isRequired>
                  <FormLabel>Year</FormLabel>
                  <NumberInput
                    max={currentTime.getFullYear()}
                    min={1950}
                    allowMouseWheel
                  >
                    <NumberInputField bg={"gray.50"} border={0} />
                  </NumberInput>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="gpa">
                  <FormLabel>High school GPA</FormLabel>
                  <NumberInput max={6} step={0.01} min={0} allowMouseWheel>
                    <NumberInputField bg={"gray.50"} border={0} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Box>
            </HStack>
            <HStack>
              <FormControl id="in_state" isRequired>
                <FormLabel>In state?</FormLabel>
                <Select placeholder="Select option" bg={"gray.50"} border={0}>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Select>
              </FormControl>
              <FormControl id="on_campus" isRequired>
                <FormLabel>On campus?</FormLabel>
                <Select placeholder="Select option" bg={"gray.50"} border={0}>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Select>
              </FormControl>
            </HStack>
            <Stack spacing={5} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"green.400"}
                color={"white"}
                _hover={{
                  bg: "green.500",
                }}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default AddTuition;
