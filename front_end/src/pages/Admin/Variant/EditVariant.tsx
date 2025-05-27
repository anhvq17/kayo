import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface IVariantForm {
  volume: number;
  price: number;
  stock_quantity: number;
  image: string;
  productId?: string;
}

const EditVariant = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IVariantForm>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/variants/${id}`);
        setValue("volume", data.volume);
        setValue("price", data.price);
        setValue("stock_quantity", data.stock_quantity);
        setValue("image", data.image);
        if(data.productId) setValue("productId", data.productId);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu biến thể:", error);
      }
    };
    if (id) fetchVariant();
  }, [id, setValue]);

  const onSubmit = async (data: IVariantForm) => {
    try {
      await axios.put(`http://localhost:3000/variants/${id}`, data);
      alert("Cập nhật biến thể thành công");
      navigate(-1);
    } catch (error) {
      console.error("Lỗi cập nhật biến thể:", error);
      alert("Cập nhật biến thể thất bại");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Cập nhật biến thể</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <input
            type="number"
            {...register("volume", { required: true, min: 1 })}
            placeholder="Dung tích (ml)"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.volume && <span className="text-red-600 text-[12px]">Vui lòng nhập dung tích ({'>'}=1ml)</span>}
        </div>

        <div>
          <input
            type="number"
            {...register("price", { required: true, min: 1000 })}
            placeholder="Giá (VNĐ)"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && <span className="text-red-600 text-[12px]">Vui lòng nhập giá ({'>'}=1000)</span>}
        </div>

        <div>
          <input
            type="number"
            {...register("stock_quantity", { required: true, min: 0 })}
            placeholder="Số lượng tồn kho"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.stock_quantity && <span className="text-red-600 text-[12px]">Vui lòng nhập số lượng tồn kho ({'>'}=0)</span>}
        </div>

        <div>
          <input
            type="text"
            {...register("image", { required: true })}
            placeholder="URL ảnh biến thể"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.image && <span className="text-red-600 text-[12px]">Vui lòng nhập URL ảnh</span>}
        </div>

        <div>
          <button type="submit" className="w-full bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700">
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVariant;