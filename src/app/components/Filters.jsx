'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const Filters = () => {
  const categories = ['shirts', 'hoodies', 'jackets', 'bags', 'stickers', 'others'];
  const [active, setActive] = useState(categories[0]);
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden relative border rounded bg-white shadow-sm focus:shadow-md" ref={ref}>
        <div
          onClick={() => {
            setOpenSelect(!openSelect);
          }}
          className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 dark:border-white/30"
        >
          <div>{active}</div>
        </div>
        {openSelect && (
          <div
            onClick={() => {
              setOpenSelect(false);
            }}
            className="absolute z-40 w-full rounded-b-md bg-white/95 p-4 shadow-md transition-all"
          >
            {categories.map((category, i) => (
              <Link key={i} href={`/search/${category}`}>
                <p onClick={() => setActive(category)} className="block p-2 hover:bg-indigo-200/75 cursor-pointer rounded-md transition-all hover:shadow text-start">
                  {category}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <ul className="bg-white p-2 rounded-lg border-2 self-start min-w-32">
          {categories.map((category) => (
            <Link key={category} href={`/search/${category}`}>
              <li className={`my-1 p-2 hover:bg-indigo-200/75 cursor-pointer rounded-md transition-all hover:shadow text-start`}>
                {category}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Filters;