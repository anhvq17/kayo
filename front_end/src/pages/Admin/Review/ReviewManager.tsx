import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  image: string;
}

interface Review {
  _id: string;
  userId: {
    username: string;
  };
  content: string;
  rating: number;
  image?: string[] | string;
  createdAt: string;
  hidden?: boolean;
}

interface UserItem {
  _id: string;
  username: string;
  email?: string;
}

const ReviewManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Product search
  const [productSearch, setProductSearch] = useState('');

  // Mode: 'product' | 'user'
  const [mode, setMode] = useState<'product' | 'user'>('product');
  // Users state for user-mode
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [expandedUserRowKeys, setExpandedUserRowKeys] = useState<string[]>([]);
  const [userReviewsMap, setUserReviewsMap] = useState<Record<string, Review[]>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/products');
        setProducts(res.data.data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch users when switching to user mode (once)
  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length > 0 || mode !== 'user') return;
      try {
        const res = await axios.get('http://localhost:3000/users');
        setUsers(res.data || []);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách người dùng:', err);
      }
    };
    fetchUsers();
  }, [mode, users.length]);

  const toggleExpand = async (productId: string) => {
    if (expandedRowKeys.includes(productId)) {
      setExpandedRowKeys((prev) => prev.filter((id) => id !== productId));
    } else {
      setExpandedRowKeys((prev) => [...prev, productId]);
      if (!reviewsMap[productId]) {
        try {
          const res = await axios.get(`http://localhost:3000/comments/product/${productId}`);
          setReviewsMap((prev) => ({ ...prev, [productId]: res.data }));
        } catch (err) {
          console.error('Lỗi khi lấy đánh giá:', err);
        }
      }
    }
  };

  const toggleHideReview = async (reviewId: string, productId: string) => {
    try {
      const res = await axios.put(`http://localhost:3000/comments/${reviewId}/hide`);
      const updatedHidden = res.data.hidden;
      setReviewsMap((prev) => {
        const updated = prev[productId]?.map((r) =>
          r._id === reviewId ? { ...r, hidden: updatedHidden } : r
        );
        return { ...prev, [productId]: updated };
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật ẩn/hiện:", err);
    }
  };

  const toggleHideReviewUser = async (reviewId: string, userId: string) => {
    try {
      const res = await axios.put(`http://localhost:3000/comments/${reviewId}/hide`);
      const updatedHidden = res.data.hidden;
      setUserReviewsMap((prev) => {
        const updated = prev[userId]?.map((r) =>
          r._id === reviewId ? { ...r, hidden: updatedHidden } : r
        );
        return { ...prev, [userId]: updated };
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật ẩn/hiện:", err);
    }
  };

  const getImageUrl = (image?: string) => {
    if (!image) return "/no-image.png";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/uploads")) return `http://localhost:3000${image}`;
    if (image.startsWith("uploads")) return `http://localhost:3000/${image}`;
    return `http://localhost:3000/uploads/${image}`;
  };

  // Filter products by name
  const filteredProducts = useMemo(() => {
    const keyword = productSearch.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((p) => p.name.toLowerCase().includes(keyword));
  }, [products, productSearch]);

  // User list with search (user mode)
  const filteredUsers = useMemo(() => {
    if (mode !== 'user') return [] as UserItem[];
    const keyword = userSearch.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((u) => (u.username || '').toLowerCase().includes(keyword));
  }, [mode, users, userSearch]);

  // Pagination depends on mode
  const totalItems = mode === 'product' ? filteredProducts.length : filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [productSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch, mode]);

  const toggleExpandUser = async (userId: string) => {
    if (expandedUserRowKeys.includes(userId)) {
      setExpandedUserRowKeys((prev) => prev.filter((id) => id !== userId));
    } else {
      setExpandedUserRowKeys((prev) => [...prev, userId]);
      if (!userReviewsMap[userId]) {
        try {
          const res = await axios.get(`http://localhost:3000/comments/user/${userId}`);
          setUserReviewsMap((prev) => ({ ...prev, [userId]: res.data }));
        } catch (err) {
          console.error('Lỗi khi lấy đánh giá theo người dùng:', err);
        }
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Danh sách đánh giá</h1>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('product')}
            className={`px-3 py-2 rounded-md border ${mode === 'product' ? 'bg-black text-white' : 'bg-white'}`}
          >
            Theo sản phẩm
          </button>
          <button
            onClick={() => setMode('user')}
            className={`px-3 py-2 rounded-md border ${mode === 'user' ? 'bg-black text-white' : 'bg-white'}`}
          >
            Theo người dùng
          </button>
        </div>
        <input
          type="text"
          value={mode === 'product' ? productSearch : userSearch}
          onChange={(e) => (mode === 'product' ? setProductSearch(e.target.value) : setUserSearch(e.target.value))}
          placeholder={mode === 'product' ? 'Tìm theo tên sản phẩm...' : 'Tìm theo tên người dùng...'}
          className="px-3 py-2 border rounded-md w-full sm:w-64"
        />
      </div>
      {mode === 'product' ? (
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên sản phẩm</th>
            <th className="px-4 py-2">Ảnh sản phẩm</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(paginatedProducts) &&
            paginatedProducts.map((product, index) => (
              <React.Fragment key={product._id}>
                <tr>
                  <td className="px-3 py-2 border-b">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-3 py-2 border-b">{product.name}</td>
                  <td className="px-3 py-2 border-b">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  </td>
                  <td className="px-3 py-2 border-b">
                    <button
                      onClick={() => toggleExpand(product._id)}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      {expandedRowKeys.includes(product._id) ? 'Ẩn đánh giá' : 'Xem đánh giá'}
                    </button>
                  </td>
                </tr>
                {expandedRowKeys.includes(product._id) && (
                  <tr>
                    <td colSpan={4} className="p-4 bg-gray-50">
                      {reviewsMap[product._id] && reviewsMap[product._id].length > 0 ? (
                        <table className="w-full border text-sm">
                          <thead>
                            <tr className="bg-gray-200 text-left">
                              <th className="px-2 py-1">STT</th>
                              <th className="px-2 py-1">Người dùng</th>
                              <th className="px-2 py-1">Tỷ lệ</th>
                              <th className="px-2 py-1">Nội dung</th>
                              <th className="px-2 py-1">Ảnh đánh giá</th>
                              <th className="px-2 py-1">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviewsMap[product._id].map((r, rIndex) => (
                              <tr key={r._id} className="border-t">
                                <td className="px-2 py-1">{rIndex + 1}</td>
                                <td className="px-2 py-1">{r.hidden ? 'Đã ẩn' : r.userId.username}</td>
                                <td className="px-2 py-1">{r.rating} ⭐</td>
                                <td className="px-2 py-1 max-w-xs whitespace-normal break-words">
                                  {r.hidden ? 'Đã bị ẩn' : r.content}
                                </td>
                                <td className="px-2 py-1">
                                  {r.hidden
                                    ? 'Đã ẩn'
                                    : Array.isArray(r.image)
                                    ? r.image.map((img, idx) => (
                                        <img
                                          key={idx}
                                          src={getImageUrl(img)}
                                          alt="ảnh"
                                          className="w-10 h-10 inline-block mr-1 object-cover"
                                        />
                                      ))
                                    : r.image
                                    ? (
                                      <img
                                        src={getImageUrl(r.image)}
                                        alt="ảnh"
                                        className="w-10 h-10 object-cover"
                                      />
                                    )
                                    : 'Không có ảnh'}
                                </td>
                                <td className="px-2 py-1">
                                  <button
                                    onClick={() => toggleHideReview(r._id, product._id)}
                                    className={`px-3 py-1 rounded-md text-xs text-white ${
                                      r.hidden ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                  >
                                    {r.hidden ? 'Hiện' : 'Ẩn'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Sản phẩm này chưa có đánh giá nào
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
      ) : (
      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Người dùng</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(paginatedUsers) &&
            paginatedUsers.map((user, index) => (
              <React.Fragment key={user._id}>
                <tr>
                  <td className="px-3 py-2 border-b">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-3 py-2 border-b">{user.username}</td>
                  <td className="px-3 py-2 border-b">{user.email || '-'}</td>
                  <td className="px-3 py-2 border-b">
                    <button
                      onClick={() => toggleExpandUser(user._id)}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      {expandedUserRowKeys.includes(user._id) ? 'Ẩn đánh giá' : 'Xem đánh giá'}
                    </button>
                  </td>
                </tr>
                {expandedUserRowKeys.includes(user._id) && (
                  <tr>
                    <td colSpan={4} className="p-4 bg-gray-50">
                      {userReviewsMap[user._id] && userReviewsMap[user._id].length > 0 ? (
                        <table className="w-full border text-sm">
                          <thead>
                            <tr className="bg-gray-200 text-left">
                              <th className="px-2 py-1">STT</th>
                              <th className="px-2 py-1">Sản phẩm</th>
                              <th className="px-2 py-1">Tỷ lệ</th>
                              <th className="px-2 py-1">Nội dung</th>
                              <th className="px-2 py-1">Ảnh</th>
                              <th className="px-2 py-1">Thời gian</th>
                              <th className="px-2 py-1">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userReviewsMap[user._id].map((r, rIndex) => (
                              <tr key={r._id} className="border-t">
                                <td className="px-2 py-1">{rIndex + 1}</td>
                                <td className="px-2 py-1">{(r as any).productId?.name || '-'}</td>
                                <td className="px-2 py-1">{r.rating} ⭐</td>
                                <td className="px-2 py-1 max-w-xs whitespace-normal break-words">{r.hidden ? 'Đã bị ẩn' : r.content}</td>
                                <td className="px-2 py-1">
                                  {r.hidden ? 'Đã ẩn' : Array.isArray(r.image) && r.image.length > 0 ? (
                                    r.image.map((img, idx) => (
                                      <img
                                        key={idx}
                                        src={getImageUrl(img)}
                                        alt="ảnh"
                                        className="w-10 h-10 inline-block mr-1 object-cover"
                                      />
                                    ))
                                  ) : (
                                    'Không có ảnh'
                                  )}
                                </td>
                                <td className="px-2 py-1">{new Date(r.createdAt).toLocaleString()}</td>
                                <td className="px-2 py-1">
                                  <button
                                    onClick={() => toggleHideReviewUser(r._id, user._id)}
                                    className={`px-3 py-1 rounded-md text-xs text-white ${
                                      r.hidden ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                  >
                                    {r.hidden ? 'Hiện' : 'Ẩn'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-4 text-gray-500">Người dùng này chưa có đánh giá nào</div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
      )}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border bg-gray-200 disabled:opacity-50"
        >
          Trước
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border bg-gray-200 disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ReviewManager;