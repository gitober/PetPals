import React from 'react';
import '../style/searchbar.css';

const SearchBar = ({ searchTerm, setSearchTerm, handleKeyPress }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  </div>
);

export default SearchBar;
