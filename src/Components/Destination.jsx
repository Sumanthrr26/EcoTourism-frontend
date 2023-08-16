import CardComp from "./CardComp";
import {
  SimpleGrid,
  Box,
  Flex,
  Button,
  Heading,
  Center,
  Select,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const Destination = () => {
  const [Data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortValue, setSortValue] = useState(null);
  const [selectedName, setSelectedName] = useState("");

  const url = `http://localhost:8000/destinations?page=${page}&limit=6${
    sortValue ? `&sort=${sortValue}` : ""
  }${selectedName ? `&name=${selectedName}` : ""}`;

  useEffect(() => {
    fetchData();
  }, [page, sortValue, selectedName]);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const totalCount = parseInt(response.headers.get("X-Total-Count"), 10);
      setTotal(Math.ceil(totalCount / 6));
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSort = (value) => {
    setPage(1);
    setSortValue(value);
  };

  const handleNameChange = (event) => {
    setSelectedName(event.target.value);
    setPage(1);
  };

  return (
    <div>
      <Box textAlign="center" ml={10} mt={20}>
        <Heading as="h6" mb={5}>
          A Great Collection of our packages
        </Heading>
        <Flex justify="center" align="center" flexWrap="wrap" gap={20}>
          <Button colorScheme="teal">All</Button>
          <Button colorScheme="teal" onClick={() => handleSort("asc")}>
            Low to High
          </Button>
          <Button colorScheme="teal" onClick={() => handleSort("desc")}>
            High to Low
          </Button>
          <Select
            placeholder="Select name"
            value={selectedName}
            onChange={handleNameChange}
            colorScheme="teal"
            variant="solid"
            width="150px"
          >
            <option value="">All Names</option>
            <option value="mountain">Mountain</option>
            <option value="beach">Beach</option>
            <option value="resort">Resort</option>
            <option value="honeymoon">Honeymoon</option>
          </Select>
        </Flex>
      </Box>

      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(400px, 1fr))"
        mt={10}
        ml={75}
        mb={50}
      >
        {Data.map((destination) => (
          <CardComp key={destination.id} elem={destination} />
        ))}
      </SimpleGrid>
      <Flex justify="center" mt={5} mb={60}>
        <Button
          isDisabled={page === 1}
          colorScheme="teal"
          mr={2}
          size="md"
          rounded="full"
          width={20}
          onClick={() => handlePageChange(page - 1)}
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
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      </Flex>
    </div>
  );
};

export default Destination;
