import { Link } from "react-router-dom";

const ClientHeader = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-[77px] bg-white z-50">
      <div className="max-w-[1280px] mx-auto px-14 h-full flex items-center justify-between">
        <Link to="/" className="text-4xl tracking-loose font-impact">
          KAY<span className="text-[#5f518e]">O</span>
        </Link>
        <nav className="flex items-center text-black space-x-24 text-xl font-sans tracking-tighter">
          <Link to="/" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full">Home</Link>
          <Link to="/about" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full">About</Link>
          <Link to="/work" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full">Work (17)</Link>
          <button
            onClick={() => {
              const footer = document.querySelector("footer");
              footer?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
};

export default ClientHeader;