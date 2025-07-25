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
    <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 p-6 rounded-2xl shadow-2xl mb-8">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search by title"
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            aria-label="Search by title"
          />
        </div>

        <div className="min-w-40">
          <select
            name="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
            aria-label="Filter by genre"
          >
            <option value="" className="bg-purple-900 text-white">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g} className="bg-purple-900 text-white">
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-40">
          <select
            name="author"
            value={author || ""}
            onChange={(e) => setAuthor && setAuthor(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
            aria-label="Filter by author"
          >
            <option value="" className="bg-purple-900 text-white">All Authors</option>
            {authors.map((a) => (
              <option key={a} value={a} className="bg-purple-900 text-white">
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-40">
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
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
            aria-label="Filter by visibility"
          >
            <option value="" className="bg-purple-900 text-white">All</option>
            <option value="visible" className="bg-purple-900 text-white">Visible</option>
            <option value="hidden" className="bg-purple-900 text-white">Hidden</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;