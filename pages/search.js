import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { XCircleIcon } from '@heroicons/react/outline';
import ProductItem from '../components/ProductItem';
import {Product,Category,Subcategory} from '../models/Product';
import db from '../utils/db';

const PAGE_SIZE = 12;

const prices = [
  {
    name: 'TND 1 to 50',
    value: '1-50',
  },
  {
    name: 'TND 51 to 200',
    value: '51-200',
  },
  {
    name: 'TND 201 to 1000',
    value: '201-1000',
  },
];



export default function Search(props) {
  const router = useRouter();

  const {
    query = 'all',
    category = 'all',
    subcategory='all',
    brand = 'all',
    price = 'all',
    sort = 'featured',
    page = 1,
  } = router.query;

  const { products, countProducts, categories,subcategories, brands, pages,subcategoryi,categoryi } = props;

  const filterSearch = ({
    page,
    category,
    subcategory,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: router.pathname,
      query: query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const subcategoryHandler = (e) => {
    filterSearch({ subcategory: e.target.value });
  };
  const pageHandler = (page) => {
    filterSearch({ page });
  };
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
 
  
  
  
  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  
  };




  return (
    <Layout title="search">
      <div className="grid md:grid-cols-4 md:gap-6">
        <div className='mr-5'>
          <div className="my-3">
            <h2>Categories</h2>
            {console.log(category)}
            <select
              className="px-6"
              value={category.name}
              onChange={categoryHandler}
            >
              <option value="all">All</option>
              {categories &&
                categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                  
                ))}
            </select>
          </div>
          <div className="my-3">
            <h2>Subcategories</h2>
            <select
              className="px-6"
              value={subcategory.name}
              onChange={subcategoryHandler}
            >
              <option value="all">All</option>
              {subcategory== subcategory&&
              subcategories &&
                subcategories
                .filter((sub) => sub.category === category)
                .map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.name}>
                    {subcategory.name}
                  </option>
                ))}
            </select>
          </div>
          {/* <div className="mb-3">
            <h2>Brands</h2>
            <select className="w-full" value={brand} onChange={brandHandler}>
              <option value="all">All</option>
              {brands &&
                brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
          </div> */}
          <div className="mb-3">
            <h2>Prices</h2>
            <select className="px-6" value={price} onChange={priceHandler}>
              <option value="all">All</option>
              {prices &&
                prices.map((price) => (
                  <option key={price.value} value={price.value}>
                    {price.name}
                  </option>
                ))}
            </select>
          </div>

          
        </div>
        <div className="md:col-span-3">
          <div className="mb-2 flex items-center justify-between border-b-2 pb-2">
            <div className="flex items-center">
              {products.length === 0 ? 'No' : countProducts} Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {category !== 'all' && ' : ' + category}
              {subcategory !== 'all' && ' : ' + subcategory}
              {brand !== 'all' && ' : ' + brand}
              {price !== 'all' && ' : Price ' + price}
 
              &nbsp;
              {(query !== 'all' && query !== '') ||
              category !== 'all' ||
              subcategory !== 'all' ||
              brand !== 'all' ||
              price !== 'all' ? (
                <button onClick={() => router.push('/search')}>
                  <XCircleIcon className="h-5 w-5" />
                </button>
              ) : null}
            </div>    
            <div>
              Sort by{' '}
              <select value={sort} onChange={sortHandler}>
                <option value="featured">Featured</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="toprated">Customer Reviews</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
            {console.log(categoryi)}
              {
              category != "all" && (
              products.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              )))}
              {
                category=='all' &&(
                  products.map((product) => (
                    <ProductItem
                      key={product._id}
                      product={product}
                      addToCartHandler={addToCartHandler}
                    />
                  ))
                )
              }
              {/* {
                category =="all" && subcategory =="all" &&(
                  products.map((product) => (
                    <ProductItem
                      key={product._id}
                      product={product}
                      addToCartHandler={addToCartHandler}
                    />
                  ))
                )
              } */}

              
            </div>
            <ul className="flex">
              {products.length > 0 &&
                [...Array(pages).keys()].map((pageNumber) => (
                  <li key={pageNumber}>
                    <button
                      className={`default-button m-2 ${
                        page == pageNumber + 1 ? 'font-bold' : ''
                      } `}
                      onClick={() => pageHandler(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const subcategory = query.subcategory || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';
  
  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  // const categoryFilter = category && category !== 'all' ? { category } : {};
  // const subcategoryFilter = subcategory && subcategory !== 'all' ? { subcategory } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const order =
    sort === 'featured'
      ? { isFeatured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  await db.connect();
  const categoryi = await Category.find({name: category});
  const subcategoryi = await Category.find({name: subcategory});
  const categories = await Category.find();
  const subcategories = await Subcategory.find().lean();
  const brands = await Product.find().distinct('brand');

  const matchingSubcategoryIds = subcategoryi.map((subcategory) => subcategory._id);

  // Get the IDs of the matching categories
  const matchingCategoryIds = categoryi.map((category) => category._id);
  let productDocs;
  if(category || ''){
     productDocs = await Product.find(
      {
        $or: [
          { subcategory: { $in: matchingSubcategoryIds } },
          { category: { $in: matchingCategoryIds } },
        ],
        ...queryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
      },
      '-reviews'
    ).populate('category').populate('subcategory')
      .sort(order)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean();
  } else {
    productDocs = await Product.find(
      {
        ...queryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
      },
      '-reviews'
    ).populate('category').populate('subcategory')
      .sort(order)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean();
  }

 
  const countProducts = await Product.countDocuments({

    categoryi,
     subcategoryi,
 
    ...queryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });

  await db.disconnect();
  const products = productDocs.map(db.convertDocToObj);


  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories: JSON.parse(JSON.stringify(categories)),
      subcategories: JSON.parse(JSON.stringify(subcategories)),
      brands,
      subcategoryi,
      categoryi: JSON.parse(JSON.stringify(categoryi)),
    },
  };
}
