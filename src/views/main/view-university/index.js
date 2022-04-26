import { Box, useColorModeValue, Heading } from "@chakra-ui/react";
import React from "react";

const ViewUniversity = () => {
  return (
    <>
      <Box
        maxW={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        pt={4}
      >
        <Box maxW={"100%"} display={"flex"} justifyContent={"center"} pb={2}>
          <Box maxW="6xl" flexGrow={1} pl={4} pr={4} pt={1} pb={1}>
            <Heading as="h2" size="xl" pt={4}>
              University of North Carolina at Charlotte
            </Heading>
            <Heading
              as="h4"
              size="md"
              color={useColorModeValue("gray.400", "gray.800")}
              pt={1}
            >
              Charlotte, NC
            </Heading>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ViewUniversity;
