// Packages.jsx

import React, { useState, useEffect } from "react";
import PackagesCard from "../Components/PackagesCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Flex, Center, Box, Select, Button } from "@chakra-ui/react";

const Packages = () => {
  const packages = useSelector((state) => state.app.packages);
  const [ratingSortOrder, setRatingSortOrder] = useState("ascending");
  const [priceSortOrder, setPriceSortOrder] = useState("ascending");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/packages?page=${page}&limit=6`
      );
      const data = await response.json();
      const totalCount = parseInt(response.headers.get("X-Total-Count"), 10);
      setTotal(Math.ceil(totalCount / 6));
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleRatingSortChange = (e) => {
    setRatingSortOrder(e.target.value);
  };

  const handlePriceSortChange = (e) => {
    setPriceSortOrder(e.target.value);
  };

  const sortPackagesByRating = (order) => {
    const sortedPackages = [...data];
    if (order === "ascending") {
      return sortedPackages.sort((a, b) => a.rating - b.rating);
    } else if (order === "descending") {
      return sortedPackages.sort((a, b) => b.rating - a.rating);
    }
    return sortedPackages;
  };

  const sortPackagesByPrice = (order) => {
    const sortedPackages = [...data];
    if (order === "ascending") {
      return sortedPackages.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    } else if (order === "descending") {
      return sortedPackages.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    }
    return sortedPackages;
  };

  const sortedPackagesByRating = sortPackagesByRating(ratingSortOrder);
  const sortedPackagesByPrice = sortPackagesByPrice(priceSortOrder);

  const combinedPackages = [
    ...sortedPackagesByRating,
    ...sortedPackagesByPrice,
  ];

  const handleBookNow = (packageData) => {
    localStorage.setItem("selectedPackage", JSON.stringify(packageData));
    navigate("/payments"); // Navigate to payment page using useNavigate
  };

  return (
    <Center bg="transparent" mt={50} mb={200}>
      <Flex
        flexWrap="wrap"
        justifyContent="center"
        maxWidth="1200px"
        alignItems="flex-start"
      >
        <Box width="70%" mb="20px" mx="20px">
          <Flex direction="row">
            <Box mr="10px">
              <Select
                value={ratingSortOrder}
                onChange={handleRatingSortChange}
                width="100%"
                maxW="200px"
              >
                <option value="ascending">Sort by Rating (Low to High)</option>
                <option value="descending">Sort by Rating (High to Low)</option>
              </Select>
            </Box>
          </Flex>
        </Box>

        <Flex justify="center" mt={5} mb={20} width="100%">
          <Button
            isDisabled={page === 1}
            colorScheme="teal"
            mr={2}
            size="md"
            rounded="full"
            width={20}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>{" "}
          <Button fontSize={20} fontWeight="bold">
            {page}
          </Button>
          <Button
            isDisabled={page === total}
            colorScheme="teal"
            ml={5}
            size="md"
            rounded="full"
            width={20}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Flex>

        {combinedPackages.map((packageData, index) => (
          <PackagesCard
            key={index}
            {...packageData}
            onBookNow={() => handleBookNow(packageData)}
          />
        ))}
      </Flex>
    </Center>
  );
};

export default Packages;
