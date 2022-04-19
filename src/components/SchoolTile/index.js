import React from "react";
import { Box, useColorModeValue, Heading, Text } from "@chakra-ui/react";

const SchoolTile = () => {
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
        <Heading as="h6" size="sm">
          Duke University
        </Heading>
        <Text fontSize="14px" color={useColorModeValue("gray.500", "gray.800")}>
          $25,000 / semester
        </Text>
      </Box>
    </Box>
  );
};

export default SchoolTile;
