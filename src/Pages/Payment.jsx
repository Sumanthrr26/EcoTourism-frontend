import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [validityDate, setValidityDate] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toast = useToast(); // Initialize useToast
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const storedPackage = JSON.parse(localStorage.getItem("selectedPackage"));
    setSelectedPackage(storedPackage);
  }, []);

  const handleSubmit = async () => {
    // Perform validation checks here
    if (
      cardNumber.length !== 12 ||
      new Date(validityDate) <= new Date() ||
      address.length < 10 ||
      email === ""
    ) {
      // Display error message or handle validation
      return;
    }

    // Perform booking processing or submit data to server
    setSubmitted(true);

    // Send data to backend /booking route
    try {
      const modifiedSelectedPackage = {
        title: selectedPackage.title,
        price: selectedPackage.price,
      };

      const response = await fetch("http://localhost:8000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedPackage: modifiedSelectedPackage,
          cardNumber,
          validityDate,
          address,
          email,
        }),
      });

      if (response.ok) {
        // Show success toast notification
        toast({
          title: "Booking successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Redirect to home page
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        // Handle error response
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error(error);
      // Display error toast notification
      toast({
        title: "Booking failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Center mt={20}>
      <Box
        maxW="400px"
        p={6}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        mb={10} // Add margin bottom
      >
        <Heading as="h2" mb={6}>
          Booking Details
        </Heading>
        {selectedPackage && (
          <Box>
            <Heading as="h3" size="md">
              <span style={{ color: "green" }}>Package Details</span>
            </Heading>
            <p>
              <span style={{ color: "green" }}>{selectedPackage.title}</span>
            </p>
            <p>
              <span style={{ color: "green" }}>
                Price: ₹{selectedPackage.price}
              </span>
            </p>
          </Box>
        )}
        <FormControl mt={4}>
          <FormLabel>Card Number (12 digits)</FormLabel>
          <Input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Validity Date</FormLabel>
          <Input
            type="date"
            value={validityDate}
            onChange={(e) => setValidityDate(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Address (Minimum 10 characters)</FormLabel>
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Button
          mt={6}
          colorScheme="teal"
          onClick={handleSubmit}
          isDisabled={submitted}
        >
          Submit
        </Button>
      </Box>
    </Center>
  );
};

export default Payment;
