const Kayo = () => {
  return (
    <section className="px-10 pb-52 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <h1 className="text-7xl font-medium tracking-tighter">
            About Kayo
          </h1>
          <img src="/img/about/kayo.png" className="pt-12"/>
        </div>

        <p className="text-3xl font-serif tracking-tight">
          Our philosophy is rooted in minimalism, stripping away the unnecessary 
          to highlight what truly matters. This approach allows us to craft bold, 
          innovative and timeless solutions that are both visually striking and 
          strategically effective. We make every detail matter.
          <br /><br />
          Whether it’s designing a brand identity, producing a motion piece or 
          building a full digital experience, we approach every project with the 
          same focus: clarity, creativity and impact. The purpose guides the form.
        </p>
      </div>
    </section>
  );
};

export default Kayo;