import { Link } from "react-router-dom"

const AdminSidebar = () => {
    return (
        <aside className="w-[240px] h-screen bg-white fixed top-0 left-0 z-50 border-r">
            <div className="p-6">
                <div className="mb-6">
                    <img src="/img/logo.png" alt="Logo" className="mx-auto" />
                </div>

                <input type="text" placeholder="Tìm kiếm" className="w-full text-sm px-3 py-2 mb-6 border border-gray-300 rounded-md" />

                <nav>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to={"/admin"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-home w-5 mr-2 hover:text-gray-500" /> Tổng quan
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/statistics"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-chart-line w-5 mr-2 hover:text-gray-500" /> Thống kê
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/products"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-cube w-5 mr-2 hover:text-gray-500" /> Sản phẩm
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/variants"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-sliders-h w-5 mr-2 hover:text-gray-500" /> Biến thể
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/categories"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-th-list w-5 mr-2 hover:text-gray-500" /> Danh mục
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/brands"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-gem w-5 mr-2 hover:text-gray-500" /> Thương hiệu
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/orders"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-receipt w-5 mr-2 hover:text-gray-500" /> Đơn hàng
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/users"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-users w-5 mr-2 hover:text-gray-500" /> Người dùng
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/reviews"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-comment-dots w-5 mr-2 hover:text-gray-500" /> Đánh giá
                            </Link>
                        </li>
                        <li>
                            <Link to={"/admin/vouchers"} className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-800 hover:text-gray-500">
                                <i className="fas fa-ticket-alt w-5 mr-2 hover:text-gray-500" /> Mã giảm giá
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}

export default AdminSidebar