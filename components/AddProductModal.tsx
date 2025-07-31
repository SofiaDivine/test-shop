"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const categories = ["beauty", "groceries", "furniture", "fragrances"];

export default function AddProductModal({
  open,
  onClose,
  onAdd,
}: AddProductModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Product</DialogTitle>
      <Formik
        initialValues={{
          title: "",
          description: "",
          category: "",
          price: "",
          stock: "",
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Title is required"),
          description: Yup.string().required("Description is required"),
          category: Yup.string().required("Category is required"),
          price: Yup.number()
            .typeError("Price must be a number")
            .required("Price is required")
            .positive("Price must be positive"),
          stock: Yup.number()
            .typeError("Stock must be a number")
            .required("Stock is required")
            .integer("Stock must be an integer")
            .min(0, "Stock can't be negative"),
        })}
        onSubmit={async (values, { resetForm }) => {
          const newProduct = {
            ...values,
            price: parseFloat(values.price),
            stock: parseInt(values.stock),
            rating: 0,
            discountPercentage: 0,
            tags: [],
            brand: "",
            sku: "",
            weight: 0,
            dimensions: {
              width: 0,
              height: 0,
              depth: 0,
            },
            warrantyInformation: "",
            shippingInformation: "",
            availabilityStatus: "In Stock",
            reviews: [],
          };

          const response = await fetch("http://localhost:3001/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
          });

          const createdProduct = await response.json(); // Тут ми отримаємо продукт із id
          console.log("Product created with id:", createdProduct.id);

          resetForm();
          onAdd(); // trigger refetch
          onClose();
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
          setFieldValue,
        }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                {/* Title */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="price"
                    label="Price"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    minRows={3}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                {/* Category dropdown */}
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={touched.category && Boolean(errors.category)}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Category"
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Stock */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="stock"
                    label="Stock"
                    value={values.stock}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.stock && Boolean(errors.stock)}
                    helperText={touched.stock && errors.stock}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Add
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
