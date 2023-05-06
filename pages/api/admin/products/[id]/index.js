import { getSession } from 'next-auth/react';
import {Product, Category, Subcategory} from '../../../../../models/Product';
import db from '../../../../../utils/db';
import mongoose from "mongoose";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'PUT') {
    return putHandler(req, res, user);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const getHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id).populate('category').populate('subcategory').exec();
  await db.disconnect();
  res.send(product);
};
const putHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    
    // const category =  req.body.category;
    // const subcategory = req.body.subcategory;
    // const newCategory = await Category.findOne({ name: category });
    // if (!newCategory) {
    //   const createdCategory = await Category.create({ name: category });
    //   categoryId = createdCategory._id;
    // } else {
    //   categoryId = newCategory._id;
    // }
    // const newSubcategory = await Subcategory.findOne({ name: subcategory });
    // if (!newSubcategory) {
    //   const createdSubcategory = await Subcategory.create({
    //     name: subcategory
    //   });
    //   subcategoryId = createdSubcategory._id;
    // } else {
    //   subcategoryId = newSubcategory._id;
    // }    

    const updatedCategory = await Category.findById(product.category);
    if(updatedCategory){
      updatedCategory.name= req.body.category;
      await updatedCategory.save();
    }

    // (
    //   { name: req.body.category },
    //   { name: req.body.category },
    //   { new: true, upsert: true }
    // );
    const updatedSubcategory = await Subcategory.findById(product.subcategory);
    if(updatedSubcategory){
      updatedSubcategory.name=req.body.subcategory;
      updatedSubcategory.category= req.body.category;
      await updatedSubcategory.save();
    }
    // { name: req.body.subcategory },
      // { name: req.body.subcategory },
      // { new: true, upsert: true }

    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.image = req.body.image;
    product.video = req.body.video;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
};
const deleteHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: 'Product deleted successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
};
export default handler;
