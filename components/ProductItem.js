/* eslint-disable @next/next/no-img-element */
// import { get } from 'mongoose';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

export default function ProductItem({ product, addToCartHandler }) {


    //   const timestamp = new Date().getTime() /3600;


    //   var one_day = 1000 * 60 * 60 * 24

    //  // To set present_dates to two variables
    //   var present_date = new Date();
    //         // 0-11 is Month in JavaScript
    //   var christmas_day = new Date(present_date.getFullYear(), 11, 25)
    //        // To Calculate next year's Christmas if passed already.
    //   if (present_date.getMonth() == 11 && present_date.getdate() > 25)
    //   christmas_day.setFullYear(christmas_day.getFullYear() + 1)
    //        // To Calculate the result in milliseconds and then converting into days
    //   var Result = Math.round(christmas_day.getTime() -present_date.getTime()) / (one_day);
    //       // To remove the decimals from the (Result) resulting days value
    //   var Final_Result = Result.toFixed(0);

  const [days, setDays] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the time remaining until the promotion starts
      const current = new Date( product.createdAt);
      const promotionStart = current.setDate(current.getDate()+5);
      const currentTime = new Date();
      const timeRemaining = promotionStart - currentTime;
      
      // Convert the time remaining to days, hours, minutes, and seconds
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Update the state variables with the calculated values
      setDays(days );
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, []);



  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeRemaining((prevTime) => prevTime - 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // const hours = Math.floor(timeRemaining / 3600);
  // const minutes = Math.floor((timeRemaining % 3600) / 60);
  // const seconds = timeRemaining % 60;



  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <img
            src={product.image[0]}
            alt={product.name}
            className="rounded shadow object-cover h-64 w-full product-image"
          />
        </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-2 ">
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className="text-2xl product-name font-mono font-extrabold  hover:font-bold capitalize">{product.name}</h2>
          </a>
        </Link>
        <div className="promotion  text-lg  font-extrabold ">
         {/* - {hours}h {minutes}m {seconds}s */}
         {/* {formatDate(getTime)} */}
           {days} Day {hours} H {minutes} M 
    </div>
        <p className="text-2xl product-name font-mono font-extrabold  hover:font-bold capitalize">${product.price}</p>
        <button
          className="primary-button button-product"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
