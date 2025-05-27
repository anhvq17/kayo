import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
}

interface Review {
  _id: string;
  userId: string;
  productId: number;
  star: string;
  image: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

const products: Product[] = [
  { id: 1, name: 'Narciso Rodriguez' },
  { id: 2, name: 'Gucci' },
];

const reviews: Review[] = [
  {
    _id: 'r1',
    userId: 'u1',
    productId: 1,
    star: "⭐⭐⭐⭐⭐",
    image: 'https://product.hstatic.net/1000025647/product/versace_eros_parfum-min__1__bb9d4342c76c4bd7a860a615c769d743.jpg',
    comment: 'Giao hàng nhanh và chất lượng',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T12:00:00Z',
  },
  {
    _id: 'r2',
    userId: 'u2',
    productId: 1,
    star: "⭐⭐⭐⭐",
    image: 'https://cf.shopee.vn/file/21574cd3cca2082131d082e75c7e1f95',
    comment: 'Ổn, đáng mua',
    createdAt: '2024-05-02T08:30:00Z',
    updatedAt: '2024-05-02T08:30:00Z',
  },
  {
    _id: 'r3',
    userId: 'u3',
    productId: 2,
    star: "⭐⭐⭐",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO5EkZC8oyZzI8oID_xoeArYrkpOOGiEP7oA&s',
    comment: 'Tạm ổn',
    createdAt: '2024-05-03T09:00:00Z',
    updatedAt: '2024-05-03T09:00:00Z',
  },
  {
    _id: 'r4',
    userId: 'u4',
    productId: 2,
    star: "⭐⭐",
    image: 'https://product.hstatic.net/1000025647/product/nuoc_hoa_gucci_guilty_pour_femme_edp_50ml_f4e42fc4aa6549c6ae31fbda6e2d60f5_1024x1024.png',
    comment: 'Không đáng tiền',
    createdAt: '2024-05-03T09:00:00Z',
    updatedAt: '2024-05-03T09:00:00Z',
  },
];

const ReviewManager = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [hiddenReviews, setHiddenReviews] = useState<Set<string>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]
    );
  };

  const toggleHideReview = (reviewId: string) => {
    setHiddenReviews((prev) => {
      const updated = new Set(prev);
      updated.has(reviewId) ? updated.delete(reviewId) : updated.add(reviewId);
      return updated;
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Danh sách đánh giá</h1>
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Tên sản phẩm</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <React.Fragment key={product.id}>
              <tr>
                <td className="px-3 py-2 border-b">{product.id}</td>
                <td className="px-3 py-2 border-b">{product.name}</td>
                <td className="px-3 py-2 border-b">
                  <button
                    onClick={() => toggleExpand(product.id)}
                    className="border bg-blue-600 hover:bg-blue-700 text-white hover:text-white px-3 py-1 rounded-md text-xs transition duration-200"
                  >
                    {expandedRowKeys.includes(product.id) ? 'Ẩn đánh giá' : 'Xem đánh giá'}
                  </button>
                </td>
              </tr>
              {expandedRowKeys.includes(product.id) && (
                <tr>
                  <td colSpan={3} className="p-4 bg-white">
                    <table className="w-full table-auto border border-gray-300">
                      <thead>
                        <tr className="bg-black text-white text-left">
                          <th className="px-2 py-1">Người dùng</th>
                          <th className="px-2 py-1">Sao</th>
                          <th className="px-2 py-1">Nội dung</th>
                          <th className="px-2 py-1">Ảnh đánh giá</th>
                          <th className="px-2 py-1">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews
                          .filter((r) => r.productId === product.id)
                          .map((r) => (
                            <tr key={r._id}>
                              <td className="border-b px-2 py-1">
                                {hiddenReviews.has(r._id) ? 'Đã ẩn' : r.userId}
                              </td>
                              <td className="border-b px-2 py-1">{r.star}</td>
                              <td className="border-b px-2 py-1">
                                {hiddenReviews.has(r._id) ? 'Đã bị ẩn' : r.comment}
                              </td>
                              <td className="border-b px-2 py-1">
                                {hiddenReviews.has(r._id) ? (
                                  'Đã ẩn'
                                ) : (
                                  <img src={r.image} alt="ảnh" className="w-10 h-10 object-cover" />
                                )}
                              </td>
                              <td className="border-b px-2 py-1">
                                <button onClick={() => toggleHideReview(r._id)}
                                  className={`border px-3 py-1 rounded-md text-xs transition duration-200 text-white ${
                                  hiddenReviews.has(r._id)
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-red-600 hover:bg-red-700'
                                  }`}
                                  title={hiddenReviews.has(r._id) ? 'Hiện đánh giá' : 'Ẩn đánh giá'}>
                                  {hiddenReviews.has(r._id) ? 'Hiện' : 'Ẩn'}
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewManager;
 