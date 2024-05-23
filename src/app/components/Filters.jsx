import FiltersClient from './FiltersClient';

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCategories`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

export default async function Filters() {
  const categories = await getCategories();
  return <FiltersClient categories={categories} />;
}
