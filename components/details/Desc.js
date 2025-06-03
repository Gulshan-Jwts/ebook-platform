"use client";
import Image from 'next/image';
import React from 'react';

const Desc = ({book,averageRating}) => {
	return (
		<>
			<section className='book-section'>
				<div className='book-details'>
					<Image
						width={200}
						height={300}
						src={book.image || '/placeholder.jpeg'}
						alt={`${book.title} Book Cover`}
						className='book-image'
					/>
					<div className='book-info'>
						<h1>{book.title}</h1>
						<div className='author'>By {book.author}</div>
						<div className='rating'>
							{[...Array(5)].map((_, index) => (
								<svg
									key={index}
									xmlns='http://www.w3.org/2000/svg'
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='currentColor'>
									<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
								</svg>
							))}
							<span style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>
								({averageRating} / 5)
							</span>
						</div>
						<div className='price'>
							<span className='old-price'>
								<s>{book.oldPrice}</s>
							</span>
							<span className='current-price'> {book.currentPrice}</span>
						</div>
					</div>
				</div>
			</section>

			<section className='description-section'>
				<h2>Book Description</h2>
				<p>{book.description}</p>
			</section>
		</>
	);
};

export default Desc;
