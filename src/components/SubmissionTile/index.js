/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import {
  Box,
  useColorModeValue,
  Heading,
  Text,
  Button,
  Link,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const SubmissionTile = ({ isAddButton }) => {
  if (isAddButton) {
    return (
      <Box height="80px" boxShadow={"sm"} rounded={"md"}>
        <Link href={"/add-tuition"}>
          <Button
            display={"flex"}
            height={"80px"}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            color={"white"}
            bg={"green.400"}
            _hover={{
              bg: "green.500",
            }}
            boxShadow={"lg"}
          >
            <AddIcon w={3} h={3} />
            <Heading as="h6" pl={2} size="xs">
              Add your tuition
            </Heading>
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.800")}
      height="80px"
      boxShadow={"sm"}
      rounded={"md"}
    >
      <Box
        display={"flex"}
        height={"80px"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Text fontSize="14">UNC at Charlotte</Text>
        <Heading as="h6" size="xs">
          $12,000 / year
        </Heading>
        <Text fontSize="12px" color={useColorModeValue("gray.500", "gray.800")}>
          5 minutes ago
        </Text>
      </Box>
    </Box>
  );
};

export default SubmissionTile;
