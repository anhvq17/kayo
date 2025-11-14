import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ClientHeader = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 100) setVisible(false);
      else setVisible(true);
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full h-[77px] bg-white/80 backdrop-blur-md z-50"
    >
      <div className="max-w-[1280px] mx-auto px-8 h-full flex items-center justify-between">
        <Link to="/" className="text-4xl md:text-4xl font-orbitron font-bold">
          Patagon
        </Link>

        <div className="flex items-center gap-2">
          <button
            ref={buttonRef}
            onClick={() => setOpen(!open)}
            className="relative px-4 py-2 rounded-full overflow-hidden text-black bg-[#eae7da] duration-300 flex items-center gap-1 font-normal font-mono transition"
          >
            Menu
            <ChevronDown
              size={18}
              className={`transition-transform relative top-0.5 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          <Link
            to="/contact"
            className="relative px-4 py-2 rounded-full overflow-hidden text-white bg-[#e34447] font-normal font-mono transition-all duration-300"
          >
            <span className="absolute inset-0 bg-red-600 origin-left scale-x-0 hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            <span className="relative z-10">Contact</span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut", when: "afterChildren" }}
            className="absolute right-8 top-[77px] bg-[#eae7da] shadow-xl rounded-xl p-8 grid grid-cols-4 gap-20 text-gray-800 origin-top overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              <div>
                <h3 className="font-orbitron font-bold text-black text-xl tracking-wider mb-3">Pages</h3>
                <motion.ul
                  variants={{
                    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="text-gray-600 font-mono text-sm space-y-1"
                >
                  {["Main Page", "About Us", "Our Services", "Get In Touch"].map((page) => (
                    <motion.li
                      key={page}
                      variants={{
                        hidden: { opacity: 0, y: -10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link to={`/${page.toLowerCase().replace(/ /g, "-")}`}>
                        {page}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              <div>
                <h3 className="font-orbitron font-bold text-black text-xl tracking-wider mb-3">Projects</h3>
                <motion.ul
                  variants={{
                    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="text-gray-600 font-mono text-sm space-y-1"
                >
                  {["All Projects", "Our Blog", "Blog Post", "Team Member"].map((page) => (
                    <motion.li
                      key={page}
                      variants={{
                        hidden: { opacity: 0, y: -10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link to={`/${page.toLowerCase().replace(/ /g, "-")}`}>
                        {page}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              <div>
                <h3 className="font-orbitron font-bold text-black text-xl tracking-wider mb-3">Help</h3>
                <motion.ul
                  variants={{
                    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="text-gray-600 font-mono text-sm space-y-1"
                >
                  {["Style Guide", "Licenses", "Changelog", "Instructions"].map((page) => (
                    <motion.li
                      key={page}
                      variants={{
                        hidden: { opacity: 0, y: -10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link to={`/${page.toLowerCase().replace(/ /g, "-")}`}>
                        {page}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              <div>
                <h3 className="font-orbitron font-bold text-black text-xl tracking-wider mb-3">Social</h3>
                <motion.ul
                  variants={{
                    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="text-gray-600 font-mono text-sm space-y-1"
                >
                  {["Facebook", "X (Twitter)", "Instagram", "LinkedIn"].map((page) => (
                    <motion.li
                      key={page}
                      variants={{
                        hidden: { opacity: 0, y: -10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link to={`/${page.toLowerCase().replace(/ /g, "-")}`}>
                        {page}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default ClientHeader;