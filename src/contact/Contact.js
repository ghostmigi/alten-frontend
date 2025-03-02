import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (message.length > 300) {
      setMessageError(true);
      toast.error("Message doit être inférieur à 300 caractères.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    setMessageError(false);

    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to submit a contact");
      return;
    }

    const contactData = {
      email,
      message,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/contact",
        contactData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Contact created:", response.data);

      toast.success("Demande de contact envoyée avec succès", {
        position: "top-right",
        autoClose: 3000,
      });

      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Failed to create contact. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            helperText={
              messageError
                ? "Message doit être inférieur à 300 caractères."
                : ""
            }
            error={messageError}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </Box>

      <ToastContainer />
    </Container>
  );
};

export default Contact;
