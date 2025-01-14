import React from "react";
import "../../../style/search-bar.css";

const SearchBar = ({ searchTerm, setSearchTerm, handleKeyPress, clearSearchTerm }) => (
  <div className="search-bar" style={{ padding: 0, margin: 0 }}>
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
