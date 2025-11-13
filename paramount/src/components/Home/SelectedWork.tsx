const works = [
  {
    img: "/img/5.png",
    info: "GREAT MINDS THINK ALIKE, 2025"
  },
  {
    img: "/img/6.png",
    info: "FIRE x BTS, 2025"
  },
  {
    img: "/img/7.png",
    info: "YOUNG BUFFALO, 2024"
  },
  {
    img: "/img/8.jpg",
    info: "OLD CARPENTER’S, 2024"
  },
  {
    img: "/img/9.png",
    info: "MA DAO THANH CONG, 2023"
  },
];

const SelectedWork = () => {
  return (
    <section className="px-10 pt-32 pb-40 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
        <h1 className="text-7xl font-medium tracking-tighter">
          Work
        </h1>

        <div className="group cursor-pointer">
          <div className="overflow-hidden">
            <img
              src={works[0].img}
              className="w-full aspect-[16/9] object-cover transition-all duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <p className="text-gray-500 text-sm mt-1">{works[0].info}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {works.slice(1).map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="overflow-hidden">
              <img
                src={item.img}
                className="w-full aspect-[16/9] object-cover transition-all duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">{item.info}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SelectedWork;