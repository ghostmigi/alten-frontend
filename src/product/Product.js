import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useCart } from "../cart/CartContext";

const ProductCards = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    code: "",
    category: "",
    price: "",
    description: "",
    quantity: "",
    inventoryStatus: "",
    rating: "",
    shellId: "",
  });
  const { cart, setCart } = useCart();
  const token = localStorage.getItem("authToken");
  let userId = null;

  if (token) {
    try {
      // Decode the JWT to extract user data
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
      console.log(decodedToken); // You can log the decoded token to check its structure
    } catch (error) {
      console.error("Error decoding the token:", error);
    }
  } else {
    console.error("No token found in localStorage");
  }

  const handleAddToCart = async (product) => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    try {
      // Step 1: Check if the cart exists for the user
      let cartResponse;
      try {
        cartResponse = await axios.get(
          `http://localhost:8080/api/v1/cart/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        // If the cart doesn't exist, it will throw an error. We'll handle it by creating the cart.
        if (error.response && error.response.status === 404) {
          // Cart doesn't exist, create a new cart
          console.log("Cart does not exist. Creating new cart...");
          await axios.post(
            `http://localhost:8080/api/v1/cart/${userId}`,
            {}, // Empty body for cart creation
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Cart created for the user.");
        } else {
          // Other errors (e.g., network issues) are logged
          console.error("Error checking cart existence:", error);
          return;
        }
      }

      // Step 2: Add the selected product to the user's cart
      await axios.post(
        `http://localhost:8080/api/v1/cart/${userId}/add/${product.id}`,
        {}, // Empty body, just to trigger the product addition
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optionally, update the cart state locally after adding the product
      setCart((prevCart) => [...prevCart, product]);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [token]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsCreate(false);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct({
      code: "",
      name: "",
      description: "",
      image: "",
      category: "",
      price: "",
      quantity: "",
      internalReference: "",
      shellId: "",
      inventoryStatus: "",
      rating: "",
    });
    setIsCreate(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (isCreate) {
        await axios.post("http://localhost:8080/products", selectedProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put(
          `http://localhost:8080/products/${selectedProduct.id}`,
          selectedProduct,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setOpen(false);
      const response = await axios.get("http://localhost:8080/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreate}
        style={{ marginBottom: "20px" }}
      >
        Create New Product
      </Button>
      {products.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          No products available. Please create a new product.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  style={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6">Name: {product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Code: {product.code}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Category: {product.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price:${product.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Description: {product.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Inventory: {product.quantity}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    InternalReference Status: {product.internalReference}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Shell ID: {product.shellId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Inventory Status: {product.inventoryStatus}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Rating: {product.rating}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Created: {new Date(product.createdAt).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginLeft: "10px", marginTop: "10px" }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ marginLeft: "10px", marginTop: "10px" }}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isCreate ? "Create Product" : "Edit Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            name="name"
            value={selectedProduct.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product Code"
            name="code"
            value={selectedProduct.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            name="category"
            value={selectedProduct.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={selectedProduct.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={selectedProduct.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={selectedProduct.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image"
            name="image"
            type="string"
            value={selectedProduct.image}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Inventory Status</InputLabel>
            <Select
              name="inventoryStatus"
              value={selectedProduct.inventoryStatus}
              onChange={handleChange}
            >
              <MenuItem value="INSTOCK">INSTOCK</MenuItem>
              <MenuItem value="LOWSTOCK">LOWSTOCK</MenuItem>
              <MenuItem value="OUTOFSTOCK">OUTOFSTOCK</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="InternalReference"
            name="internalReference"
            value={selectedProduct.internalReference}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Rating"
            name="rating"
            type="number"
            value={selectedProduct.rating}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Shell ID"
            name="shellId"
            value={selectedProduct.shellId}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductCards;
