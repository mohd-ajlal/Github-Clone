import { useEffect, useState } from "react";
import SliderToggle from "./components/SliderToggle";
import SearchBar from "./components/SearchBar";

function App() {
  const [selected, setSelected] = useState("light");

  useEffect(() => {
    document.body.className = selected;
  }, [selected]);

  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };

  return (
    <div className="h-screen grid place-items-center px-4">
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 space-y-4 inline-flex gap-5">
        
        <SearchBar onSearch={handleSearch} />
        
        <SliderToggle selected={selected} setSelected={setSelected} />
      </div>

      <div className="text-center text-white p-4 sm:p-8 lg:p-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-black dark:text-white">
          Lorem ipsum dolor sit amet.
        </p>
      </div>
    </div>
  );
}

export default App;
