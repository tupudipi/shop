'use client'

import { useState, useEffect } from 'react';
import ProductComments from './ProductComments';

const ProductDetails = () => {
  const [activeSection, setActiveSection] = useState('description');

  useEffect(() => {
    const handleScroll = () => {
      const descriptionElement = document.getElementById('description');
      const reviewsElement = document.getElementById('reviews');

      if (window.pageYOffset >= reviewsElement.offsetTop) {
        setActiveSection('reviews');
      } else if (window.pageYOffset >= descriptionElement.offsetTop) {
        setActiveSection('description');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="flex bg-blue-600 p-4 sticky top-0">
        <a
          href="#description"
          className={`mr-4 text-white ${activeSection === 'description' ? 'underline' : ''}`}
        >
          Description
        </a>
        <a
          href="#reviews"
          className={`text-white ${activeSection === 'reviews' ? 'underline' : ''}`}
        >
          Reviews
        </a>
      </div>
      <div id="description">Product Description
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur dolorem, vero velit reprehenderit quis deleniti placeat assumenda fuga? Facilis in, libero delectus quibusdam nemo non error hic cum ratione laudantium.
      Vitae id consectetur esse mollitia nulla placeat, aut exercitationem officia consequuntur! Necessitatibus sed eligendi commodi nam dolorum earum libero, quam sapiente quaerat sequi a architecto fuga quibusdam repellat, et hic!
      Consectetur omnis, sapiente ad natus nostrum facilis aspernatur esse expedita, iste amet dolorem ipsum alias eveniet incidunt nulla facere autem laborum reiciendis! Neque est sed excepturi harum libero deserunt veritatis!
      Error, nisi. Earum autem numquam eius hic nihil illum doloribus voluptas voluptatum sunt ad quis optio laboriosam laudantium excepturi, a ipsum cum quibusdam. Aliquam quia eaque iusto explicabo odit itaque!
      Quas blanditiis doloribus quis. Modi blanditiis recusandae voluptatum facilis placeat aliquam nulla, animi nesciunt repudiandae dicta explicabo, laudantium, nam odit molestias harum ullam? Esse beatae quos, molestiae assumenda culpa quam!
      Cum accusamus voluptas iste, eaque sint tempora placeat dolor illum et officia suscipit totam quibusdam aut eum ad? Sit aperiam facilis vitae minima fugit nam vero quasi adipisci fugiat distinctio.
      Iste ex aspernatur debitis molestiae ut commodi tempore neque, possimus sed dignissimos quae maiores excepturi similique suscipit eum iure omnis aliquid quod aliquam eveniet quaerat. Sed deleniti neque impedit ea?
      Quisquam molestiae impedit modi dolorem amet suscipit incidunt odio aut deleniti obcaecati iste, placeat et perferendis sint rerum error repudiandae consequatur quaerat? Sunt veritatis nihil dolorum! Quaerat esse aspernatur perferendis.
      Maxime sint ullam ducimus aliquam numquam. Omnis vel quos doloremque beatae aspernatur ad praesentium illo pariatur temporibus. Nam consectetur repudiandae recusandae eaque ipsum perferendis aliquid ad, vero error itaque sit.
      Ea maxime soluta magnam nostrum quam minima maiores saepe praesentium molestiae impedit exercitationem sequi temporibus autem, totam qui aliquid est quas non libero voluptatem quaerat? Molestias quaerat reprehenderit soluta dolorum!</p></div>
      <div id="reviews">
        <ProductComments />
      </div>
    </div>
  );
};

export default ProductDetails;