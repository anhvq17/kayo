import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash, Plus, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

type Attribute = {
  _id: string;
  name: string;
};

type AttributeValue = {
  _id: string;
  value: string;
  valueCode: string;
  attributeId: {
    _id: string;
    name: string;
  };
  isUsed?: boolean;
};

type GroupedValues = {
  attributeId: string;
  attributeName: string;
  values: AttributeValue[];
};

// Custom confirm
const confirmToast = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Xác nhận hành động</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            onClick={() => {
              toast.dismiss(t);
              resolve(false);
            }}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            onClick={() => {
              toast.dismiss(t);
              resolve(true);
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    ), {
      duration: 0, 
      position: "top-center",
      style: { background: "transparent", padding: 0, border: "none" },
    });
  });
};

const AttributeValueManager = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);

  useEffect(() => {
    fetchAttributes();
    fetchAttributeValues();
  }, []);

  const fetchAttributes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/attribute"); // API lấy tất cả thuộc tính
      setAttributes(res.data.data);
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách thuộc tính:", error);
      toast.error("Lỗi khi lấy danh sách thuộc tính", { duration: 2000 });
    }
  };

  const fetchAttributeValues = async () => {
    try {
      const res = await axios.get("http://localhost:3000/attribute-value");
      setAttributeValues(res.data.data);
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách giá trị thuộc tính:", error);
      toast.error("Lỗi khi lấy danh sách giá trị thuộc tính", { duration: 2000 });
    }
  };

  const handleSoftDelete = async (id: string) => {
    const confirmed = await confirmToast("Bạn có chắc muốn xóa giá trị này?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/attribute-value/soft/${id}`);
      toast.success("Đã chuyển giá trị vào thùng rác", { duration: 2000 });
      fetchAttributeValues();
    } catch (error: unknown) {
      const msg =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Xóa thất bại"
          : "Xóa thất bại";
      toast.error(msg, { duration: 2000 });
    }
  };

  const groupByAttribute = (
    attributes: Attribute[],
    values: AttributeValue[]
  ): GroupedValues[] => {
    return attributes.map((attr) => ({
      attributeId: attr._id,
      attributeName: attr.name,
      values: values.filter((val) => val.attributeId._id === attr._id),
    }));
  };

  return (
    <div className="p-4">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Danh sách giá trị thuộc tính</h1>
      </div>

      {/* Menu */}
      <div className="flex gap-6 border-b my-4 text-base font-medium text-gray-500">
        <Link
          to="/admin/attribute-values"
          className="pb-2 border-b-2 border-blue-500 text-blue-600"
        >
          Giá trị đang hoạt động
        </Link>
        <Link
          to="/admin/attribute-values/trash"
          className="pb-2 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
        >
          Thùng rác
        </Link>
      </div>

      {/* Bảng */}
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2 w-1/4">Thuộc tính</th>
            <th className="px-4 py-2">Giá trị</th>
            <th className="px-4 py-2 w-32">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {groupByAttribute(attributes, attributeValues).map((group) => (
            <tr key={group.attributeId} className="hover:bg-gray-50 border-b align-top">
              <td className="px-4 py-2 text-[16px] font-semibold">{group.attributeName}</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {group.values.length > 0 ? (
                    group.values.map((val) => (
                      <span
                        key={val._id}
                        className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1 border"
                      >
                        {val.value}
                        <Link to={`/admin/attribute-values/edit/${val._id}`}>
                          <Edit className="w-4 h-4 text-green-600 hover:text-green-800" />
                        </Link>
                        <button
                          onClick={() => handleSoftDelete(val._id)}
                          title={
                            val.isUsed
                              ? "Giá trị đang được dùng trong sản phẩm. Không thể xóa."
                              : ""
                          }
                          disabled={val.isUsed}
                        >
                          <Trash
                            className={`w-4 h-4 ${
                              val.isUsed
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">Chưa có giá trị</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2">
                <Link to={`/admin/attribute-values/add?attributeId=${group.attributeId}`}>
                  <button className="w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
                    <Plus size={14} />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeValueManager;