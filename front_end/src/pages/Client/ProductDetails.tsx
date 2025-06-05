import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [selectedScent, setSelectedScent] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  const thumbnails = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nuzpMSZy8otrS3pS_FLQIvKtycV_nMLumA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nuzpMSZy8otrS3pS_FLQIvKtycV_nMLumA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nuzpMSZy8otrS3pS_FLQIvKtycV_nMLumA&s',
  ];

  const relatedProducts = [
    {
      name: 'Chanel Bleu EDT',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nuzpMSZy8otrS3pS_FLQIvKtycV_nMLumA&s',
      price: '2.250.000 ₫',
    },
    {
      name: 'Dior Sauvage',
      image: 'https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1556180386178-POUJG5JVTOTESV65MYEB/4782e878394229.5ca3ab3a57a8c.jpg',
      price: '2.400.000 ₫',
    },
    {
      name: 'Gucci Bloom',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgaixfjt1Gs0o5wlzYGzLCaCqxm41fUaIhDw&s',
      price: '2.050.000 ₫',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-8">
      {/* Hình ảnh + thông tin */}
      <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <img src={thumbnails[0]} alt="Main" className="w-full rounded shadow" />
          <div className="flex gap-2 mt-4">
            {thumbnails.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Thumb ${i + 1}`}
                className="w-16 h-16 border rounded object-cover cursor-pointer"
              />
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-3">
          <h2 className="text-xl font-semibold">Montblanc Legend Spirit EDT</h2>
          <div className="text-yellow-500">★★★★★</div>
          <p className="text-red-600 text-2xl font-bold">1.280.000 ₫</p>

          <div className="text-sm text-gray-600 space-y-1">
            <p>Tình trạng: <span className="text-green-600">Còn hàng</span></p>
            <p>Mã sản phẩm: <span className="text-gray-700">E000173</span></p>
            <p>Thương hiệu: <span className="text-gray-700">Montblanc</span></p>
            <p className="text-xs italic text-gray-500">Lưu ý: Mùi hương thực tế phù hợp với sở thích mỗi người.</p>
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
            <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800">THÊM VÀO GIỎ</button>
            <button className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900">MUA NGAY</button>
          </div>
        </div>
      </div>

      {/* Sidebar phải */}
      <div className="hidden lg:block col-span-4 space-y-6 max-w-sm mx-auto">
        <div className="border p-6 rounded shadow text-center">
          <h3 className="font-semibold mb-4">DANH MỤC SẢN PHẨM</h3>
          <ul className="text-sm space-y-2">
            {['GUCCI', 'Nước hoa Unisex', 'Nước hoa mini', 'Nước hoa chiết', 'Kiến thức'].map((cat) => (
              <li key={cat}>
                <Link
                  to={`/category/${encodeURIComponent(cat)}`}
                  className="text-blue-600 hover:underline inline-block"
                >
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
              <div
                key={season}
                className="bg-purple-100 text-purple-700 font-medium p-2 rounded shadow-sm select-none"
              >
                {season}
              </div>
            ))}
          </div>
        </div>

        <div className="border p-6 rounded shadow text-center">
          <h3 className="font-semibold mb-4">TỪ KHÓA SẢN PHẨM</h3>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {['Unisex', 'GUCCI', 'DIOR', 'CREED', 'Nước hoa', 'CHANEL', 'PRADA'].map((tag) => (
              <Link
                to={`/tag/${encodeURIComponent(tag)}`}
                key={tag}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mô tả và đánh giá */}
      <div className="col-span-12 mt-8">
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'description' ? 'border-b-2 border-black' : 'text-gray-500 hover:text-black'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Mô tả
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'review' ? 'border-b-2 border-black' : 'text-gray-500 hover:text-black'
            }`}
            onClick={() => setActiveTab('review')}
          >
            Đánh giá
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="space-y-4 text-gray-700 text-sm">
            <p>Một dòng nước hoa thanh lịch và tươi mát với hương đầu là cam bergamot, hương giữa là oải hương và cuối cùng là hương xạ hương nam tính.</p>
            <img
              style={{ height: '300px', margin: 'auto' }}
              src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg"
              className="rounded shadow"
              alt="image 1"
            />
            <p>Sản phẩm phù hợp cho cả ngày và đêm, mang lại sự tự tin và cuốn hút cho người dùng.</p>
            <img
              style={{ height: '280px', margin: 'auto' }}
              src="https://media.vneconomy.vn/images/upload/2021/04/21/nuoc-hoa6-15446764998601907178959.jpg"
              className="rounded shadow"
              alt="image 2"
            />
            <p>Thích hợp cho mọi độ tuổi và thời tiết, đặc biệt là những buổi tiệc hay cuộc hẹn quan trọng.</p>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="text-gray-700 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                Gửi
              </button>
            </div>

            {comments.length === 0 ? (
              <p>Chưa có đánh giá nào</p>
            ) : (
              <ul className="space-y-2">
                {comments.map((comment, index) => (
                  <li key={index} className="border rounded p-2 bg-gray-50">
                    {comment}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Sản phẩm liên quan */}
      <div className="col-span-12 mt-10">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((prod, index) => (
            <div key={index} className="border rounded shadow p-4">
              <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover rounded mb-2" />
              <h4 className="font-medium text-sm">{prod.name}</h4>
              <p className="text-red-600 font-bold text-sm">{prod.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
