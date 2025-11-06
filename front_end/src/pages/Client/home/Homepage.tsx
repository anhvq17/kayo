import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollText from "../../../components/Home/ScrollText";
import ScrollSlogan from "../../../components/Home/ScrollSlogan";
import LatestUpdates from "../../../components/Home/LatestUpdates";
import SelectedWork from "../../../components/Home/SelectedWork";

const Homepage = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <div className="relative w-full">
      <section ref={ref} className="flex flex-col md:flex-row items-center justify-between max-w-[1280px] mx-auto px-8 pt-16 md:pt-32 pb-3">
        <motion.div style={{ opacity, y }} className="md:w-2/3 space-y-4 md:ml-20">
          <h1 className="text-5xl indent-28 md:text-7xl font-serif">
            <span className="leading-tight tracking-tighter">Building the next</span> <br />
            <span className="leading-tight tracking-tighter">generation of </span> <br />
            <span className="leading-tight tracking-tighter">products, brands </span>
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="italic leading-none">&</span> <br />
            <span className="leading-tight tracking-tighter">experiences.</span>
          </h1>
        </motion.div>
        <motion.div style={{ opacity, y }} className="md:w-1/2 flex justify-center mt-10 md:mt-8">
          <img src="/img/banner.jpg" className="w-[280px] h-[420px] object-cover" />
        </motion.div>
      </section>

      <ScrollText />

      <SelectedWork />
      
      <ScrollSlogan />

      <LatestUpdates />
    </div>
  )
}

export default Homepage;