import { useState } from "react";
import { Link } from "react-router-dom";

const works = [
  { img: "/img/5.png", info: "GREAT MINDS THINK ALIKE, 2025" },
  { img: "/img/6.png", info: "FIRE x BTS, 2025" },
  { img: "/img/7.png", info: "YOUNG BUFFALO, 2024" },
  { img: "/img/8.jpg", info: "OLD CARPENTER’S, 2024" },
  { img: "/img/9.png", info: "MA DAO THANH CONG, 2023" },
  { img: "/img/10.png", info: "ALL HAIL THE KING, 2023" },
  { img: "/img/11.jpg", info: "OTHER SIDE OF TRUTH, 2022" },
  { img: "/img/12.jpg", info: "TALK / TOUCH, 2022" },
  { img: "/img/13.jpg", info: "420ENT, 2021" },
  { img: "/img/14.jpg", info: "SHOWCASE FASHION, 2021" },
];

const Article = () => {
  const [visible, setVisible] = useState(6);

  const handleLoadMore = () => {
    setVisible(prev => prev + 6);
  };

  return (
    <section className="px-10 pt-32 pb-40 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {works.slice(0, visible).map((item, index) => (
          <Link to={`/work/details/${index}`} key={index} className="group cursor-pointer">
            <div className="overflow-hidden">
              <img
                src={item.img}
                className="w-full aspect-[16/9] object-cover transition-all duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">{item.info}</p>
          </Link>
        ))}
      </div>

      {visible < works.length && (
        <div className="text-center mt-14">
          <button
            onClick={handleLoadMore}
            className="text-xl tracking-tighter relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full">
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default Article;