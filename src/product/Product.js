import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Box,
} from "@mui/material";

const ProductCards = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const token = localStorage.getItem("authToken");

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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/products/${selectedProduct.id}`,
        selectedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpen(false);
      setProducts(
        products.map((product) =>
          product.id === selectedProduct.id ? selectedProduct : product
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
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
                  Inventory Status: {product.inventoryStatus}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Rating: {product.rating}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Shell ID: {product.shellId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </Typography>

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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
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
                label="Inventory"
                name="quantity"
                type="number"
                value={selectedProduct.quantity}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Inventory Status"
                name="inventoryStatus"
                value={selectedProduct.inventoryStatus}
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
            </>
          )}
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
