'use client';
import { useEffect, useState } from "react";
import { db } from "../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import './products.css';
import Radio from "./components/Radio";
import styles from '../../components/Header.module.css'
import { IoIosMenu } from "react-icons/io";
import Image from 'next/image';
import Link from "next/link";
import Header from "@/components/Header";
// 💡 NEW MUI IMPORTS for Grid and Pagination
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box, Pagination } from "@mui/material";
// 💡 NEW ICON IMPORTS
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 


// 💡 Configuration for Pagination
const ITEMS_PER_PAGE = 12; // Display 12 products per page

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // 💡 NEW STATE for Pagination
  const [currentPage, setCurrentPage] = useState(1);
// ... (rest of the component)

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setFilteredProducts(productList);
    };
    fetchProducts();
  }, []);

  // ... (inside ProductsPage component)

// Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    // ... (rest of filtering logic)
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    const finalResults = selectedCategory === "All"
      ? results
      : results.filter((product) =>
            product.categories?.includes(selectedCategory)
          );
    setFilteredProducts(finalResults);
    setCurrentPage(1); // 💡 Reset page to 1 after search
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // ... (rest of filtering logic)
    const filteredByCategory =
      category === "All"
        ? products
        : products.filter((product) =>
            product.categories?.includes(category)
          );

     const finalResults = searchQuery
     ? filteredByCategory.filter((product) =>
       product.name.toLowerCase().includes(searchQuery)
       )
     : filteredByCategory;

    setFilteredProducts(finalResults);
    setCurrentPage(1); // 💡 Reset page to 1 after category change
  };

  // 💡 Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of the product list on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
// ... (rest of the component)

  // ... (inside the return statement)

  return (
    <>
      <Header/>
      <Radio onCategoryChange={handleCategoryChange} />

      <Box sx={{ p: 2, minHeight: '30vh' }}>
        <Grid container spacing={3}>
          {currentProducts.map((product) => { // 💡 Use currentProducts
            
            // 💡 WORD TRUNCATION LOGIC (2-3 words)
            const productName = product.name || "";
            const wordLimit = 3;
            const words = productName.split(" ");
           const limitedName = words.slice(0, wordLimit).join(" ");
            const shouldShowEllipsis = words.length > wordLimit;
            const displayTitle = limitedName + (shouldShowEllipsis ? "..." : "");

            // ... (inside the currentProducts.map)

            // ... (inside the currentProducts.map)

            return (
              <Grid 
                  item 
                  xs={8}   // 2 items per row
                  sm={6}   // 3 items per row
                  md={4}   // 4 items per row
                  key={product.id}
              >
                 <Link href={`/products/${product.id}`} passHref style={{ textDecoration: 'none' }}>
                       <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                       {/* Product Image - **CRITICAL FIX HERE** */}
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                       // 💡 Set a fixed height for consistency across rows
                      sx={{ 
                          height: { xs: 100, sm: 150, md: 180 },
                          width:{xs:100,sm:150, md:180 },
                          objectFit: 'cover', 
                          p: 1 
                        }} 
                   />

                   {/* Product Details - **TRUNCATED NAME HEIGHT FIX** */}
                   <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                     <Typography 
                       component="h2" 
                        sx={{ height: 20, overflow: 'hidden', fontWeight: 'bold' }} 
                      >
                        {displayTitle}
                      </Typography>
                    </CardContent>
                    {/* Button */}
                    <Box sx={{ p: 1.5, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        color="primary"
                        endIcon={<ShoppingCartIcon />}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents navigating to product page
                          e.preventDefault(); // Prevents default link action
                          window.open(product.link, "_blank");
                        }}
                      >
                        Buy on Amazon
                      </Button>
                    </Box>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
 
      {/* 💡 PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </>
  );
};

export default ProductsPage;
