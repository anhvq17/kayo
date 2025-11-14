import { Link } from "react-router-dom"

const ClientFooter = () => {
  return (
    <footer>
      <div className="bg-[#464134] px-6 border-b border-[#605a4b] py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-14">
          <h1 className="text-[3rem] md:text-[3rem] text-[#f4f4f1] font-bold font-orbitron">
            Patagon
          </h1>
          <div className="ml-36 font-mono">
            <h3 className="text-[#aeaa9e] font-semibold font-mono text-lg mb-2">Email</h3>
            <ul className="text-[#f4f4f1] space-y-2">
              <li>us@patagon.com</li>
            </ul>
          </div>
          <div className="ml-32 font-mono">
            <h3 className="text-[#aeaa9e] font-semibold text-lg mb-2">Call</h3>
            <ul className="text-[#f4f4f1] space-y-2">
              <li>0977 907 877</li>
            </ul>
          </div>
          <div className="ml-28 font-mono">
            <h3 className="text-[#aeaa9e] font-semibold font-mono text-lg mb-2">Social</h3>
            <ul className="text-[#f4f4f1] space-y-2">
              <li>Instagram, X</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#464134] px-6 border-b border-[#605a4b] py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-14">
          <div className="space-y-4  font-mono tracking-tight">
            <h1 className="md:text-[1rem] text-[#a8a498] font-bold">
              Join our newsletter
            </h1>
            <div className="flex flex-col space-y-3 w-80 mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-full text-[#4f4d47] bg-[#f2f2ef] outline-none"
              />
              <button className="w-full px-4 py-2 rounded-full bg-[#eae7da] hover:bg-[#f2f2ef] text-[#443f32]">
                Join 1K+ Subscribers
              </button>
            </div>
          </div>
          
          <div className="ml-36 font-mono tracking-tight">
            <h3 className="text-[#aeaa9e] font-semibold font-mono text-lg mb-2">Pages</h3>
            <ul className="text-[#f4f4f1] space-y-1">
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Main Page</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">About Us</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Our Services</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Get In Touch</Link></li>
            </ul>
          </div>
          <div className="ml-32 font-mono tracking-tight">
            <h3 className="text-[#aeaa9e] font-semibold text-lg mb-2">Pages (CMS)</h3>
            <ul className="text-[#f4f4f1] space-y-1">
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">All Projects</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Single Project</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Blog</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Blog Post</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Team</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Team Members</Link></li>
            </ul>
          </div>
          <div className="ml-28 font-mono tracking-tight">
            <h3 className="text-[#aeaa9e] font-semibold font-mono text-lg mb-2">Resources</h3>
            <ul className="text-[#f4f4f1] space-y-1">
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Style Guide</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Licenses</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Change Log</Link></li>
              <li><Link to="#" className="relative transition-all after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4f4f1] after:transition-all after:duration-300 hover:after:w-full">Instructions</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#464134] border-t border-[#605a4b] text-sm px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center font-semibold font-mono text-lg tracking-tight">
          <div className="flex gap-14">
            <p className="text-white">Designed by <span className="text-[#f57e81]">Wkkkuu</span></p>
            <p className="text-white">Powered by <span className="text-[#f57e81]">Webflow</span></p>
          </div>
          <button className="text-white mt-3 sm:mt-0 flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Scroll to Top<i className="text-[#f57e81] fas fa-angle-up ml-2"></i></button>
        </div>
      </div>
    </footer>
  )
}

export default ClientFooter;