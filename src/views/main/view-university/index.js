import {
  Box,
  Heading,
  Text,
  HStack,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  FormControl,
  FormLabel,
  StatHelpText,
  Switch,
  useToast,
  Button,
  Link,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import { db } from "../../../utils/firebase";
import Comment from "./comment";
import collegeUrls from "../../../data/college-urls";
import collegeData from "../../../data/college-data";

const ViewUniversity = () => {
  const { uni_id } = useParams();
  const toast = useToast();
  const [genericUniData, setGenericUniData] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [uniNoData, setUniNoData] = useState(false);
  const [uniData, setUniData] = useState({
    reviews_average: 0,
    reviews_count: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [paidData, setPaidData] = useState({});
  const [chartData, setChartData] = useState([{ data: [] }]);
  const [isShowingInState, setIsShowingInState] = useState(true);
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "GPA",
      },
    },
    xaxis: {
      type: "numeric",
      labels: {
        formatter: function (val) {
          return formatter.format(val);
        },
      },
      tooltip: {
        formatter: function (val) {
          return formatter.format(val);
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

        return (
          "<ul style='padding: 8px;'>" +
          "<li><b>Paid</b>: " +
          formatter.format(data.x) +
          "</li>" +
          "<li><b>GPA</b>: " +
          data.y +
          "</li>" +
          "<li><b>Major</b>: " +
          data.major +
          "</li>" +
          "<li><b>Semester</b>: " +
          data.semester +
          "</li>" +
          "<li><b>In state</b>: " +
          `${data.inState ? "Yes" : "No"}` +
          "</li>" +
          "</ul>"
        );
      },
    },
    colors: ["#4299E1", "#FF5722"],
  };

  useEffect(() => {
    resetData();

    parseGenericData();
    fetchData(uni_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uni_id]);

  const resetData = () => {
    setGenericUniData({});
    setUniNoData(false);
    setIsFetching(true);
    setUniData({
      reviews_average: 0,
      reviews_count: 0,
    });
    setReviews([]);
    setPaidData({});
    setChartData([{ data: [] }]);
    setIsShowingInState(true);
  };

  const parseGenericData = () => {
    const locatedUniUrl = collegeUrls.find((uni) => {
      const formattedUniName = uni_id
        .split("_")
        .map((val) => {
          // Upper case first letter of each word
          return val.charAt(0).toUpperCase() + val.slice(1);
        })
        .join(" ");

      return uni.college_name.toLowerCase() === formattedUniName.toLowerCase();
    });

    const locatedUniData = collegeData.find((uni) => {
      const formattedUniName = uni_id
        .split("_")
        .map((val) => {
          // Upper case first letter of each word
          return val.charAt(0).toUpperCase() + val.slice(1);
        })
        .join(" ");

      return uni.college_name.toLowerCase() === formattedUniName.toLowerCase();
    });

    const dataForUni = {
      ...locatedUniData,
      ...locatedUniUrl,
    };

    setGenericUniData(dataForUni ?? {});
  };

  const fetchData = async (id) => {
    try {
      const universityDocRef = doc(db, "schools", id);
      const uniDoc = await getDoc(universityDocRef);

      if (uniDoc.exists()) {
        setUniNoData(true);

        const monthlyTuitionQuery = query(
          collection(universityDocRef, "monthly_tuition"),
          where("year", "==", "2022")
        );
        const monthlyTuitionDocs = await getDocs(monthlyTuitionQuery);

        const reviewsQuery = query(
          collection(universityDocRef, "reviews"),
          orderBy("created_unix", "desc")
        );
        const reviewsDocs = await getDocs(reviewsQuery);

        setUniData(uniDoc.data());
        parseReviews(reviewsDocs);
        parsePaidData(monthlyTuitionDocs);
        parseChartData(monthlyTuitionDocs);
      }

      setIsFetching(false);
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong, please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const parseReviews = (reviewsDocs) => {
    setReviews([]);
    reviewsDocs.forEach((review) => {
      setReviews((prev) => [...prev, review.data()]);
    });
  };

  const parsePaidData = (monthlyTuitionDocs) => {
    const data = {};

    monthlyTuitionDocs.forEach((doc) => {
      const { tuition_submissions } = doc.data();

      tuition_submissions.forEach((submission) => {
        if (submission.in_state) {
          // add submission.paid_per_semester to data object for in_state_total
          data.in_state_paid_total = data.in_state_paid_total || 0;
          data.in_state_paid_total += submission.paid_per_semester;

          data.in_state_cost_total = data.in_state_cost_total || 0;
          data.in_state_cost_total += submission.cost_per_semester;

          data.in_state_count = data.in_state_count || 0;
          data.in_state_count += 1;

          data.in_state_school_gpa = data.in_state_school_gpa || 0;
          data.in_state_school_gpa += submission.school_gpa;
        } else {
          data.out_state_paid_total = data.out_state_paid_total || 0;
          data.out_state_paid_total += submission.paid_per_semester;

          data.out_state_cost_total = data.out_state_cost_total || 0;
          data.out_state_cost_total += submission.cost_per_semester;

          data.out_state_count = data.out_state_count || 0;
          data.out_state_count += 1;

          data.out_state_school_gpa = data.out_state_school_gpa || 0;
          data.out_state_school_gpa += submission.school_gpa;
        }
      });
    });

    setPaidData({
      in_state_average_cost: data.in_state_cost_total / data.in_state_count,
      in_state_average_paid: data.in_state_paid_total / data.in_state_count,
      in_state_average_gpa: parseFloat(
        data.in_state_school_gpa / data.in_state_count
      ).toFixed(2),
      out_state_average_cost: data.out_state_cost_total / data.out_state_count,
      out_state_average_paid: data.out_state_paid_total / data.out_state_count,
      out_state_average_gpa: parseFloat(
        data.out_state_school_gpa / data.out_state_count
      ).toFixed(2),
    });
  };

  const parseChartData = (monthlyTuitionDocs) => {
    const data = [
      { name: "In State", data: [] },
      { name: "Out of State", data: [] },
    ];

    monthlyTuitionDocs.forEach((doc) => {
      const { tuition_submissions } = doc.data();

      tuition_submissions.forEach((submission) => {
        const sub = {
          x: submission.paid_per_semester,
          y: submission.school_gpa,
          major: submission.major,
          semester: submission.semester,
          inState: submission.in_state,
        };

        if (submission.in_state) {
          data[0].data.push(sub);
        } else {
          data[1].data.push(sub);
        }
      });
    });

    setChartData(data);
  };

  if (isFetching) {
    return (
      <Center mt={8}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  if (!uniNoData) {
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
            <Box maxW="6xl" flexGrow={1} pl={4} pr={4} pt={1} pb={1} mb={6}>
              <Heading as="h1" size="xl" pt={4}>
                {uni_id
                  .split("_")
                  .map((val) => {
                    // Upper case first letter of each word
                    return val.charAt(0).toUpperCase() + val.slice(1);
                  })
                  .join(" ")}
              </Heading>
              <HStack pt={4} spacing={8}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">
                    Location
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {genericUniData.city}, {genericUniData.state}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.500">
                    School type
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {genericUniData.private === "Yes" ? "Private" : "Public"}
                  </Text>
                </Box>
              </HStack>
              <Divider mt={4} mb={6} />
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                There is no data available for this university. Be the first to
                submit a your tuition.
              </Text>
              <Link href="/add-tuition">
                <Button mt={4}>Submit tuition</Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

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
          <Box maxW="6xl" flexGrow={1} pl={4} pr={4} pt={1} pb={1} mb={6}>
            <Heading as="h1" size="xl" pt={4}>
              {uni_id
                .split("_")
                .map((val) => {
                  // Upper case first letter of each word
                  return val.charAt(0).toUpperCase() + val.slice(1);
                })
                .join(" ")}
            </Heading>
            <HStack pt={4} spacing={8}>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.500">
                  Location
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {genericUniData.city}, {genericUniData.state}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.500">
                  School type
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {genericUniData.private === "Yes" ? "Private" : "Public"}
                </Text>
              </Box>
            </HStack>
            <Divider mt={4} mb={6} />
            <Box display="flex">
              <Box w="10em">
                <FormControl display="flex" alignItems="center" pb={3}>
                  <FormLabel htmlFor="email-alerts" mb="0">
                    Out of State
                  </FormLabel>
                  <Switch
                    id="email-alerts"
                    onChange={(e) => {
                      setIsShowingInState(!e.target.checked);
                    }}
                  />
                </FormControl>
                <Stat>
                  <StatLabel fontSize="sm" fontWeight="medium" color="gray.500">
                    Cost per semester
                  </StatLabel>
                  <StatNumber fontWeight="bold">
                    {formatter.format(
                      isShowingInState
                        ? paidData.in_state_average_cost
                        : paidData.out_state_average_cost
                    )}
                  </StatNumber>
                  <StatHelpText>
                    {isShowingInState ? "In State" : "Out of State"}
                  </StatHelpText>
                </Stat>
                <Stat pt={2}>
                  <StatLabel fontSize="sm" fontWeight="medium" color="gray.500">
                    Paid per semester
                  </StatLabel>
                  <StatNumber fontWeight="bold">
                    {formatter.format(
                      isShowingInState
                        ? paidData.in_state_average_paid
                        : paidData.out_state_average_paid
                    )}
                  </StatNumber>
                  <StatHelpText>
                    {isShowingInState ? "In State" : "Out of State"}
                  </StatHelpText>
                </Stat>
                <Stat pt={2}>
                  <StatLabel fontSize="sm" fontWeight="medium" color="gray.500">
                    Average GPA
                  </StatLabel>
                  <StatNumber fontWeight="bold">
                    {isShowingInState
                      ? paidData.in_state_average_gpa
                      : paidData.out_state_average_gpa}
                  </StatNumber>
                  <StatHelpText>
                    {isShowingInState ? "In State" : "Out of State"}
                  </StatHelpText>
                </Stat>
              </Box>
              <Box flexGrow={1}>
                <Chart
                  options={options}
                  series={chartData}
                  height={350}
                  type="scatter"
                />
              </Box>
            </Box>
            <Divider mt={4} mb={4} />
            <Box display={"flex"} alignItems={"center"}>
              <Stat>
                <StatLabel fontSize="sm" fontWeight="medium" color="gray.500">
                  Reviews
                </StatLabel>
                <StatNumber fontWeight="bold" display={"flex"}>
                  {parseFloat(uniData.reviews_average).toFixed(2)}{" "}
                  <Text fontWeight="medium" ml={1} color="gray.500">
                    / 5
                  </Text>
                </StatNumber>
                <StatHelpText>
                  Based on {uniData.reviews_count} reviews
                </StatHelpText>
              </Stat>
              <Link href={"/universities/view/" + uni_id + "/write-review"}>
                <Button>Write a review</Button>
              </Link>
            </Box>
            {reviews.length > 0 ? (
              reviews.map((doc) => <Comment data={doc} />)
            ) : (
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                No reviews, be the first to write one.
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ViewUniversity;
