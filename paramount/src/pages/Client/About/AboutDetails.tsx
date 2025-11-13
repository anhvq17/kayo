import { useParams } from "react-router-dom";
import { teamData } from "../../../data/teamAbout.tsx";
import { motion } from "framer-motion";

const AboutDetails = () => {
  const { id } = useParams();
  const index = Number(id);

  if (isNaN(index) || index < 0 || index >= teamData.length) {
    return <p className="text-center py-20">Không tìm thấy nhân sự.</p>;
  }

  const data = teamData[index];

  return (
    <section className="px-6 sm:px-10 pt-24 pb-32 max-w-[1000px] mx-auto font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
          <img
            src={data.img}
            className="w-full h-full object-cover"
            alt={data.name}
          />
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
          {data.name}
        </h1>

        <p className="text-xl text-gray-500 font-medium mt-3">
          {data.exp}
        </p>

        {data.desc && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-[750px] text-left"
          >
            <div className="w-10 h-[2px] bg-gray-900 mx-auto mb-4 opacity-70" />

            <blockquote className="italic text-gray-800 text-lg leading-relaxed tracking-tigher text-center">
              “{data.desc}”
            </blockquote>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default AboutDetails;