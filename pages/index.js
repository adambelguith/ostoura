import axios from 'axios';
import { useContext,useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import {Product, Category,Subcategory} from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import { Icon } from '@iconify/react';


export default function Home({ products, featuredProducts,categories,subcategories }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;


  const [hoveredCategory, setHoveredCategory] = useState(null);
 
 //add to cart 
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      <div className='grid  md:grid-cols-4 md:gap-5'>
        
    <div className="menu">
      <ul className="menu-list">
        {categories.map((category) => (
          <li
            key={category.id}
            className="menu-list-item"
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
           <h1>
              {category.name}
              </h1>
            {hoveredCategory === category && subcategories && (
              <ul className="sub-menu">
                {subcategories.filter((sub) => sub.category === category.name)
                .map((sub) => (
                  <li key={sub.id} className="sub-menu-item">
                    <Link href={`/search?category=${category.name}&subcategory=${sub.name}`} className="sub-menu-link">
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>

        
      <div className='md:col-span-3 carous'>
      <Carousel showThumbs={false} autoPlay infiniteLoop>
        {featuredProducts.map((product) => (
          <div key={product._id}>
          <Link href={`/product/${product.slug}`} passHref>
          <div className='slider-carousel'>
          <button
          className="primary-button button-carous"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
        <div className='back-name-silder'>
        <p className='name-carous-1'>Name Product :</p>
        <p className='name-carous'>{product.name} </p>
        </div>
                <img src={product.image[0]} className='imagecarous rounded shadow object-cover h-64 w-full product-image' alt={product.name} />
                {console.log(product)}
                
                </div>
          </Link>
          
          </div>
          
          
        ))}
      </Carousel> 
      </div>
    </div>


      <div className="products-heading">
      <h2>Best Seller Products</h2>
      <p>All Categories of product</p>
    </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 products-container">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>

      <div className="icon-bar">
    <a href="#" className="facebook"><Icon icon="tabler:brand-facebook" color="mintcream" className="icons" /></a> 
    <a href="#" className="youtube"><Icon icon="ant-design:youtube-outlined" color="mintcream" className="icons" /></a>
    <a href="#" className="instgram"><Icon icon="bi:instagram" color="mintcream" className="icons" /></a>
  </div> 
    </Layout>
    

  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).populate("category", "name")
  .populate("subcategory", "name")
  .lean() // convert to plain JavaScript objects
  .exec();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  // const categories = await Product.find().distinct('category');
  const categories = await Category.find().lean();
  const subcategories = await Subcategory.find().lean();
  return {
    props: {
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
      subcategories: JSON.parse(JSON.stringify(subcategories)),
    },
  };
}
