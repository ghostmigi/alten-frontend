import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setRegistrationSuccess(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    axios
      .post("http://localhost:8080/api/v1/auth/signin", formData)
      .then((response) => {
        const { token } = response.data;

        localStorage.setItem("authToken", token);
        navigate("/products", { state: { justLoggedIn: true } });
      })
      .catch((error) => {
        setError("Login failed: Please check your credentials.");
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
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
              sx={{ fontFamily: "Quicksand, sans-serif", fontWeight: 500 }}
            >
              Sign in
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontFamily: "Quicksand, sans-serif" }}
            >
              Don't have an account? <Link to="/auth/signup">Sign up</Link>
            </Typography>
            {registrationSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! Please log in.
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error}
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
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {passwordVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ fontFamily: "Quicksand, sans-serif" }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                borderRadius: 3,
                padding: "5px 10px",
                fontSize: "1rem",
                backgroundColor: "#635bff",
                mt: 2,
                fontFamily: "Quicksand, sans-serif",
              }}
            >
              Sign In
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
            alt="Signin"
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
              Welcome Back to{" "}
              <Box component="span" sx={{ color: "#15b79e" }}>
                App Alten
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontFamily: "Quicksand, sans-serif" }}
            >
              A professional platform to manage your products.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Signin;
