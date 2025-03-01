import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Checkbox,
  FormControlLabel,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const theme = createTheme({
  typography: {
    fontFamily: "Quicksand, sans-serif",
  },
});

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError({});

    const errors = {};
    if (!acceptedTerms) {
      errors.terms = "You must accept the terms and conditions.";
    }
    if (!formData.firstName.trim()) {
      errors.firstName = "You must add a first name.";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "You must add a last name.";
    }
    if (!formData.email.trim()) {
      errors.email = "You must add an email.";
    }
    if (!formData.password.trim()) {
      errors.password = "You must add a password.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    const endpoint = "http://localhost:8080/api/v1/auth/signup";

    axios
      .post(endpoint, formData)
      .then(() => {
        navigate("/auth/signin", { state: { registrationSuccess: true } });
      })
      .catch((error) => {
        setError({
          api: `Registration failed: ${
            error.response?.data?.message || "try again!"
          }`,
        });
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="false" disableGutters>
        <Box display="flex" width="100vw" height="100vh">
          <Box
            width="50vw"
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="#fff"
            p={2}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              display="flex"
              flexDirection="column"
              alignItems="left"
              sx={{ maxWidth: 400, width: "100%" }}
            >
              <Typography
                variant="h4"
                component="h2"
                align="left"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Sign up
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontFamily: "Quicksand, sans-serif" }}
                >
                  Already have an account?{" "}
                  <Link to="/auth/signin">Sign in</Link>
                </Typography>
              </Typography>
              {error.api && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error.api}
                </Alert>
              )}
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error.firstName}
                helperText={error.firstName}
                sx={{ fontFamily: "Quicksand, sans-serif" }}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error.lastName}
                helperText={error.lastName}
                sx={{ fontFamily: "Quicksand, sans-serif" }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error.email}
                helperText={error.email}
                sx={{ fontFamily: "Quicksand, sans-serif" }}
              />
              <TextField
                label="Password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!error.password}
                helperText={error.password}
                sx={{ fontFamily: "Quicksand, sans-serif" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={handleTermsChange}
                    color="primary"
                    sx={{ fontFamily: "Quicksand, sans-serif" }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Quicksand, sans-serif" }}
                  >
                    I accept the{" "}
                    <Link
                      to="/terms"
                      target="_blank"
                      style={{ color: "#635bff" }}
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                }
                sx={{ mb: 2, fontFamily: "Quicksand, sans-serif" }}
              />
              {error.terms && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error.terms}
                </Alert>
              )}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  borderRadius: 3,
                  padding: "5px 10px",
                  fontSize: "1rem",
                  backgroundColor: "#635bff",
                  fontFamily: "Quicksand, sans-serif",
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>

          <Box
            width="50vw"
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor: "#090E23",
              position: "relative",
            }}
          >
            <Box
              component="img"
              src="/assets/auth-widgets.png"
              alt="Signup"
              sx={{
                width: "100%",
                maxWidth: "600px",
                height: "auto",
              }}
            />
            <Box
              position="absolute"
              top="15%"
              left="auto"
              transform="translate(-50%, -50%)"
              textAlign="center"
              color="#fff"
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{ color: "#ffffff", fontFamily: "Quicksand, sans-serif" }}
              >
                Welcome to{" "}
                <Box component="span" sx={{ color: "#15b79e" }}>
                  Help Desk
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: "Quicksand, sans-serif" }}
              >
                A professional platform to manage your reports.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
