import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import PropTypes from 'prop-types';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        style={styles.input}
        className="w-64 sm:w-72 lg:w-80 py-2 pl-4 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        style={styles.button}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
      >
        <FiSearch size={20} />
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
