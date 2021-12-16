const SearchItem = ({ search, setSearch }) => {
    return (
        <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search">Search</label>
            <input
                id="search"
                type="text"
                role="searchbox"
                placeholder="Search Items"
                value={search} //set value equal to state
                onChange={(e) => setSearch(e.target.value)} //set the new state
            />
        </form>
    )
}

export default SearchItem
