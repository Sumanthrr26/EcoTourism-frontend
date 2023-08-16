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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [validityDate, setValidityDate] = useState("");
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
      fullName.trim() === "" ||
      email.trim() === "" ||
      address.length < 10 ||
      cardNumber.length !== 12 ||
      !validityDate ||
      new Date(validityDate) <= new Date()
    ) {
      // Display error message or handle validation
      if (cardNumber.length !== 12) {
        toast({
          title: "Invalid Card Number",
          description: "Card number should be 12 characters long.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (!validityDate) {
        toast({
          title: "Invalid Validity Date",
          description: "Please select a valid validity date.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (new Date(validityDate) <= new Date()) {
        toast({
          title: "Invalid Validity Date",
          description: "Validity date must be in the future.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (address.length < 10) {
        toast({
          title: "Invalid Address",
          description: "Address should be at least 10 characters long.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      return;
    }

    // Perform booking processing or submit data to server
    setSubmitted(true);

    // Send data to backend /booking route
    try {
      const response = await fetch("http://localhost:8000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedPackage.title,
          price: selectedPackage.price,
          fullName,
          email,
          address,
          cardNumber,
          validityDate,
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
        boxShadow="rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
        mb={10} // Add margin bottom
      >
        <Heading as="h2" mb={6}>
          Proceed with payment..
        </Heading>
        {selectedPackage && (
          <Box>
            <Heading as="h3" size="md">
              <span style={{ color: "red" }}>
                Package Details for confirmation:
              </span>
            </Heading>
            <p>
              <span style={{ color: "blue", fontWeight: "bold" }}>
                Package/Destination Name: {selectedPackage.title}
              </span>
            </p>
            <p>
              <span style={{ color: "blue", fontWeight: "bold" }}>
                Price: ₹{selectedPackage.price}
              </span>
            </p>
          </Box>
        )}
        <FormControl mt={4}>
          <FormLabel>
            <span style={{ color: "red" }}>Full Name</span>
          </FormLabel>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              color: "darkred",
              fontWeight: "bold",
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>
            <span style={{ color: "red" }}>Email</span>
          </FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              color: "darkred",
              fontWeight: "bold",
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>
            <span style={{ color: "red" }}>
              Address (Minimum 10 characters)
            </span>
          </FormLabel>
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              color: "darkred",
              fontWeight: "bold",
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>
            <span style={{ color: "red" }}>Card Number (12 digits)</span>
          </FormLabel>
          <Input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            style={{
              color: "darkred",
              fontWeight: "bold",
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>
            <span style={{ color: "red" }}>Validity Date</span>
          </FormLabel>
          <Input
            type="date"
            value={validityDate}
            onChange={(e) => setValidityDate(e.target.value)}
            style={{
              color: "darkred",
              fontWeight: "bold",
            }}
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
