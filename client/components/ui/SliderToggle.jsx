import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import PropTypes from 'prop-types';

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const SliderToggle = ({ selected, setSelected }) => {
  const toggleTheme = () => {
    setSelected(selected === "light" ? "dark" : "light");
  };

  return (
    <div className="relative flex w-fit items-center rounded-full">
      <button
        className={`${TOGGLE_CLASSES} ${
          selected === "light" ? "text-white" : "text-white"
        }`}
        onClick={toggleTheme}
      >
        {selected === "light" ? (
          <>
            <FiMoon className="relative z-10 text-lg md:text-sm" />
            {/* <span className="relative z-10">Dark</span> */}
          </>
        ) : (
          <>
            <FiSun className="relative z-10 text-lg md:text-sm" />
            {/* <span className="relative z-10">Light</span> */}
          </>
        )}
      </button>

      <div
        className={`absolute inset-0 z-0 flex ${
          selected === "dark" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-full rounded-full bg-gradient-to-r dark:from-cyan-400 dark:to-cyan-600 from-gray-600 to-black"
        />
      </div>
    </div>
  );
};

SliderToggle.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default SliderToggle;