import { Link } from "react-router-dom";

const ClientFooter = () => {
  return (
    <footer className="relative overflow-hidden bg-[#f5f5f5]">
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[24rem] font-bold text-[#e9e9e9] leading-none pointer-events-none select-none">
        ©KAYO
      </div>

      <div className="px-10 pt-20 pb-72 relative z-10">
        <div className="max-w-[1111px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="text-center md:text-left">
            <p className="text-8xl font-sans tracking-tighter">
              Let's Talk
            </p>
            <p className="text-8xl text-[#c9c9c9] tracking-tighter">Get in touch</p>
            <p className="text-black text-base font-medium tracking-tight pt-4">
              ©2025 Kayo. Powered by Wkkkuu
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-36 justify-center md:justify-end text-center tracking-tighter md:text-left">
            <div>
              <h1 className="font-medium text-2xl mt-5 mb-6">CONTACT</h1>
              <ul className="space-y-2">
                <li><Link to="#" className="text-[#c9c9c9] text-2xl relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#c9c9c9] after:transition-all after:duration-300 hover:after:w-full">us@kayo.com</Link></li>
                <li><Link to="#" className="text-[#c9c9c9] text-2xl relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#c9c9c9] after:transition-all after:duration-300 hover:after:w-full">0977 907 877</Link></li>
                <li><Link to="#" className="text-[#c9c9c9] text-2xl relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#c9c9c9] after:transition-all after:duration-300 hover:after:w-full">09:00 - 18:00</Link></li>
              </ul>
            </div>
            <div>
              <h1 className="font-medium text-2xl mt-5 mb-6">FOLLOW US</h1>
              <ul className="space-y-2">
                <li><Link to="#" className="text-[#c9c9c9] text-2xl relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#c9c9c9] after:transition-all after:duration-300 hover:after:w-full">Instagram</Link></li>
                <li><Link to="#" className="text-[#c9c9c9] text-2xl relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#c9c9c9] after:transition-all after:duration-300 hover:after:w-full">Linkedin</Link></li>
                <li><Link to="#" className="text-[#c9c9c9] text-2xl relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#c9c9c9] after:transition-all after:duration-300 hover:after:w-full">Behance</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;