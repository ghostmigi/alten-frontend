import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
} from "@mui/material";

const ProductCards = () => {
  const [products, setProducts] = useState([]);
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

  return (
    <Container>
      <h1> Manage products:</h1>
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
                <Typography variant="h6">{product.name}</Typography>
                <Typography color="text.secondary">
                  {product.category}
                </Typography>
                <Typography>${product.price}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Inventory: {product.inventoryStatus} | Rating:{" "}
                  {product.rating}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
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
    </Container>
  );
};

export default ProductCards;
