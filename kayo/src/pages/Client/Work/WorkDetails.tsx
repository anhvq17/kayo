import { useParams } from "react-router-dom";
import { workData } from "../../../data/articleWork";
import { motion } from "framer-motion";

const WorkDetails = () => {
  const { id } = useParams();
  const projectId = Number(id);

  const project = workData.find(item => item.id === projectId);

  if (!project) {
    return <p className="text-center py-20 text-gray-500">Không tìm thấy dự án.</p>;
  }

  return (
    <section className="px-6 sm:px-10 pt-24 pb-32 max-w-[1000px] mx-auto font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <img 
          src={project.coverImg} 
          alt={project.title} 
          className="w-full max-h-[500px] object-cover mb-6"
        />

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
          {project.title}
        </h1>

        {project.content.map((block, idx) => {
          if (block.type === "text") {
            return (
              <p key={idx} className="font-serif text-gray-700 leading-relaxed text-[1.05rem] max-w-[800px] mt-3 mb-6">
                {block.text}
              </p>
            );
          } else if (block.type === "image") {
            return (
              <img 
                key={idx} 
                src={block.src}  
                className="w-full mb-6 object-cover"
              />
            );
          }
          return null;
        })}
      </motion.div>
    </section>
  );
};

export default WorkDetails;
