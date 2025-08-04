import { Link } from "react-router-dom"

const NotFound = ({ homePath = '/'}: { homePath?: string }) => {
  return (
    <div className="w-full min-h-96 flex flex-col items-center justify-center p-8">
        <h1>404 Not Found</h1>
        <p>Rất tiếc, đường dẫn bạn truy cập không tồn tại.</p>
        <Link to={ homePath } className="bg-[#6B5CA5] mt-3 text-white px-3 py-1 rounded font-base hover:opacity-90">Về trang chủ</Link>
    </div>
  )
}

export default NotFound