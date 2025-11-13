import { useState, useEffect } from "react";
import { CaretUpOutlined } from "@ant-design/icons";
import "./ScrollToTop.css";

export default function ScrollToTopWidget() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <button className="scroll-toggle" onClick={scrollToTop}>
          <CaretUpOutlined />
        </button>
      )}
    </>
  );
}