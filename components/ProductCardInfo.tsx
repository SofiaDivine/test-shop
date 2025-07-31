import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
  Rating,
  Button,
  IconButton,
  DialogContent,
  Dialog,
} from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";

interface ProductCardInfoProps {
  product: {
    id: number;
    title: string;
    thumbnail?: string;
    category: string;
    brand: string;
    price: number;
    discountPercentage: number;
    rating: number;
    description: string;
    stock: number;
    tags: string[];
    sku: string;
    weight: number;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: {
      rating: number;
      comment: string;
      date: string;
      reviewerName: string;
      reviewerEmail: string;
    }[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: {
      createdAt: string;
      updatedAt: string;
      barcode: string;
      qrCode: string;
    };
    images: string[];
  };
}

const ProductCardInfo: React.FC<ProductCardInfoProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOpen = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedImage(null);
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/products/delete/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error deleting product:", err.message);
      } else {
        console.error("Unknown error occurred while deleting product");
      }
    }
  };

  const safeImages = product.images?.length ? product.images : [];
  const safeTags = product.tags?.length ? product.tags : [];
  const safeReviews = product.reviews?.length ? product.reviews : [];
  const dimensions = product.dimensions || { width: 0, height: 0, depth: 0 };

  const showWeight = ["groceries", "furniture"].includes(product.category);
  const showReturnPolicy = ["furniture", "fragrances", "beauty"].includes(
    product.category
  );

  const thumbnail = product.thumbnail || safeImages[0] || "/no-image.png";

  return (
    <>
      <Header />
      <Box
        sx={{
          p: 4,
          maxWidth: "lg",
          mx: "auto",
          backgroundColor: "#faf3f3",
          borderRadius: "25px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Hero Section */}
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mb: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <CardMedia
            component="img"
            image={thumbnail}
            alt={product.title}
            sx={{
              width: { xs: "100%", md: "50%" },
              height: { xs: "300px", md: "100%" },
              objectFit: "cover",
              borderRadius: { xs: "20px 20px 0 0", md: "20px 0 0 20px" },
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
          <Box
            sx={{
              flex: "1 1 auto",
              padding: { xs: 3, md: 5 },
              backgroundColor: "#fef6e4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#ff8c94" }}
            >
              {product.title}
            </Typography>
            <Typography variant="body1" sx={{ color: "#757575", mb: 2 }}>
              {product.description || "No description provided."}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#4caf50",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ${product.price?.toFixed(2) || "0.00"}
                {product.discountPercentage > 0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "#a8a8a8",
                      marginLeft: 2,
                    }}
                  >
                    $
                    {(
                      product.price *
                      (1 + product.discountPercentage / 100)
                    ).toFixed(2)}
                  </Typography>
                )}
              </Typography>
              <Rating
                value={product.rating || 0}
                precision={0.1}
                readOnly
                sx={{ mt: 1, color: "#ffca28" }}
              />
            </Box>
            {safeTags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {safeTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    sx={{
                      backgroundColor: "#ffe6e6",
                      color: "#ff69b4",
                      fontWeight: "bold",
                      borderRadius: "12px",
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Card>

        {/* Product Photos */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              textAlign: "center",
              color: "#ff69b4",
              fontWeight: "bold",
              textDecoration: "underline",
              marginBottom: 4,
            }}
          >
            Product Photos
          </Typography>

          {safeImages.length > 0 ? (
            <Grid container spacing={2}>
              {safeImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    onClick={() => handleOpen(image)}
                    sx={{
                      borderRadius: "15px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={image}
                      alt={`Product image ${index + 1}`}
                      sx={{
                        borderRadius: "15px",
                        objectFit: "cover",
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography align="center" color="text.secondary">
              No images available
            </Typography>
          )}
        </Box>

        {/* Modal */}
        <Dialog open={open} onClose={handleClose} maxWidth="lg">
          <DialogContent
            sx={{
              position: "relative",
              backgroundColor: "#fef6e4",
              maxWidth: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              margin: "0 auto",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#ff69b4",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#ff8c94",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected Product"
                style={{
                  width: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                  borderRadius: "15px",
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <button onClick={() => handleDelete(product.id)}>Delete</button>

        {/* Details Section */}
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  padding: 3,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                  borderRadius: "15px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: "bold", color: "#ff69b4" }}
                >
                  Product Details
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, color: "#757575" }}>
                  <strong>Category:</strong> {product.category}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, color: "#757575" }}>
                  <strong>Brand:</strong> {product.brand || "N/A"}
                </Typography>
                {showWeight && (
                  <Typography variant="body1" sx={{ mb: 1, color: "#757575" }}>
                    <strong>Weight:</strong> {product.weight}g
                  </Typography>
                )}
                <Typography variant="body1" sx={{ mb: 1, color: "#757575" }}>
                  <strong>Dimensions:</strong> {dimensions.width} x{" "}
                  {dimensions.height} x {dimensions.depth} cm
                </Typography>
                {showReturnPolicy && (
                  <Typography variant="body1" sx={{ mb: 1, color: "#757575" }}>
                    <strong>Return Policy:</strong>{" "}
                    {product.returnPolicy || "Not specified"}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ mb: 1, color: "#757575" }}>
                  <strong>Minimum Order Quantity:</strong>{" "}
                  {product.minimumOrderQuantity || 1}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Reviews */}
        <Box sx={{ mt: 5 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              textAlign: "center",
              color: "#ff69b4",
            }}
          >
            Customer Reviews
          </Typography>
          {safeReviews.length > 0 ? (
            safeReviews.map((review, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  padding: 3,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {review.reviewerName || "Anonymous"} –{" "}
                  {review.date
                    ? new Date(review.date).toLocaleDateString()
                    : "N/A"}
                </Typography>
                <Rating value={review.rating || 0} readOnly />
                <Typography variant="body2" sx={{ mt: 1, color: "#757575" }}>
                  {review.comment}
                </Typography>
              </Card>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No reviews available.
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Link href="/" passHref>
            <Button
              variant="contained"
              sx={{
                fontWeight: "bold",
                padding: "10px 20px",
                backgroundColor: "#ffb6c1",
                color: "#ffffff",
                transition: "all 0.3s ease",
                borderRadius: "30px",
                "&:hover": {
                  backgroundColor: "#ff69b4",
                  transform: "scale(1.05)",
                },
              }}
            >
              Back to Products
            </Button>
          </Link>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default ProductCardInfo;
