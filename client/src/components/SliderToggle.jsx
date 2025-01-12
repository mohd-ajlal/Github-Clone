import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import PropTypes from 'prop-types';

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const SliderToggle = ({ selected, setSelected }) => {
  return (
    <div className="relative flex w-fit items-center rounded-full">
      <button
        className={`${TOGGLE_CLASSES} ${
          selected === "light" ? "text-slate-800" : "text-slate-300"
        }`}
        onClick={() => setSelected("light")}
      >
        <FiSun className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Light</span>
      </button>

      <button
        className={`${TOGGLE_CLASSES} ${
          selected === "dark" ? "text-white" : "text-slate-500"
        }`}
        onClick={() => setSelected("dark")}
      >
        <FiMoon className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Dark</span>
      </button>

      <div
        className={`absolute inset-0 z-0 flex ${
          selected === "dark" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
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
