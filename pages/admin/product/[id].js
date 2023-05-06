import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer,useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';
import {Product,Category, Subcategory} from '../../../models/Product'
import db from '../../../utils/db';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}
export default function AdminProductEditScreen() {
 
  const { query } = useRouter();
  const productId = query.id;

  const [uploaded, setUploaded] =useState(null);

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/api/admin/products/${productId}`);
      
//       await db.connect();
//   const productcat = Product.findById(query.id).populate('category subcategory').exec((err, products) => {
//     // products array will contain the products with their categories and subcategories
// });
// console.log(productcat);
//   await db.disconnect();
      try {
        
  
        dispatch({ type: 'FETCH_REQUEST' });
        
       
  
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('price', data.price);
        setValue('image', data.image);
        setValue('video',data.video)
        setValue('category', data.category.name);
        setValue('subcategory', data.subcategory.name);
        setValue('brand', data.brand);
        setValue('countInStock', data.countInStock);
        setValue('description', data.description);
        console.log(data)
        
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  const uploadHandler = async (imagess) => {
    const images = Array.from(imagess);
    return await Promise.all(
images.map(async (image,i) => {
  dispatch({ type: 'UPLOAD_REQUEST' });
        const {
         data: { signature, timestamp },
        } = await axios('/api/admin/cloudinary-sign');
        const formData = new FormData();
        formData.append('file', image);
        formData.append('signature', signature);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
        formData.append('timestamp', timestamp);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        dispatch({ type: 'UPLOAD_SUCCESS' });
        toast.success(`Image ${i} uploaded successfully`);
        return await response.json();
        
      })
    );
  };


  const videoHandler = async (e) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const {
        data: { signature, timestamp },
      } = await axios('/api/admin/cloudinary-sign');

      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData,{
        onUploadProgress: (data) => {
          setUploaded(Math.round((data.loaded /data.total)*1000))
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue('video',data.secure_url);
      toast.success('Video uploaded successfully');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };


// const categoryies = async (product) => {
//           await db.connect();
//           const productCategory = await Category.findById(product.category);
//           const productSubcategory = await Subcategory.findById(product.subcategory);
//           setCategory(productCategory);
//           setSubcategory(productSubcategory);
//           await db.disconnect();
//         };
        

const onSelectFile = async (event) =>  {

event.preventDefault();
const imageData = await uploadHandler(event.target.files);
const imageUrl = imageData.map((data)=>data.url);
setValue('image',imageUrl);

//   const selectedFiles = event.target.files;
//   const selectedFilesArray = Array.from(selectedFiles);

//   const imagesArray = await selectedFilesArray.map(async(file) => {
//     const aempty=[];
//    const url = await uploadHandler(file);
//     // console.log(url.secure_url)
//    const surl =url.secure_url;
//    console.log(surl);
//     const arraylist = aempty.map(()=> {
// return surl;
//     });
//    console.log(arraylist)
//     return Promise.resolve(url);
//   });
 
  
//   setSelectedImages((previousImages) => previousImages.concat(imagesArray));
 
  // FOR BUG IN CHROME
};
  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    subcategory,
    image,
    video,
    brand,
    countInStock,
    description,
  }) => {
    try {
  //  const imageUrl = await Promise.all(image.map(uploadHandler));
      const data = {
        name,
        slug,
        price,
        category,
        subcategory,
        image,
        video,
        brand,
        countInStock,
        description,
      }
      console.log(video)
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/products/${productId}`, data);
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a className="font-bold">Products</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full"
                  id="name"
                  autoFocus
                  {...register('name', {
                    required: 'Please enter name',
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug"
                  {...register('slug', {
                    required: 'Please enter slug',
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  className="w-full"
                  id="price"
                  {...register('price', {
                    required: 'Please enter price',
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image">image</label>
                <input
                  type="text"
                  className="w-full"
                  id="image" 
                  {...register('image', {
                    required: 'Please enter image',
                  })}
                  
                />
                {errors.image && (
                  <div className="text-red-500">{errors.image.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="imageFile">Upload image</label>
                <input
                  type="file"
                  className="w-full"
                  id="imageFile"
                  multiple 
                  onChange={onSelectFile}
                />

                {loadingUpload && <div>Uploading.... </div>}
              </div>

              <div className="mb-4">
                <label htmlFor="video">video</label>
                <input
                  type="text"
                  className="w-full"
                  id="video" 
                  {...register('video', {
                    required: 'Please enter video',
                  })}
                />
                {errors.video && (
                  <div className="text-red-500">{errors.video.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="videoFile">Upload Video</label>
                <input
                  type="file"
                  className="w-full"
                  id="videoFile"
                  multiple 
                  onChange={videoHandler}
                />

                {loadingUpload && <div>Uploading.... {uploaded}</div>}
              </div>




              <div className="mb-4">
                <label htmlFor="category">category</label>
                <input
                  type="text"
                  className="w-full"
                  id="category"
                  {...register('category', {
                    required: 'Please enter category',
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="subcategory">subcategory</label>
                <input
                  type="text"
                  className="w-full"
                  id="subcategory"
                  {...register('subcategory', {
                    required: 'Please enter subcategory',
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">{errors.subcategory.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="brand">brand</label>
                <input
                  type="text"
                  className="w-full"
                  id="brand"
                  {...register('brand', {
                    required: 'Please enter brand',
                  })}
                />
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">countInStock</label>
                <input
                  type="text"
                  className="w-full"
                  id="countInStock"
                  {...register('countInStock', {
                    required: 'Please enter countInStock',
                  })}
                />
                {errors.countInStock && (
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">description</label>
                <input
                  type="text"
                  className="w-full"
                  id="description"
                  {...register('description', {
                    required: 'Please enter description',
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? 'Loading' : 'Update'}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };







