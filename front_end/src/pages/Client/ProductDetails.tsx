import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface ProductDetailType {
  _id: string;
  name: string;
  price: number;
  image: string;
  brandId?: { name: string };
  description?: string;
  status?: string;
  code?: string;
  categoryId?: { _id: string; name: string };
}

interface CommentType {
  _id: string;
  userId: { _id: string; username: string };
  content: string;
  createdAt: string;
}

interface UserInfoType {
  _id: string;
  username: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [mainImg, setMainImg] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<ProductDetailType[]>([]);
  const [selectedScent, setSelectedScent] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'review'>('description');
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed._id && parsed.username) {
          setUserInfo(parsed);
        }
      } catch (err) {
        console.error('Lỗi parse userInfo:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchComments();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/products/${id}`);
      setProduct(res.data.data);
      setMainImg(res.data.data.image);
      if (res.data.data.categoryId?._id) {
        fetchRelatedProducts(res.data.data.categoryId._id, res.data.data._id);
      }
    } catch {
      console.error('Lỗi khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: string, currentId: string) => {
    try {
      const res = await axios.get('http://localhost:3000/products', {
        params: { categoryId },
      });
      const filtered = res.data.data.filter((p: ProductDetailType) => p._id !== currentId).slice(0, 3);
      setRelatedProducts(filtered);
    } catch {
      setRelatedProducts([]);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/comments/product/${id}`);
      setComments(res.data);
    } catch {
      setComments([]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedScent || !selectedVolume) {
      alert('Vui lòng chọn hương và dung tích!');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(
      (item: any) =>
        item._id === product?._id &&
        item.selectedScent === selectedScent &&
        item.selectedVolume === selectedVolume
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        selectedScent,
        selectedVolume,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedMessage('Đã thêm vào giỏ hàng!');
    setTimeout(() => setAddedMessage(''), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleCommentSubmit = async () => {
    if (!userInfo || !userInfo._id) {
      alert('Vui lòng đăng nhập để bình luận!');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await axios.post('http://localhost:3000/comments', {
        productId: id,
        userId: userInfo._id,
        content: newComment.trim(),
      });

      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Lỗi gửi bình luận:', err);
    }
  };

  if (!product || loading) return <div className="text-center py-10">Đang tải...</div>;

  const thumbnails = [product.image, product.image, product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-8">
      {/* Image & Info */}
      <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <img src={mainImg} className="w-full rounded object-contain max-h-[400px]" />
          <div className="flex gap-2 mt-4">
            {thumbnails.map((src, i) => (
              <img
                key={i}
                src={src}
                onClick={() => setMainImg(src)}
                className={`w-16 h-16 border rounded object-cover cursor-pointer ${
                  mainImg === src ? 'border-purple-600' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-3">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <div className="text-yellow-500">★★★★★</div>
          <p className="text-red-600 text-2xl font-bold">
            {(product.price * 1000).toLocaleString('vi-VN')}₫
          </p>

          <div className="text-sm text-gray-600 space-y-1">
            <p>Tình trạng: <span className="text-green-600">{product.status || 'Còn hàng'}</span></p>
            <p>Mã sản phẩm: <span>{product.code || 'E000173'}</span></p>
            <p>Thương hiệu: <span>{product.brandId?.name || 'Không rõ'}</span></p>
          </div>

          <div>
            <p className="text-sm font-medium">Hương:</p>
            <div className="flex gap-2 mt-1">
              {['Nhẹ nhàng', 'Mạnh mẽ'].map((scent) => (
                <button
                  key={scent}
                  onClick={() => setSelectedScent(scent)}
                  className={`px-3 py-1 border rounded text-sm hover:bg-gray-100 ${
                    selectedScent === scent ? 'bg-purple-100 border-purple-500' : ''
                  }`}
                >
                  {scent}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Dung tích:</p>
            <div className="flex gap-2 mt-1">
              {['5ml - 150k', '10ml - 250k', '15ml - 350k'].map((vol) => (
                <button
                  key={vol}
                  onClick={() => setSelectedVolume(vol)}
                  className={`px-3 py-1 border rounded text-sm hover:bg-gray-100 ${
                    selectedVolume === vol ? 'bg-purple-100 border-purple-500' : ''
                  }`}
                >
                  {vol}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button onClick={handleAddToCart} className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800">
              THÊM VÀO GIỎ
            </button>
            <button onClick={handleBuyNow} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900">
              MUA NGAY
            </button>
          </div>

          {addedMessage && <p className="text-green-600 text-sm mt-2">{addedMessage}</p>}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block col-span-4 space-y-6 max-w-sm mx-auto">
        <div className="border p-6 rounded shadow text-center">
          <h3 className="font-semibold mb-4">DANH MỤC SẢN PHẨM</h3>
          <ul className="text-sm space-y-2">
            {['GUCCI', 'Nước hoa Unisex', 'Nước hoa mini'].map((cat) => (
              <li key={cat}>
                <Link to={`/category/${cat}`} className="text-blue-600 hover:underline inline-block">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="col-span-12 mt-10">
        <div className="flex gap-4 border-b border-gray-300">
          <button
            className={`px-6 py-3 font-semibold ${activeTab === 'description' ? 'border-b-4 border-purple-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('description')}
          >
            Mô tả
          </button>
          <button
            className={`px-6 py-3 font-semibold ${activeTab === 'review' ? 'border-b-4 border-purple-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('review')}
          >
            Đánh giá
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="max-w-3xl mx-auto px-4 py-6 text-gray-800 space-y-4">
            <p className="text-lg whitespace-pre-line">{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="max-w-3xl mx-auto px-4 py-6">
            <textarea
              className="w-full border rounded p-3 resize-none"
              rows={4}
              placeholder="Viết bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
            >
              Gửi bình luận
            </button>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Bình luận</h4>
              {comments.length === 0 ? (
                <p className="text-gray-500">Chưa có bình luận nào.</p>
              ) : (
                <ul className="space-y-3">
                  {comments.map((cmt) => (
                    <li key={cmt._id} className="border p-3 rounded bg-gray-50 shadow-sm">
                      <p className="font-medium">{cmt.userId?.username || 'Ẩn danh'}</p>
                      <p className="text-sm text-gray-600">{new Date(cmt.createdAt).toLocaleString()}</p>
                      <p className="mt-1">{cmt.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      <div className="col-span-12 mt-10">
        <h3 className="text-xl font-semibold mb-6">SẢN PHẨM LIÊN QUAN</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedProducts.map(({ _id, name, image, price }) => (
            <Link
              to={`/productdetails/${_id}`}
              key={_id}
              className="border rounded shadow hover:shadow-lg transition p-4 block"
            >
              <img src={image} alt={name} className="w-full h-40 object-cover rounded" />
              <p className="mt-3 font-semibold">{name}</p>
              <p className="mt-1 text-purple-700 font-bold">
                {(price * 1000).toLocaleString('vi-VN')}₫
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
