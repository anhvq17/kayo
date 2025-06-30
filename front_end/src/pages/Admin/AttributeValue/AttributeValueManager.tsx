import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash, Plus } from "lucide-react";
import axios from "axios";

type AttributeValue = {
  _id: string;
  value: string;
  valueCode: string;
  attributeId: {
    _id: string;
    name: string;
  };
  isUsed?: boolean; // nếu fetch từ BE luôn
};

type GroupedValues = {
  attributeId: string;
  attributeName: string;
  values: AttributeValue[];
};

const AttributeValueManager = () => {
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);

  useEffect(() => {
    fetchAttributeValues();
  }, []);

  const fetchAttributeValues = async () => {
    try {
      const res = await axios.get("http://localhost:3000/attribute-value");
      setAttributeValues(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giá trị thuộc tính:", error);
    }
  };

  const handleSoftDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa giá trị này?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/attribute-value/soft/${id}`);
      alert("Đã chuyển vào thùng rác");
      fetchAttributeValues();
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(error.response.data.message); 
      } else {
        alert("Xóa thất bại");
      }
    }
  };

  const groupByAttribute = (values: AttributeValue[]): GroupedValues[] => {
    const map = new Map<string, GroupedValues>();
    values.forEach((item) => {
      const id = item.attributeId._id;
      if (!map.has(id)) {
        map.set(id, {
          attributeId: id,
          attributeName: item.attributeId.name,
          values: [],
        });
      }
      map.get(id)!.values.push(item);
    });
    return Array.from(map.values());
  };

  return (
    <div className="p-1">
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
          {groupByAttribute(attributeValues).map((group) => (
            <tr key={group.attributeId} className="hover:bg-gray-50 border-b align-top">
              <td className="px-4 py-2 text-[16px] font-semibold">{group.attributeName}</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {group.values.map((val) => (
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
                  ))}
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
