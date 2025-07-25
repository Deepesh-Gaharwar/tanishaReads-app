import React from "react";

const FilterBar = ({
  query,
  setQuery,
  genre,
  setGenre,
  visibility,
  setVisibility,
  genres = [],
  authors = [],
  author,
  setAuthor,
}) => {
  // Map visibility string to boolean or empty string
  // Assuming backend expects isPublic: true/false
  const handleVisibilityChange = (e) => {
    const val = e.target.value;
    if (val === "visible") setVisibility(true);
    else if (val === "hidden") setVisibility(false);
    else setVisibility(""); // All
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <input
        type="text"
        placeholder="Search by title"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input input-bordered"
        aria-label="Search by title"
      />

      <select
        name="genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="select select-bordered"
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select
        name="author"
        value={author || ""}
        onChange={(e) => setAuthor && setAuthor(e.target.value)}
        className="select select-bordered"
        aria-label="Filter by author"
      >
        <option value="">All Authors</option>
        {authors.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        name="visibility"
        value={
          visibility === true
            ? "visible"
            : visibility === false
            ? "hidden"
            : ""
        }
        onChange={handleVisibilityChange}
        className="select select-bordered"
        aria-label="Filter by visibility"
      >
        <option value="">All</option>
        <option value="visible">Visible</option>
        <option value="hidden">Hidden</option>
      </select>
    </div>
  );
};

export default FilterBar;
