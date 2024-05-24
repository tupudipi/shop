import Navbar from "./components/Navbar";
import CategoryShow from "./components/CategoryShow";

export default function Home() {
  return (
    <>
    <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <h1 className="text-4xl font-bold">Hello, World!</h1>
        <CategoryShow page="home" categoryID={1}/>
        <CategoryShow page="home" categoryID={2}/>
        <CategoryShow page="home" categoryID={3}/>
        <CategoryShow page="home" categoryID={4}/>
        <CategoryShow page="home" categoryID={5}/>
        <CategoryShow page="home" categoryID={6}/>
      </main>
    </>

  );
}
