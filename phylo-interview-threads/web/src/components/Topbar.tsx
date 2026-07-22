import { BackIcon, ClockIcon, ForwardIcon, SearchIcon } from "./icons.js";

export function Topbar() {
  return (
    <header className="topbar">
      <nav className="nav" aria-label="History">
        <button className="iconbtn" aria-label="Back"><BackIcon /></button>
        <button className="iconbtn" aria-label="Forward"><ForwardIcon /></button>
        <button className="iconbtn" aria-label="Recent"><ClockIcon /></button>
      </nav>

      <div className="searchbar" role="search">
        <SearchIcon />
        <span className="q">Search Phylo</span>
      </div>
    </header>
  );
}
