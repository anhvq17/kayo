import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Team from "../../../components/About/Team";

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <div className="relative w-full">
      <section 
        ref={ref} 
        className="flex flex-col justify-center max-w-[1280px] mx-auto px-8 pt-16 md:pt-32 pb-3"
      >
        <motion.div 
          style={{ opacity, y }} 
          className="max-w-[1200px]"
        >
          <h1 className="text-8xl md:text-8xl leading-[1.1] indent-48">
            <span className="font-semibold tracking-tighter">Studio Kayo, rooted in </span> <br />
            <span className="font-serif italic">Vietnam</span>
            <span className="font-semibold tracking-tighter">, fuses motion, </span> <br />
            <span className="font-semibold tracking-tighter">design and creativity to shape </span> <br />
            <span className="font-semibold tracking-tighter">powerful visuals and </span> <br />
            <span className="font-semibold tracking-tighter">experiences.</span>
          </h1>
        </motion.div>
      </section>

      <Team />
    </div>
  );
};

export default About;