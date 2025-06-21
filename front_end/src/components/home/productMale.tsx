import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Variant {
  image: string;
  price: number;
  volume: number;
}

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
  categoryId: Category;
  brandId: Brand;
  variants: Variant[];
}

const ProductMale = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('http://localhost:3000/products');
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">NƯỚC HOA NAM</h2>
          <Link to="/products" className="text-base transition-colors duration-200">
            Xem thêm →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => {
            const firstVariant = product.variants[0];

            return (
              <Link
                to={`productdetails/${product._id}`}
                key={product._id}
                className="group p-4 border rounded-lg hover:shadow transition block"
              >
                {/* Ảnh sản phẩm */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={firstVariant.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Tên sản phẩm */}
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 text-left">
                  {product.name}
                </h3>

                {/* Danh mục và Thương hiệu */}
                <div className="flex gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                    {product.categoryId?.name || 'Danh mục?'}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    {product.brandId?.name || 'Thương hiệu?'}
                  </span>
                </div>

                {/* Giá */}
                <div className="text-red-500 font-semibold text-sm text-left">
                  {firstVariant.price.toLocaleString()}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductMale;
