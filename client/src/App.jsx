import { useState } from "react";
import SliderToggle from "./components/SliderToggle";

function App() {
  const [selected, setSelected] = useState("light");

  return (
    <div
      className={`h-screen grid px-4 transition-colors bg-cover bg-center`}
      style={{
        backgroundImage: `url(/${
          selected === "light" ? "bg1.jpg" : "bg2.jpg"
        })`,
      }}
    >
      <div className="ml-[180vh] mt-5">
        <SliderToggle selected={selected} setSelected={setSelected} />
      </div>
    </div>
  );
}

export default App;
