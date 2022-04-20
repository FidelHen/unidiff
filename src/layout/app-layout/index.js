import React from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Collapse,
  Link,
  InputLeftElement,
  InputGroup,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import collegeData from "../../data/college-data/index";
import { HamburgerIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import unidiffLogo from "../../assets/png/unidiff_logo.png";
import { auth } from "../../utils/firebase";

const AppLayout = ({ isAuthenticated }) => {
  const { isOpen, onToggle } = useDisclosure();
  let navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <Box>
      <Box
        maxW="100%"
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.100", "gray.900")}
        display={"flex"}
        justifyContent={"center"}
      >
        <Box maxW="6xl" flexGrow={1} pt={1} pb={1}>
          <Flex
            bg={useColorModeValue("white", "gray.800")}
            color={useColorModeValue("gray.600", "white")}
            minH={"60px"}
            py={{ base: 2 }}
            px={{ base: 4 }}
            align={"center"}
          >
            <Flex
              flex={{ base: 1, md: "auto" }}
              ml={{ base: -2 }}
              display={{ base: "flex", md: "none" }}
            >
              <IconButton
                onClick={onToggle}
                icon={
                  isOpen ? (
                    <CloseIcon w={3} h={3} />
                  ) : (
                    <HamburgerIcon w={5} h={5} />
                  )
                }
                variant={"ghost"}
                aria-label={"Toggle Navigation"}
              />
            </Flex>
            <Flex
              flex={{ base: 1 }}
              justify={{ base: "center", md: "start" }}
              alignItems="center"
            >
              <Link href="/" boxShadow={"transparent"}>
                <img
                  draggable="false"
                  style={{
                    pointerEvents: "none",
                  }}
                  src={unidiffLogo}
                  alt="unidiff logo"
                />
              </Link>

              <Flex
                display={{ base: "none", md: "flex" }}
                ml={10}
                mr={10}
                flexGrow={1}
              >
                <SearchBar key={"desktop_search"} />
              </Flex>
            </Flex>

            {!isAuthenticated ? (
              <Stack
                flex={{ base: 1, md: 0 }}
                justify={"flex-end"}
                direction={"row"}
                spacing={6}
              >
                <Button
                  as={"a"}
                  fontSize={"sm"}
                  fontWeight={400}
                  variant={"link"}
                  href={"/auth/sign-in"}
                >
                  Sign in
                </Button>
                <Link href="/auth/sign-up">
                  <Button
                    display={{ base: "none", md: "inline-flex" }}
                    fontSize={"sm"}
                    fontWeight={600}
                    color={"white"}
                    bg={"green.400"}
                    _hover={{
                      bg: "green.500",
                    }}
                  >
                    Join now
                  </Button>
                </Link>
              </Stack>
            ) : (
              <Stack
                flex={{ base: 1, md: 0 }}
                justify={"flex-end"}
                direction={"row"}
                spacing={6}
              >
                <Button
                  display={{ base: "none", md: "inline-flex" }}
                  fontSize={"sm"}
                  fontWeight={600}
                  color={"white"}
                  bg={"red.400"}
                  _hover={{
                    bg: "red.500",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Stack>
            )}
          </Flex>

          <Collapse in={isOpen} animateOpacity>
            <SearchBar key={"mobile_search"} />
          </Collapse>
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
};

const SearchBar = ({ key }) => {
  const navigate = useNavigate();

  return (
    <AutoComplete
      openOnFocus
      maxSuggestions={20}
      key={key}
      onSelectOption={(value) => {
        const school_id = value.item.value.toLowerCase().split(" ").join("_");

        navigate(`/universities/view/${school_id}`);
      }}
    >
      <InputGroup size={"lg"}>
        <InputLeftElement
          pointerEvents="none"
          children={<Search2Icon color="gray.300" />}
        />
        <AutoCompleteInput
          key={key + "input"}
          bg={"white"}
          boxShadow={"sm"}
          autoComplete="off"
          placeholder="Search universities"
        />
      </InputGroup>
      <AutoCompleteList key={key + "list"}>
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
  );
};

export default AppLayout;
