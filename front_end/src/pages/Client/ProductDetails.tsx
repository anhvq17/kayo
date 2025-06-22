  import { useState, useEffect } from 'react';
  import { Link, useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { ShoppingCart } from 'lucide-react';

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
    variants?: VariantType[];
  }

  interface VariantType {
  _id: string;
  productId: { _id: string; name: string };
  volume: number;
  flavors: string;
  price: number;
  stock_quantity: number;
  image: string;
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
    const [variants, setVariants] = useState<VariantType[]>([]);
    const [selectedScent, setSelectedScent] = useState('');
    const [selectedVolume, setSelectedVolume] = useState('');
    const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'review'>('description');
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUserInfo] = useState<UserInfoType | null>(null);
    const [error] = useState<string | null>(null);
    const [addedMessage, setAddedMessage] = useState('');
    const [quantity, setQuantity] = useState(1);

   useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setUserInfo(null);
    return;
  }

  try {
    const parsed = JSON.parse(storedUser);
    if (parsed && parsed._id && parsed.username) {
      setUserInfo(parsed);
    } else {
      console.warn('userInfo thiếu dữ liệu cần thiết');
      setUserInfo(null);
    }
  } catch (err) {
    console.error('Lỗi parse userInfo:', err);
    setUserInfo(null);
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
        fetchVariants(res.data.data._id);
        if (res.data.data.categoryId?._id) {
          fetchRelatedProducts(res.data.data.categoryId._id, res.data.data._id);
        }
      } catch {
        console.error('Lỗi khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    const fetchVariants = async (productId: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/variant/product/${productId}`);
      const variantList: VariantType[] = res.data.data;
      setVariants(res.data.data);

      if (variantList.length > 0) {
      const firstScent = variantList[0].flavors;
      const firstByScent = variantList.find(v => v.flavors === firstScent);
      setSelectedScent(firstScent);
      setSelectedVolume(firstByScent?.volume.toString() || '');
      setSelectedVariant(firstByScent || null);
      setMainImg(firstByScent?.image || variantList[0].image);
    }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách biến thể:', err);
    }
  };

    const fetchRelatedProducts = async (categoryId: string, currentId: string) => {
      try {
        const res = await axios.get('http://localhost:3000/products', {
          params: { categoryId },
        });

        const related = res.data.data
          .filter((p: ProductDetailType) => p._id !== currentId)
          .slice(0, 4);

        const enriched = await Promise.all(
          related.map(async (prod:any) => {
            try {
              const variantRes = await axios.get(`http://localhost:3000/variant/product/${prod._id}`);
              return {
                ...prod,
                variants: variantRes.data.data || [],
              };
            } catch {
              return { ...prod, variants: [] };
            }
          })
        );

        setRelatedProducts(enriched);
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', err);
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

    useEffect(() => {
    if (!selectedVolume || !selectedScent || variants.length === 0) {
      setSelectedVariant(null);
      return;
    }

    const matched = variants.find(
      (v) => v.volume.toString() === selectedVolume && v.flavors === selectedScent
    );

    if (matched) {
      setSelectedVariant(matched);
      setQuantity(1);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedVolume, selectedScent, variants]);

    const addToCart = (product: ProductDetailType) => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(
        (item: any) =>
          item.variantId === selectedVariant!._id
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          variantId: selectedVariant!._id,
          productId: product._id,
          name: product.name,
          image: selectedVariant!.image,
          price: selectedVariant!.price,
          selectedScent,
          selectedVolume,
          quantity: quantity,
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
        setQuantity(1);
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
        navigate('/checkout');
      }
    };

  const handleCommentSubmit = async () => {
  if (!user) {
    alert('Vui lòng đăng nhập để bình luận!');
    return;
  }

  if (!newComment.trim()) {
    alert('Nội dung bình luận không được để trống!');
    return;
  }

  try {
    await axios.post('http://localhost:3000/comments', {
      productId: id,
      userId: user._id,
      content: newComment.trim(),
    });

    setNewComment('');
    fetchComments();
  } catch (error) {
    console.error('Lỗi gửi bình luận:', error);
    alert('Không thể gửi bình luận. Vui lòng thử lại sau.');
  }
};

    useEffect(() => {
      if (id) fetchProduct();
    }, [id]);

    if (!id) return <div className="text-center py-10">Không có ID sản phẩm.</div>;
    if (loading) return <div className="text-center py-10">Đang tải...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
    if (!product) return <div className="text-center py-10">Không tìm thấy sản phẩm.</div>;

    const thumbnails = [...new Set(variants.map((v) => v.image))];

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm mb-5">
          <Link to="/" className="text-gray-500 hover:text-gray-900">Trang chủ</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-gray-900">Danh sách sản phẩm</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-medium text-black">Chi tiết sản phẩm</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-[50%] mx-auto">
              <img src={mainImg} alt={product.name} className="w-full rounded shadow object-contain max-h-[400px]" />
              <div className="flex gap-2 mt-4 justify-center">
                {thumbnails.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`thumb-${i}`}
                    className={`w-14 h-14 border rounded object-cover cursor-pointer ${
                      mainImg === src ? 'border-purple-600' : ''
                    }`}
                    onClick={() => setMainImg(src)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <div className="text-yellow-400 mb-2">★★★★★</div>
              <p className="text-red-600 text-2xl font-bold mb-3">
                {(selectedVariant?.price || product.price || 0).toLocaleString()}
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Thương hiệu: <span className="text-[#5f518e] font-semibold">{product.brandId?.name || 'Không rõ'}</span></p>
                <p>Loại sản phẩm: <span className="text-[#5f518e] font-semibold">Nước hoa {product.categoryId?.name || 'Không rõ'}</span></p>
                <p>Tình trạng: <span className="text-green-700 font-semibold">{product.status || 'Còn hàng'} {selectedVariant && typeof selectedVariant.stock_quantity === 'number' && (<>({selectedVariant.stock_quantity} sản phẩm)</>)}</span></p>
                <p className="text-xs italic text-gray-500">Lưu ý: Mùi hương thực tế tùy vào sở thích cá nhân.</p>
                <div className="flex items-center gap-4 !mt-4">
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden w-fit">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-8 h-8 text-lg font-semibold text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          setQuantity(Math.min(Math.max(1, val), selectedVariant?.stock_quantity || 1));
                        }
                      }}
                      className="w-8 h-8 text-center border-x border-gray-300 text-sm focus:outline-none flex items-center justify-center"
                      style={{ lineHeight: 'normal' }}
                    />
                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          Math.min(prev + 1, selectedVariant?.stock_quantity || prev + 1)
                        )
                      }
                      className="w-8 h-8 text-lg font-semibold text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium">Mùi hương:</p>
                <div className="flex gap-2 mt-1">
                  {[...new Set(variants.map((v) => v.flavors))].map((scent) => (
                    <button
                      key={scent}
                      onClick={() => {setSelectedScent(scent);
                        const volumesByScent = variants.filter((v) => v.flavors === scent).map((v) => v.volume);
                        const minVolume = Math.min(...volumesByScent);
                        setSelectedVolume(minVolume.toString());
                      }}
                      className={`px-3 py-1 border rounded text-sm hover:bg-[#696faa] hover:text-white ${
                        selectedScent === scent ? 'bg-[#5f518e] text-white' : ''
                      }`}
                    >
                      {scent}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium">Dung tích:</p>
                <div className="flex gap-2 mt-1">
                  {[...new Set(variants.filter((v) => v.flavors === selectedScent).map((v) => v.volume.toString()))].map((vol) => (
                    <button
                      key={vol}
                      onClick={() => setSelectedVolume(vol)}
                      className={`px-3 py-1 border rounded text-sm hover:bg-[#696faa] hover:text-white ${
                        selectedVolume === vol ? 'bg-[#5f518e] text-white' : ''
                      }`}
                    >
                      {vol}ml
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-8">
                <button onClick={handleAddToCart} className="bg-[#5f518e] text-white px-6 py-2 rounded hover:bg-[#696faa] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />THÊM VÀO GIỎ HÀNG
                </button>
                <button onClick={handleBuyNow} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900">
                  MUA NGAY
                </button>
              </div>
              {addedMessage && <p className="text-green-600 text-sm mt-2">{addedMessage}</p>}
            </div>
          </div>

          <div className="hidden lg:block col-span-4 space-y-6 w-full max-w-[600px] mx-auto">
            <div className="border p-6 rounded shadow text-center">
              <h3 className="font-semibold mb-5">ƯU ĐIỂM</h3>
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                {[  
                  { label: 'Xuân', color: 'bg-green-400', icon: '🍃' },
                  { label: 'Hạ', color: 'bg-red-300', icon: '🌂' },
                  { label: 'Thu', color: 'bg-yellow-400', icon: '🍂' },
                  { label: 'Đông', color: 'bg-blue-400', icon: '❄️' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="text-xl">{item.icon}</div>
                    <div className="mt-1 font-medium">{item.label}</div>
                    <div className="w-full h-2 rounded bg-gray-200 mt-1">
                      <div className={`h-2 rounded ${item.color}`} style={{ width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border p-6 rounded shadow">
              <h3 className="font-semibold mb-6 text-center">DỊCH VỤ</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="font-semibold">Cam kết chính hãng 100%</p>
                    <p className="text-gray-500 text-xs">Tất cả các dòng nước hoa.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">↩️</span>
                  <div>
                    <p className="font-semibold">Bảo hành đến giọt cuối cùng</p>
                    <p className="text-gray-500 text-xs">Miễn phí đổi trả trong 7 ngày.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">🚚</span>
                  <div>
                    <p className="font-semibold">Giao hàng miễn phí toàn quốc</p>
                    <p className="text-gray-500 text-xs">Miễn phí thiệp & gói quà.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-12">
            <div className="flex gap-4 border-b border-gray-300">
              <button
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'description' ? 'border-b-4 border-[#5f518e]' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Mô tả
              </button>
              <button
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'review' ? 'border-b-4 border-[#5f518e]' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('review')}
              >
                Đánh giá
              </button>
            </div>
            {activeTab === 'description' && (
              <div className="max-w-6xl mt-3 mx-auto px-6 py-6 bg-white text-gray-800 leading-relaxed space-y-6">
                {product.description ? (
                  product.description
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="text-base md:text-base text-justify">
                        {paragraph}
                      </p>
                    ))
                ) : (
                  <p className="italic text-gray-500 text-center">Chưa có mô tả cho sản phẩm này.</p>
                )}
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
                  <div className="flex justify-end">
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                      className={`mt-2 px-4 py-2 rounded text-white ${
                        newComment.trim() ? 'bg-[#5f518e] hover:bg-[#696faa]' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Đánh giá</h4>
                  {comments.length === 0 ? (
                    <p className="text-gray-500">Chưa có đánh giá nào.</p>
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

          <div className="col-span-12 mt-10">
            <h3 className="text-xl font-semibold mb-6">SẢN PHẨM LIÊN QUAN</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {relatedProducts.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">Không có sản phẩm liên quan.</p>
              ) : (
                relatedProducts.map((product) => {
                  const firstVariant = product.variants?.[0];

                  return (
                    <Link
                      to={`/productdetails/${product._id}`}
                      key={product._id}
                      className="group p-4 border rounded-lg hover:shadow transition block"
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <img
                          src={firstVariant?.image || product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 text-left">
                        {product.name}
                      </h3>

                      <div className="flex gap-2 mb-2">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                          {product.categoryId?.name || 'Danh mục?'}
                        </span>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          {product.brandId?.name || 'Thương hiệu?'}
                        </span>
                      </div>

                      <div className="text-red-500 font-semibold text-sm text-left">
                        {firstVariant?.price?.toLocaleString() || 'Liên hệ'}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ProductDetails;