import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectProductById,
  useUpdateProductMutation,
  useUploadImageMutation,
} from "./services/products";
import Message from "../components/Message";
import {
  FormControl,
  FormLabel,
  Input,
  Heading,
  Button,
  Box,
  Textarea,
  CircularProgress,
} from "@chakra-ui/react";

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useSelector((state) => selectProductById(state, id));

  const [uploadImage, { data: uploadResponse, isLoading: uploadLoading }] =
    useUploadImageMutation();

  const [
    updateProduct,
    {
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorMessage,
    },
  ] = useUpdateProductMutation();

  const [imgUpload, setImgUpload] = useState(null);
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: 0,
    image: "",
    brand: "",
    countInStock: 0,
    category: "",
    description: "",
  });

  useEffect(() => {
    if (uploadResponse !== undefined) {
      setProductInfo({ ...productInfo, image: uploadResponse.path });
    }
    return () => {};
  }, [uploadResponse]);

  useEffect(() => {
    if (product) {
      setProductInfo({
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        countInStock: product.countInStock,
        category: product.category,
        description: product.description,
      });
    }

    return () => {};
  }, [product]);

  let status;

  if (updateError) {
    status = (
      <Message m={3} status="error" message={updateErrorMessage.data.message} />
    );
  }
  if (updateSuccess) {
    status = <Message m={3} status="success" message={"User got updated!"} />;
  }

  const imageUploadHandler = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("uploadedImg", imgUpload);

    try {
      await uploadImage(form);
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = async () => {
    try {
      await updateProduct({ id, productInfo });
      navigate("/admin/productlist");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box display="flex" flexDir="column" p={3} w={["100vw", "lg"]}>
      <Box>
        {status}
        <FormControl isRequired>
          <Heading mb={3} as="h2">
            Edit Product
          </Heading>
          <FormLabel id="name">Name</FormLabel>
          <Input
            id="name"
            mb={2}
            type="text"
            value={productInfo.name}
            onChange={(e) =>
              setProductInfo({ ...productInfo, name: e.target.value })
            }
          />

          <FormLabel id="price">Price</FormLabel>
          <Input
            id="price"
            mb={2}
            type="number"
            value={productInfo.price}
            onChange={(e) =>
              setProductInfo({ ...productInfo, price: e.target.value })
            }
          />
          {uploadLoading && <CircularProgress isIndeterminate />}
          <FormLabel id="image">Image</FormLabel>
          <Box mb={2}>
            <Input
              id="image"
              mb={2}
              type="text"
              value={productInfo.image}
              onChange={(e) =>
                setProductInfo({ ...productInfo, image: e.target.value })
              }
            />
            <form
              encType="multipart/from-data"
              method="post"
              onSubmit={imageUploadHandler}
            >
              <input
                type="file"
                name="uploadedImg"
                onChange={(e) => setImgUpload(e.target.files[0])}
              />
              <button type="submit">Submit</button>
            </form>
          </Box>

          <FormLabel id="brand">Brand</FormLabel>
          <Input
            id="brand"
            mb={2}
            type="text"
            value={productInfo.brand}
            onChange={(e) =>
              setProductInfo({ ...productInfo, brand: e.target.value })
            }
          />

          <FormLabel id="countInStock">Count In Stock</FormLabel>
          <Input
            id="countInStock"
            mb={2}
            type="text"
            value={productInfo.countInStock}
            onChange={(e) =>
              setProductInfo({ ...productInfo, countInStock: e.target.value })
            }
          />

          <FormLabel id="category">Category</FormLabel>
          <Input
            id="category"
            mb={2}
            type="text"
            value={productInfo.category}
            onChange={(e) =>
              setProductInfo({ ...productInfo, category: e.target.value })
            }
          />

          <FormLabel id="description">Description</FormLabel>
          <Textarea
            mb={2}
            value={productInfo.description}
            onChange={(e) =>
              setProductInfo({ ...productInfo, description: e.target.value })
            }
          />

          <Button w="full" mb={3} type="submit" onClick={submitHandler}>
            Update Product
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ProductEditScreen;
