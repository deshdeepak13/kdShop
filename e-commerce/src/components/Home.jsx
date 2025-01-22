import React, { useEffect, useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; //lib/styles/carousel.min.css
import { Carousel } from 'react-responsive-carousel';
import ProductCard from './ProductCard';
import axios from 'axios';

const Home = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch product data from backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/products');
        setProducts(response.data); // Assuming the response has a 'products' field
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs once on mount



  return (
    <>
    <section className='banners'>
      
    <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        interval={1500}
      >
        <div>
          <img src="slide1.webp" alt="Image 1" />
          {/* <p className="legend">Image 1</p> */}
        </div>
        <div>
          <img src="slide3.webp" alt="Image 2" />
          {/* <p className="legend">Image 2</p> */}
        </div>
        <div>
          <img src="slide1.webp" alt="Image 3" />
          {/* <p className="legend">Image 3</p> */}
        </div>
      </Carousel>


    </section>



    <section className="section1 flex mt-10 gap-5 flex-wrap">

    {Array.isArray(products) && products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product._id}
              name={product.name}
              id={product._id}
              price={product.currentPrice}
              originalPrice={product.MRP}
              discount={product.discount}
              imageUrl={`http://localhost:3000/public/images/${product.imageUrl?.[0] || 'default-product.jpg'}`}

            />  
          ))
        ) : (
          <p>No products found.</p>
        )}

    

{/* <div>
<ProductCard
        name="Condom"
        id={2}
        price={500}
        originalPrice={700}
        discount={25}
        imageUrl="https://rukminim2.flixcart.com/image/612/612/xif0q/condom/e/v/e/-original-imahfhvhgvpkgbcd.jpeg?q=70"
      />
    </div> */}



    </section>




    </>
  )
}

export default Home
