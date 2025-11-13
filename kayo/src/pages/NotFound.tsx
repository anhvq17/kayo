import { Link } from "react-router-dom";

const NotFound = ({ homePath = "/" }: { homePath?: string }) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-fade-in">
        <h1 className="text-9xl font-impact mb-4">404 NOT FOUND</h1>
        <p className="text-2xl tracking-tighter text-gray-600">
          The page you're looking for doesn't exist or has been removed. <br />Let's try again or {" "}
          <Link to={homePath} className="relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all after:duration-300 hover:after:w-full inline-flex items-center text-gray-600 text-2xl tracking-tighter">
            go back to Home.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;