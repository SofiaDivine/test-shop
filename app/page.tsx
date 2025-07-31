"use client";

import { useEffect, useState } from "react";
import { ProductsData } from "../types/productTypes";
import CustomPagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import Layout from "@/layout";
import AddProductModal from "../components/AddProductModal";

import { Button } from "@mui/material";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

export default function HomePage() {
  const [productsData, setProductsData] = useState<ProductsData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const categories = ["all", "beauty", "groceries", "furniture", "fragrances"];

  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const queryParams =
        selectedCategory === "all"
          ? `?_page=${currentPage}&_limit=50`
          : `?category=${selectedCategory}&_page=${currentPage}&_limit=10`;

      const res = await fetch(`http://localhost:3001/products${queryParams}`, {
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();
      const totalCount = res.headers.get("X-Total-Count");

      setProductsData({ products: data });
      setTotalPages(totalCount ? Math.ceil(Number(totalCount) / 10) : 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedCategory(event.target.value as string);
    setCurrentPage(1); // Reset to first page on category change
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!productsData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", color: "#343a40", mt: -2 }}
      >
        Products
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setAddModalOpen(true)}
        >
          + Add Product
        </Button>
      </Box>

      {/* Filter */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          backgroundColor: "#f8f9fa",
          borderRadius: "50px",
          padding: "10px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={(event, newCategory) => {
            if (newCategory) {
              setSelectedCategory(newCategory);
              setCurrentPage(1); // Reset to the first page on category change
            }
          }}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1, // Space between buttons for wrapping
          }}
        >
          {["all", "beauty", "groceries", "furniture", "fragrances"].map(
            (category) => (
              <ToggleButton
                key={category}
                value={category}
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  color: selectedCategory === category ? "#ffffff" : "#343a40",
                  backgroundColor:
                    selectedCategory === category ? "#ff69b4" : "transparent",
                  padding: { xs: "6px 10px", sm: "8px 20px" }, // Adjust padding for smaller screens
                  borderRadius: "30px",
                  margin: "0 5px",
                  minWidth: { xs: "80px", sm: "auto" }, // Ensure buttons are wider on mobile
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#ff8c94",
                    color: "#ffffff",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#ff69b4",
                    color: "#ffffff",
                    boxShadow: "0 4px 10px rgba(255, 105, 180, 0.4)",
                  },
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </ToggleButton>
            )
          )}
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={4} sx={{ justifyContent: "center" }}>
        {productsData.products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Box>
      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={fetchProducts}
      />
    </Layout>
  );
}
