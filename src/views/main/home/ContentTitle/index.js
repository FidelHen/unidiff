import React from "react";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";

const ContentTitle = ({ title }) => {
  return (
    <Box maxW="6xl" flexGrow={1} pl={4} pt={1} pb={1}>
      <Heading
        as="h4"
        size="md"
        pt={4}
        pb={2}
        color={useColorModeValue("gray.500", "gray.800")}
      >
        {title}
      </Heading>
    </Box>
  );
};

export default ContentTitle;
