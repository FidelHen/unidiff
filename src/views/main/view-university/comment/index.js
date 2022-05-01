import React from "react";
import { Box, Text, Divider, Avatar, Tag, Wrap } from "@chakra-ui/react";

const Comment = ({ data }) => {
  const ratings = {
    1: "Poor",
    2: "Okay",
    3: "Average",
    4: "Good",
    5: "Amazing",
  };
  return (
    <Box>
      <Box w={"100%"} p={3} mt={6} display={"flex"}>
        <Avatar
          src={`https://avatars.dicebear.com/api/micah/:${data.created_by}.svg`}
          bg={"blue.400"}
        />
        <Box flexGrow={1} ml={2}>
          <Box display={"flex"} justifyContent="space-between">
            <Box display={"flex"} flexGrow={1}>
              <Text mr={2} fontWeight={"bold"}>
                Class of {data.year_of_class}
              </Text>
              <Tag variant={"outline"} colorScheme="green" mr={2}>
                {data.review}/5
              </Tag>
              <Tag variant={"outline"} colorScheme="blue">
                {data.major}
              </Tag>
            </Box>
            <Text fontWeight={"bold"} fontSize="sm">
              {new Date(data.created_unix).toDateString()}
            </Text>
          </Box>

          <Wrap mt={2} mb={2}>
            <Tag>{ratings[data.coursework]} related classes</Tag>
            <Tag>{ratings[data.counselors]} guidance counselors</Tag>
            <Tag>{ratings[data.vibe]} vibes</Tag>
            <Tag>{ratings[data.food]} food</Tag>
          </Wrap>

          <Text fontSize={"sm"}>{data.description}</Text>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default Comment;
