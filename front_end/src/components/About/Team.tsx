const us = [
  {
    img: "/img/About Us/1.png",
    name: "Michael Bierut",
    exp: "New York"
  },
  {
    img: "/img/About Us/2.png",
    name: "Michael Gericke",
    exp: "New York"
  },
  {
    img: "/img/About Us/3.png",
    name: "Luke Hayman",
    exp: "New York"
  },
  {
    img: "/img/About Us/4.png",
    name: "Jody Hudson-Powell",
    exp: "London"
  },
  {
    img: "/img/About Us/5.png",
    name: "Angus Hyland",
    exp: "London"
  },
  {
    img: "/img/About Us/6.png",
    name: "Natasha Jen",
    exp: "New York"
  },
  {
    img: "/img/About Us/7.png",
    name: "Domenic Lippa",
    exp: "London"
  },
  {
    img: "/img/About Us/8.png",
    name: "Giorgia Lupi",
    exp: "New York"
  },
  {
    img: "/img/About Us/9.png",
    name: "Samar Maakaroun",
    exp: "London"
  },
  {
    img: "/img/About Us/10.png",
    name: "Jon Marshall",
    exp: "London"
  },
  {
    img: "/img/About Us/11.png",
    name: "Abbott Miller",
    exp: "New York"
  },
  {
    img: "/img/About Us/12.png",
    name: "Hugh Miller",
    exp: "London"
  },
  {
    img: "/img/About Us/13.png",
    name: "Emily Oberman",
    exp: "New York"
  },
  {
    img: "/img/About Us/14.png",
    name: "Justus Oehler",
    exp: "Berlin"
  },
  {
    img: "/img/About Us/15.png",
    name: "Eddie Opara",
    exp: "New York"
  },
  {
    img: "/img/About Us/16.png",
    name: "Harry Pearce",
    exp: "London"
  },
];

const Team = () => {
  return (
    <section className="px-10 pt-40 pb-60 max-w-[1280px] mx-auto">
      <h1 className="text-7xl font-medium tracking-tighter mb-10">
        About Us
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {us.map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="overflow-hidden">
              <img
                src={item.img}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{item.exp}</p>
            <h3 className="text-lg font-semibold leading-snug mb-8">{item.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;