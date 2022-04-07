import React from "react";
import { Outlet } from "react-router";
import { Box, Flex, Link, useColorModeValue } from "@chakra-ui/react";

import unidiffLogo from "../../assets/png/unidiff_logo.png";

const AuthLayout = () => {
  return (
    <Box bg={useColorModeValue("gray.50", "gray.800")}>
      <Box maxW="100%" display={"flex"} justifyContent={"center"}>
        <Box maxW="5xl" flexGrow={1} pt={1} pb={1}>
          <Flex
            bg={useColorModeValue("gray.50", "gray.800")}
            color={useColorModeValue("gray.600", "white")}
            minH={"60px"}
            py={{ base: 2 }}
            px={{ base: 4 }}
            align={"center"}
          >
            <Flex
              flex={{ base: 1 }}
              justify={{ base: "center", md: "start" }}
              alignItems="center"
            >
              <Link href="/">
                <img
                  draggable="false"
                  style={{
                    pointerEvents: "none",
                  }}
                  src={unidiffLogo}
                  alt="unidiff logo"
                />
              </Link>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
