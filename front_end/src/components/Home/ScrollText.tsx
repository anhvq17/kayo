import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ScrollText = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });

  const lines = [
    "We design brands that shape environments and influence culture. Our partners are forward thinkers who view",
    "design as an engine for change, people who build futures and reshape spaces."
  ];

  const words = lines.map(line => line.split(" "));

  return (
    <section ref={ref} className="py-32 max-w-[1250px] mx-auto px-8 leading-[1.1]">
      <h2 className="text-7xl md:text-7xl font-medium tracking-tighter">
        {words.map((line, lineIndex) => (
          <div key={lineIndex} className="flex flex-wrap mb-1">
            {line.map((word, i) => {
              const index = lineIndex * words[0].length + i;
              const start = (index / (words.flat().length)) * 0.7;
              const end = start + 1 / words.flat().length;

              const color = useTransform(
                scrollYProgress,
                [start, end],
                ["#eeeeee", "#000000"]
              );

              return (
                <motion.span key={index} style={{ color }} className="mr-3 inline-block transition-colors duration-300">
                  {word}
                </motion.span>
              );
            })}
          </div>
        ))}
      </h2>
    </section>
  );
};

export default ScrollText;