const latest = [
  {
    img: "/img/1.jpg",
    date: "June 26, 2023",
    title: "“GMTA” RUNWAY"
  },
  {
    img: "/img/2.png",
    date: "August 18, 2022",
    title: "FALL WINTER ’21"
  },
  {
    img: "/img/3.jpg",
    date: "December 12, 2023",
    title: "FALL WINTER ’20"
  },
  {
    img: "/img/4.jpg",
    date: "August 15, 2022",
    title: "SPRING SUMMER ’22"
  }
];

const LatestUpdates = () => {
  return (
    <section className="px-10 pt-40 pb-60 max-w-[1280px] mx-auto">
      <h1 className="text-7xl font-medium tracking-tighter mb-10">
        Latest Updates
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        {latest.map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="overflow-hidden">
              <img
                src={item.img}
                className="w-full h-[400px] object-cover transition-all duration-500 ease-in-out group-hover:blur-sm group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{item.date}</p>
            <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestUpdates;