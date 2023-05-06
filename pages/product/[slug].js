import axios from 'axios';
import Link from 'next/link';

import React, { useContext, useState,useRef ,useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import {Product} from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import ReactImageMagnify from 'react-image-magnify';
import ProductItem from '../../components/ProductItem';
import { Carousel } from 'react-responsive-carousel';


export default function ProductScreen(props) {
  const { product,products } = props;
  const { state, dispatch } = useContext(Store);
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }



  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  
  };


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [zoomEnabled, setZoomEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 720px)');
    const handleMediaQueryChange = () => setZoomEnabled(mediaQuery.matches);
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange();

    return () => mediaQuery.removeListener(handleMediaQueryChange);
  }, [zoomEnabled]);

const refs = useRef([]);
 refs.current = [];
 const addRefs = (el) => {
     if (el && !refs.current.includes(el)) {
         refs.current.push(el);
     }
 };

 const images = product.image;
 // eslint-disable-next-line react-hooks/rules-of-hooks
 const [img, setImg] = useState(images[0]);
 const hoverHandler = (image, i) => {
     setImg(image);
    refs.current[i].classList.add('active');
     for (var j = 0; j < images.length; j++) {
         if (i !== j) {
             refs.current[j].classList.remove('active');
         }
     }
 };
 
  return (
    
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
      </div>
      
<div className="flex flex-col space-y-20 ">    
  <div className="product-detail-container">
      <div>
      {zoomEnabled ? (
        <div className="left ">
        <div className="left_1">
            {images.map((image, i) => (
                <div
                    className={i == 0 ? 'img_wrap active' : 'img_wrap'}
                    key={i}
                    onClick={() => hoverHandler(image, i)}
                    ref={addRefs}
                >
                    <img className='' src={image} alt=""  />
                </div>
            ))}
        </div>
        <div className="left_2 rounded">
            <ReactImageMagnify
                {...{
                    smallImage: {
                        alt: 'Wristwatch by Ted Baker London',
                        isFluidWidth: true,
                        src: img,
                    },
                    largeImage: {
                        src: img,
                        width: 1500,
                        height: 1700,
                    },
                    enlargedImageContainerDimensions: {
                        width: '150%',
                        height: '150%',
                    },
                }}
            />
        </div>
    </div>
     
      ) : (
        // <img className='image-size' src={product.image[0]} alt=""  />
        <div className=''>
        <Carousel showThumbs={false} >
        {images.map((image,i) => (
          <div key={i}>
              <a className="flex">
                <img src={image} alt={product.name} />
              </a>
          </div>
        ))}
      </Carousel>
      </div>
      )}
      </div>
      
        <div className="product-detail-desc">
          <h1>{product.name}</h1>
          <div className="reviews">
             
          </div>
          <h4>Details: </h4>
          <p>{product.description}</p>
          <p className="price"> TND {product.price}</p>
          <div className="quantity">
            <h3 >Quantity: </h3> <h2 className='count-qty'> {product.countInStock > 0 ? product.countInStock : 'Unavailable'} </h2>
            
          </div>
          <div className="buttons">
            <button type="button" className="buy-now" onClick={addToCartHandler}>Add to Cart</button>
            {/* <button type="button" className="buy-now" onClick={handleBuyNow}>Buy Now</button> */}
          </div>
        </div>
      </div>

          
            
       
      {product.video === "test" ? (
        <div>

        </div>
      ) : (
   <div className="container-video">
    <video src={product.video} className="video-styling" controls loop muted  resizeMode='cover'
                    repeat={true}
                    playWhenInactive={true} />
    </div>)}

  </div>
  {zoomEnabled ? (
  <div className="maylike-products-wrapper">
          <h2>You may also like</h2>
          <div className="marquee">
            <div className="maylike-products-container">
            {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
            </div>
          </div>
      </div>):(
        <div></div>
      )}  

    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      product: product ? JSON.parse(JSON.stringify(product)) : null,
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}


