import Article from "../../../components/Work/Article";

const Work = () => {
  return (
    <div className="overflow-hidden relative w-full pt-96">
      <div className="absolute tracking-mega-tight top-36 left-1/2 -translate-x-1/2 -translate-y-1/4 text-[37rem] font-normal text-black leading-none pointer-events-none select-none whitespace-nowrap">
        W<span className="font-serif italic font-thin">O</span>RK
      </div>

      <div className="relative pt-24 z-10">
        <Article />
      </div>
    </div>
  );
};

export default Work;