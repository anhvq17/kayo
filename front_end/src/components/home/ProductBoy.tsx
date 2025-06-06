import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  categoryId: Category;
  brandId: Brand;
}

const ProductBoy = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('http://localhost:3000/products');
        // Lọc sản phẩm nam (giả định dựa vào tên danh mục hoặc tên sản phẩm)
        const filtered = res.data.data.filter(
          (product: Product) =>
            product.categoryId?.name?.toLowerCase().includes('nam') ||
            product.name.toLowerCase().includes('nam')
        );
        setProducts(filtered);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm nam:', error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 md:px-10 xl:px-16">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold mb-5 text-black">NƯỚC HOA NAM</h2>
          <Link to="/products" className="text-base transition-colors duration-200">
            Xem thêm →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group relative p-3 border rounded-lg hover:shadow-md transition"
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-red-500 font-semibold text-sm mt-1">
                ${product.price.toFixed(2)}
              </p>

              <div className="mt-2">
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  {product.brandId?.name || 'Không có Brand'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductBoy;
