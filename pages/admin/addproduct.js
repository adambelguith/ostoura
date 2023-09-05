import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer,useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';


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
 
//   useEffect(() => {
// //     const fetchData = async () => {
  
      
// // //       await db.connect();
// // //   const productcat = Product.findById(query.id).populate('category subcategory').exec((err, products) => {
// // //     // products array will contain the products with their categories and subcategories
// // // });
// // // console.log(productcat);
// // //   await db.disconnect();
     
        
    

// //     fetchData();}
//     , [ ]);

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
        

// const onSelectFile = async (event) =>  {

// event.preventDefault();
// const imageData = await uploadHandler(event.target.files);
// const imageUrl = imageData.map((data)=>data.url);
// setValue('image',imageUrl);

// };
// {
//   name,
//   slug,
//   price,
//   category,
//   subcategory,
//   image,
//   video,
//   brand,
//   countInStock,
//   description,
// }


const [videoBase64, setVideoBase64] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Extract the base64 string
        setVideoBase64(base64String);
      };
      reader.readAsDataURL(file); // Read the selected file as a data URL (base64)
    }
  };

const [imageFiles, setImageFiles] = useState([]);
const [displayImage , setDisplayImage] = useState(false)
const handleDeleteImage = (index) => {
  const updatedList = [...imageFiles];
  updatedList.splice(index, 1); 
  setImageFiles(updatedList);
};

const handleImageChange = async (e) => {
  const files = Array.from(e.target.files);
  const imagePromises = files.map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  });
  const base64Images = await Promise.all(imagePromises);
  setImageFiles(base64Images);
  setDisplayImage(true)
};

  const submitHandler = async (data) => {
    const formData = {
      ...data,
      image: imageFiles,
      video: videoBase64,
    };
      console.log(formData)
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.post(`/api/admin/products`, formData);
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Add Product`}>
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
          
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl"></h1>
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
             
              {/* <div className="mb-4">
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
              </div> */}
              <div className="mb-4">
                <label htmlFor="imageFile">Upload image</label>
                <input
                  type="file"
                  className="w-full"
                  id="imageFile"
                  multiple 
                  onChange={handleImageChange}
                />
                {displayImage && 
                <div className='flex flex-wrap space-x-4 mt-6'>
                {imageFiles.map((imageData, index) => (
                  <div key={index} >
                     <span className='cross-stand-alone ' onClick={() => handleDeleteImage(index)}></span>
                      <img className='m-4 rounded-md' src={imageData} alt={`Image ${index}`} height={128}  width={128}/>
                  </div>
                ))}
                </div>}
              </div>

              {/* <div className="mb-4">
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
              </div> */}
              <div className="mb-4">
                <label htmlFor="videoFile">Upload Video</label>
                <input
                  type="file"
                  className="w-full"
                  id="videoFile"
                  onChange={handleFileChange}
                />
                {videoBase64 && (
                    <div>
                      <video controls width="300">
                        <source src={`data:video/mp4;base64,${videoBase64}`} type="video/mp4" />
                      </video>
                    </div>
                  )}
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
                {errors.subcategory && (
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
                  Add Product
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`}>Back</Link>
              </div>
            </form>
          
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };







