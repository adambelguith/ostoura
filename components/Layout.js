/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
import { SearchIcon , } from '@heroicons/react/outline';
import { Icon } from '@iconify/react';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Oustoura promo' : 'Oustoura promo'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-24 items-center mx-12 justify-between mb-4 mt-3">
            <a href="/" className="cursor-pointer">
            <div className='flex space-x-1 '>
            <img
            src="https://res.cloudinary.com/dgpxnbpxq/image/upload/v1672654401/logo/mahmoud2_ym0wyl.png"
            alt="logo"
            width={60}
            height={60}
          />
          </div>
            </a>
            <form
              onSubmit={submitHandler}
              className=" h-10 w-60  hidden  justify-center md:flex"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-l-lg p-1 text-sm w-60  focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded-r-lg  bg-blue-400 p-2  text-sm dark:text-white "
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className="h-5 w-5 "></SearchIcon>
                
              </button>
            </form>
            <div className=' flex space-x-1'>
              <Link href="/cart">
                <button className="mr-2 flex space-x-0"> 
                <Icon icon="heroicons-outline:shopping-cart" color="#597787" width="30" height="30" className="mt-2 pt-25" />
                  {cartItemsCount > 0 && (
                    <span className=" mb-5 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                  {/* <div className="flex-row grid-rows-2"> */}
                  {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
</svg> */}
                     
                  {/* </div> */}
                </button>
              </Link>
            
              {status === 'loading' ? (
                <Menu as="div" className="absolute z-40 inline-block">
                <Menu.Button className="text-blue-600 font-bold">
                  {/* {session.user.name} */}
                  <Icon icon="mdi:user-circle" color="#597787" width="35" height="35" />
                </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                  <Menu.Item>
                    <DropdownLink className="dropdown-link" href="/login">
                      Login
                    </DropdownLink>
                  </Menu.Item>
                  </Menu.Items>
                  </Menu>
              ) : session?.user ? (
                <Menu as="div" className="relative z-40 inline-block mt-1">
                  <Menu.Button className="text-blue-600 font-bold">
                    {/* {session.user.name} */}
                    <Icon icon="mdi:user-circle" color="#597787" width="35" height="35" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className ="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4 pb-10">{children}</main>
        <footer className="flex h-28 pt-10 mt-4 justify-center items-center shadow-inner">
        <Link href="/">
            <div className='mb-8'>
            <img
            src="https://res.cloudinary.com/dgpxnbpxq/image/upload/v1672654401/logo/mahmoud2_ym0wyl.png"
            alt="logo"
            className="cursor-pointer"
            width={60}
            height={60}
          />
          </div>
            </Link>
        </footer>
      </div>
    </>
  );
}
