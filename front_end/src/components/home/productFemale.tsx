import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

const ProductFemale = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('http://localhost:3000/products');
        const filtered = res.data.data.filter(
          (product: Product) =>
            product.categoryId?.name?.toLowerCase().includes('nữ') ||
            product.name.toLowerCase().includes('nữ')
        );
        setProducts(filtered);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm nữ:', error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 md:px-10 xl:px-16">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">NƯỚC HOA NỮ</h2>
          <Link to="/products" className="text-base transition-colors duration-200">
            Xem thêm →
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex border-b">
            <button className="px-4 py-2 text-base font-medium border-b-2 text-black border-gray-900">Nổi bật</button>
            <button className="px-4 py-2 text-base font-medium text-gray-500">Mới nhất</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => (
            <Link
              to={`/productdetails/${product._id}`}
              key={product._id}
              className="group relative p-3 border rounded-lg hover:shadow-md transition block"
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

              <div className="flex items-center justify-between mt-1">
                <p className="text-red-500 font-semibold text-sm mt-1">
                  {product.price.toFixed(3)}
                </p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    {product.brandId?.name || 'Không có thương hiệu'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFemale;
