import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [mainImg, setMainImg] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<ProductDetailType[]>([]);
  const [selectedScent, setSelectedScent] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'review'>('description');
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState('');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/products/${id}`);
      setProduct(res.data.data);
      setMainImg(res.data.data.image);

      if (res.data.data.categoryId?._id) {
        fetchRelatedProducts(res.data.data.categoryId._id, res.data.data._id);
      }
    } catch {
      setError('Không thể tải sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: string, currentId: string) => {
    try {
      const res = await axios.get('http://localhost:3000/products', { params: { categoryId } });
      const related = res.data.data.filter((p: ProductDetailType) => p._id !== currentId).slice(0, 3);
      setRelatedProducts(related);
    } catch {
      setRelatedProducts([]);
    }
  };

  const addToCart = (product: ProductDetailType) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(
      (item: any) =>
        item._id === product._id &&
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
  };

  const handleAddToCart = () => {
    if (!selectedScent || !selectedVolume) {
      alert('Vui lòng chọn hương và dung tích!');
      return;
    }
    if (product) {
      addToCart(product);
      setAddedMessage('Đã thêm vào giỏ hàng!');
      setTimeout(() => setAddedMessage(''), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!selectedScent || !selectedVolume) {
      alert('Vui lòng chọn hương và dung tích!');
      return;
    }
    if (product) {
      addToCart(product);
      navigate('/cart');
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (!id) return <div className="text-center py-10">Không có ID sản phẩm.</div>;
  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-10">Không tìm thấy sản phẩm.</div>;

  const thumbnails = [product.image, product.image, product.image, product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-8">
      {/* Phần trái: Hình ảnh và thông tin */}
      <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row gap-6">
        {/* Hình ảnh */}
        <div className="w-full md:w-1/2">
          <img src={mainImg} alt={product.name} className="w-full rounded shadow object-contain max-h-[400px]" />
          <div className="flex gap-2 mt-4">
            {thumbnails.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`thumb-${i}`}
                className={`w-16 h-16 border rounded object-cover cursor-pointer ${
                  mainImg === src ? 'border-purple-600' : ''
                }`}
                onClick={() => setMainImg(src)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
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
            <p className="text-xs italic text-gray-500">Lưu ý: Mùi hương thực tế tùy vào sở thích cá nhân.</p>
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
            {['GUCCI', 'Nước hoa Unisex', 'Nước hoa mini', 'Nước hoa chiết', 'Kiến thức'].map((cat) => (
              <li key={cat}>
                <Link to={`/category/${encodeURIComponent(cat)}`} className="text-blue-600 hover:underline inline-block">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border p-6 rounded shadow text-center">
          <h3 className="font-semibold mb-4">ƯU ĐIỂM</h3>
          <div className="grid grid-cols-4 text-center text-xs gap-3 justify-center">
            {['Đông', 'Hạ', 'Thu', 'Xuân'].map((season) => (
              <div key={season} className="border p-2 rounded cursor-pointer hover:bg-purple-50">
                {season}
              </div>
            ))}
          </div>
        </div>

        <div className="border p-6 rounded shadow text-center">
          <h3 className="font-semibold mb-4">TỪ KHÓA</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Thanh lịch', 'Quyến rũ', 'Lịch lãm', 'Đầy nam tính'].map((tag) => (
              <span key={tag} className="cursor-pointer border rounded-full px-3 py-1 text-xs hover:bg-purple-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Mô tả / Đánh giá */}
      <div className="col-span-12 mt-10">
        <div className="flex gap-4 border-b border-gray-300">
          <button
            className={`px-6 py-3 font-semibold ${
              activeTab === 'description' ? 'border-b-4 border-purple-700' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Mô tả
          </button>
          <button
            className={`px-6 py-3 font-semibold ${
              activeTab === 'review' ? 'border-b-4 border-purple-700' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('review')}
          >
            Đánh giá
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="max-w-3xl mx-auto px-4 text-gray-800 space-y-8">
            <p className="text-lg leading-relaxed whitespace-pre-line">
              {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </p>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="p-6">
            <div className="mb-4">
              <textarea
                className="w-full border rounded p-3 resize-none"
                rows={4}
                placeholder="Viết đánh giá của bạn..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                className={`mt-2 px-4 py-2 rounded text-white ${
                  newComment.trim() ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Gửi đánh giá
              </button>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Bình luận</h4>
              {comments.length === 0 ? (
                <p className="text-gray-500">Chưa có bình luận nào.</p>
              ) : (
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  {comments.map((cmt, idx) => (
                    <li key={idx} className="border rounded p-3 bg-gray-50 shadow-sm">
                      {cmt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sản phẩm liên quan */}
      <div className="col-span-12 mt-10">
        <h3 className="text-xl font-semibold mb-6">SẢN PHẨM LIÊN QUAN</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Không có sản phẩm liên quan.</p>
          ) : (
            relatedProducts.map(({ _id, name, image, price }) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
