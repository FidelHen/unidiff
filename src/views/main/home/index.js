import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import ContentTitle from "./ContentTitle";
import SubmissionTile from "../../../components/SubmissionTile";
import SchoolTile from "../../../components/SchoolTile";

const Home = () => {
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
          <ContentTitle title={"Recent Submission"} />
        </Box>
        <Box maxW={"100%"} display={"flex"} justifyContent={"center"}>
          <Box maxW="6xl" flexGrow={1}>
            <SimpleGrid columns={5} spacing={4} minChildWidth={"50px"}>
              <SubmissionTile isAddButton={true} />
              <SubmissionTile />
              <SubmissionTile />
              <SubmissionTile />
              <SubmissionTile />
            </SimpleGrid>
          </Box>
        </Box>

        <Box
          maxW={"100%"}
          display={"flex"}
          justifyContent={"center"}
          pt={2}
          pb={2}
        >
          <ContentTitle title={"Universities near you"} />
        </Box>
        <Box maxW={"100%"} display={"flex"} justifyContent={"center"}>
          <Box maxW="6xl" flexGrow={1}>
            <SimpleGrid columns={5} spacing={4} minChildWidth={"50px"}>
              <SchoolTile />
              <SchoolTile />
              <SchoolTile />
              <SchoolTile />
              <SchoolTile />
            </SimpleGrid>
          </Box>
        </Box>

        <Box
          maxW={"100%"}
          display={"flex"}
          justifyContent={"center"}
          pt={2}
          pb={2}
        >
          <ContentTitle title={"Compare schools"} />
        </Box>
      </Box>
    </>
  );
};

export default Home;
