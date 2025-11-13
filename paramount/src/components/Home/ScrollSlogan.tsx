import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ScrollSlogan = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });

  const lines = [
    "Timeless essentials for a grounded, refined wardrobe. Designed to feel good today and better over time. We ",
    "craft everyday pieces with intention - built to be worn, lived in and repeated."
  ];

  const words = lines.map(line => line.split(" "));

  return (
    <section ref={ref} className="py-10 bg-[#f5f5f5] max-w-[1180px] mx-auto px-8 mb-14 leading-[1.1]">
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
                ["#dfdfdf", "#000000"]
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

      <div className="overflow-hidden whitespace-nowrap pt-60 pb-10 bg-[#f5f5f5]">
        <div className="animate-marquee-slow inline-flex">
            {[
            "Creative Director",
            "Art Director",
            "Designer",
            "Photographer",
            "Videographer",
            "Stylist / Visual Curator",
            "Production Manager",
            "Marketing & Communications",
            "Operations / Project Coordinator"
            ].map((item, i) => (
            <span key={i} className="text-4xl text-[#939393] font-normal tracking-tight mx-14">
                {item}
            </span>
            ))}
            {[
            "Creative Director",
            "Art Director",
            "Designer",
            "Photographer",
            "Videographer",
            "Stylist / Visual Curator",
            "Production Manager",
            "Marketing & Communications",
            "Operations / Project Coordinator"
            ].map((item, i) => (
            <span key={"dup" + i} className="text-4xl text-[#939393] font-normal tracking-tight mx-14">
                {item}
            </span>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollSlogan;