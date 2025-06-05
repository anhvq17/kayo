import React from "react";

const categories = ["GUCCI", "Nước hoa Unisex", "Nước hoa mini", "Nước hoa chiết", "Kiến thức"];
const tags = ["Nước hoa nữ", "Xu hướng", "Nước hoa mini", "GUCCI", "DIOR", "Nước hoa nam", "UNISEX"];

const newProducts = [
  {
    name: "Yves Saint Laurent La Nuit De L’Homme EDT Chiết",
    image: "https://afamilycdn.com/2020/2/13/h5-15815760072151366965636.jpg",},
  {
    name: "Carolina Herrera Good Girl EDP Chiết",
    image: "https://photo.znews.vn/w660/Uploaded/yqdxwpjwq/2021_02_15/hicoscal.jpg",
  },
  {
    name: "Yves Saint Laurent Black Opium EDP Chiết",
    image: "https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
];

const products = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  name: `Sản phẩm ${i + 1}`,
  price: "2.369.000 VND",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nuzpMSZy8otrS3pS_FLQIvKtycV_nMLumA&s",
}));

const ProductList = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="lg:w-1/4 space-y-6">
        {/* Danh mục */}
        <div>
          <h2 className="font-bold mb-2 border-b pb-1">THƯ MỤC</h2>
          <ul className="space-y-1 text-sm">
            {categories.map((item) => (
              <li key={item} className="hover:text-blue-600 cursor-pointer">{item}</li>
            ))}
          </ul>
        </div>

        {/* Sản phẩm mới */}
        <div>
          <h2 className="font-bold mb-2 border-b pb-1">Các sản phẩm mới ra mắt</h2>
          <ul className="space-y-3">
            {newProducts.map((prod, index) => (
              <a href=""> <li key={index} className="flex items-start gap-3">
                 <img src={prod.image} alt={prod.name} className="w-12 h-16 object-cover" />
                <p className="text-sm">{prod.name}</p>
              </li>
              </a>
            ))}
          </ul>
        </div>

        {/* Từ khóa */}
        <div>
          <h2 className="font-bold mb-2 border-b pb-1">TỪ KHÓA</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="bg-gray-200 text-xs px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        </div>
      </aside>

      {/* Product grid */}
      <main className="lg:w-3/4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded hover:shadow transition relative"
            >
              <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                MỚI
              </span>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-contain mb-3"
              />
              <h3 className="text-sm font-medium leading-5">{product.name}</h3>
              <p className="text-red-600 font-bold">{product.price}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <ul className="flex space-x-2 text-sm">
            {[1, 2, 3].map((page) => (
              <li key={page}>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">{page}</button>
              </li>
            ))}
            <li>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">›</button>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ProductList;
