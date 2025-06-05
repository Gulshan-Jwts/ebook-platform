"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useData } from "./DataContext";
import Image from "next/image";

const Navbar = () => {
  const { data: session, status } = useSession();

  const { dbUser } = useData();
  const cartLength = dbUser?.cartList.length;

  return (
    <header>
      <Link href="/" className="logo">
        <Image
          width={150}
          height={50}
          src="/navLogo.jpg"
          alt="Logo"
          className="logo-image"
        />
      </Link>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : !session ? (
        <>
          <Link href="/user/login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
            </svg>
          </Link>
        </>
      ) : (
        <div className="header-icons">
          <Link href="/user/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
            </svg>
          </Link>
          <Link href="/user/library">
            <svg
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              height="1.5em"
              width="1.5em"
            >
              <path
                fill="currentColor"
                d="M18.65 22.5H35.4q.65 0 1.075-.425.425-.425.425-1.075 0-.65-.425-1.075-.425-.425-1.075-.425H18.65q-.65 0-1.075.425-.425.425-.425 1.075 0 .65.425 1.075.425.425 1.075.425Zm0 4.5h8.25q.65 0 1.075-.425.425-.425.425-1.075 0-.65-.425-1.075Q27.55 24 26.9 24h-8.25q-.65 0-1.075.425-.425.425-.425 1.075 0 .65.425 1.075Q18 27 18.65 27Zm0-9H35.4q.65 0 1.075-.425.425-.425.425-1.075 0-.65-.425-1.075Q36.05 15 35.4 15H18.65q-.65 0-1.075.425-.425.425-.425 1.075 0 .65.425 1.075Q18 18 18.65 18ZM13 38q-1.2 0-2.1-.9-.9-.9-.9-2.1V7q0-1.2.9-2.1.9-.9 2.1-.9h28q1.2 0 2.1.9.9.9.9 2.1v28q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h28V7H13v28Zm-6 9q-1.2 0-2.1-.9Q4 42.2 4 41V11.5q0-.65.425-1.075Q4.85 10 5.5 10q.65 0 1.075.425Q7 10.85 7 11.5V41h29.5q.65 0 1.075.425Q38 41.85 38 42.5q0 .65-.425 1.075Q37.15 44 36.5 44Zm6-37v28V7Z"
              />
            </svg>
          </Link>
          <Link href="/user/cart" className="cart-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartLength > 0 && <span className="cart-count">{cartLength}</span>}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
