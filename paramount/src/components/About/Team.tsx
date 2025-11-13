import { Link } from "react-router-dom";
import { teamData } from "../../data/teamAbout.tsx";

const Team = () => {
  return (
    <section className="px-10 pt-40 pb-60 max-w-[1280px] mx-auto">
      <h1 className="text-7xl font-medium tracking-tighter mb-10">About Us</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {teamData.map((item, index) => (
          <Link to={`/about/details/${index}`} key={index} className="group cursor-pointer">
            <div className="overflow-hidden">
              <img
                src={item.img}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{item.exp}</p>
            <h3 className="text-lg font-semibold leading-snug mb-8">{item.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Team;