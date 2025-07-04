import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash, Plus } from "lucide-react";
import axios from "axios";

type Attribute = {
    _id: string;
    name: string;
    attributeCode: string;
    description?: string;
};

const AttributeManager = () => {
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    const fetchAttributes = async () => {
        try {
            const res = await axios.get("http://localhost:3000/attribute");
            setAttributes(res.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thuộc tính:", error);
        }
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    const handleSoftDelete = async (id: string) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa thuộc tính này?");
        if (!confirm) return;
        try {
            await axios.delete(`http://localhost:3000/attribute/soft/${id}`);
            alert("Đã chuyển vào thùng rác");
            fetchAttributes();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Xóa thất bại";
            alert(msg);
        }
    };

    return (
        <div className="p-4">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-semibold">Danh sách thuộc tính</h1>
                <Link to="/admin/attributes/add">
                    <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
                        <Plus size={14} />
                    </button>
                </Link>
            </div>

            {/* Menu */}
            <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
                <Link
                    to="/admin/attributes"
                    className="pb-2 border-b-2 border-blue-500 text-blue-600"
                >
                    Thuộc tính đang hoạt động
                </Link>
                <Link
                    to="/admin/attributes/trash"
                    className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
                >
                    Thùng rác
                </Link>
            </div>

            {/* Bảng danh sách */}
            <table className="min-w-full bg-white border text-sm">
                <thead>
                    <tr className="bg-black text-white text-left">
                        <th className="px-4 py-2">STT</th>
                        <th className="px-4 py-2">Tên thuộc tính</th>
                        <th className="px-4 py-2">Mã thuộc tính</th>
                        <th className="px-4 py-2">Mô tả</th>
                        <th className="px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {attributes.map((attr, index) => (
                        <tr key={attr._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{attr.name}</td>
                            <td className="px-4 py-2">{attr.attributeCode}</td>
                            <td className="px-4 py-2">{attr.description || "—"}</td>
                            <td className="px-4 py-2">
                                <div className="flex gap-1">
                                    <Link to={`/admin/attributes/edit/${attr._id}`}>
                                        <button className="w-8 h-8 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                                            <Edit size={14} />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleSoftDelete(attr._id)}
                                        className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                                    >
                                        <Trash size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttributeManager;
