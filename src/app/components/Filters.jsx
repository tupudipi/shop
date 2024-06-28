// Filters.js (Server Component)
import { Suspense } from 'react';
import FiltersClient from './FiltersClient';

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}

export default async function Filters() {
  const categories = await getCategories();

  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <FiltersClient initialCategories={categories} />
    </Suspense>
  );
}