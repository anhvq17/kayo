import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import moment from "moment";



interface ProductDetailType {
  priceDefault: number | undefined;
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
  attributes?: {
    attributeId: { name: string };
    valueId: { value: string };
  }[];
}

interface CommentType {
  _id: string;
  userId: { _id: string; username: string };
  content: string;
  image? : string[];
  rating : number;
  createdAt: string;
  hidden?: boolean;
}

interface UserInfoType {
  _id: string;
  username: string;
}

interface AttributeType {
  _id: string;
  name: string;
  attributeCode: string;
}

interface AttributeValueType {
  _id: string;
  value: string;
  attributeId: string | null;
}

const ProductDetails = () => {
   const { id: productId } = useParams();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [mainImg, setMainImg] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<ProductDetailType[]>(
    []
  );
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [selectedScent, setSelectedScent] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"description" | "review">(
    "description"
  );
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUserInfo] = useState<UserInfoType | null>(null);
  const [error] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState<AttributeType[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValueType[]>(
    []
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUserInfo(null);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (parsed && parsed._id && parsed.username) {
        setUserInfo(parsed);
      } else {
        console.warn("userInfo thiếu dữ liệu cần thiết");
        setUserInfo(null);
      }
    } catch (err) {
      console.error("Lỗi parse userInfo:", err);
      setUserInfo(null);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/products/${id}`);
      const productData = res.data.data;

      setProduct(productData);
      setMainImg(productData.image);
      fetchVariants(productData._id);

      if (productData.categoryId?._id) {
        fetchRelatedProducts(productData.categoryId._id, productData._id);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVariants = async (productId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/variant/product/${productId}`
      );
      const variantList: VariantType[] = res.data.data;
      setVariants(variantList);

      if (variantList.length > 0) {
        const firstVariant = variantList[0];
        const scentValue =
          firstVariant.attributes?.find(
            (a) => a.attributeId.name === "Mùi hương"
          )?.valueId?.value || firstVariant.flavors;

        const variantsWithSameScent = variantList.filter((v) => {
          const scent =
            v.attributes?.find((a) => a.attributeId.name === "Mùi hương")
              ?.valueId?.value || v.flavors;
          return scent === scentValue;
        });

        const volumeValue =
          variantsWithSameScent[0].attributes?.find(
            (a) => a.attributeId.name === "Dung tích"
          )?.valueId?.value || variantsWithSameScent[0].volume.toString();

        const matched = variantsWithSameScent.find((v) => {
          const vol =
            v.attributes?.find((a) => a.attributeId.name === "Dung tích")
              ?.valueId?.value || v.volume.toString();
          return vol === volumeValue;
        });

        setSelectedScent(scentValue);
        setSelectedVolume(volumeValue);
        setSelectedVariant(matched || null);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách biến thể:", err);
    }
  };

  const fetchRelatedProducts = async (
    categoryId: string,
    currentId: string
  ) => {
    try {
      const res = await axios.get("http://localhost:3000/products", {
        params: { categoryId },
      });

      const related = res.data.data
        .filter((p: ProductDetailType) => p._id !== currentId)
        .slice(0, 4);

      const enriched = await Promise.all(
        related.map(async (prod: any) => {
          try {
            const variantRes = await axios.get(
              `http://localhost:3000/variant/product/${prod._id}`
            );
            return {
              ...prod,
              variants: variantRes.data.data || [],
            } as ProductDetailType;
          } catch {
            return { ...prod, variants: [] } as ProductDetailType;
          }
        })
      );

      setRelatedProducts(enriched);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm liên quan:", err);
      setRelatedProducts([]);
    }
  };

  const fetchAttributes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/attribute");
      setAttributes(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy attribute:", err);
    }
  };

  const fetchAttributeValues = async () => {
    try {
      const res = await axios.get("http://localhost:3000/attribute-value");
      setAttributeValues(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy attribute values:", err);
    }
  };

  useEffect(() => {
    if (!selectedVolume || !selectedScent || variants.length === 0) {
      setSelectedVariant(null);
      return;
    }

    const matched = variants.find((v) => {
      if (v.attributes?.length) {
        const scentAttr = v.attributes.find(
          (a) => a.attributeId.name === "Mùi hương"
        );
        const volumeAttr = v.attributes.find(
          (a) => a.attributeId.name === "Dung tích"
        );
        return (
          scentAttr?.valueId?.value === selectedScent &&
          volumeAttr?.valueId?.value === selectedVolume
        );
      } else {
        return (
          v.flavors === selectedScent && v.volume?.toString() === selectedVolume
        );
      }
    });

    if (matched) {
      setSelectedVariant(matched);
      setQuantity(1);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedVolume, selectedScent, variants]);

  const scentAttr = attributes.find((a) => a.attributeCode === "mui-huong");
  const volumeAttr = attributes.find((a) => a.attributeCode === "dung-tich");

  const scentLabels = attributeValues
    .filter((v) => v.attributeId === scentAttr?._id)
    .map((v) => v.value);

  const volumeLabels = attributeValues
    .filter((v) => v.attributeId === volumeAttr?._id)
    .map((v) => v.value);

  const uniqueScents = [
    ...new Set(
      variants
        .map((v) => {
          if (v.attributes?.length) {
            const scentAttr = v.attributes.find(
              (a) => a.attributeId.name === "Mùi hương"
            );
            return scentAttr?.valueId?.value;
          } else {
            return v.flavors;
          }
        })
        .filter((scent): scent is string => Boolean(scent))
    ),
  ];

  const uniqueVolumes = [
    ...new Set(
      variants
        .filter((v) => {
          if (v.attributes?.length) {
            const scentAttr = v.attributes.find(
              (a) => a.attributeId.name === "Mùi hương"
            );
            return scentAttr?.valueId?.value === selectedScent;
          } else {
            return v.flavors === selectedScent;
          }
        })
        .map((v) => {
          if (v.attributes?.length) {
            const volumeAttr = v.attributes.find(
              (a) => a.attributeId.name === "Dung tích"
            );
            return volumeAttr?.valueId?.value;
          } else {
            return `${v.volume}ml`;
          }
        })
        .filter((vol): vol is string => Boolean(vol))
    ),
  ];

  const getLabelFromAttribute = (
    value: string | number,
    type: "scent" | "volume"
  ) => {
    const list = type === "scent" ? scentLabels : volumeLabels;
    const match = list.find((v) =>
      v.toLowerCase().includes(value.toString().toLowerCase())
    );
    return match || value;
  };

  useEffect(() => {
    if (!product?._id) return;
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/comments/product/${product._id}`);
        console.log("Dữ liệu comment từ backend:", res.data);
        const filtered = Array.isArray(res.data)
        ? res.data.filter((c: CommentType) => !c.hidden)
        : [];

      setComments(filtered);

      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };
    fetchComments();
  }, [product]);

  useEffect(() => {
    fetchAttributes();
    fetchAttributeValues();
  }, []);

  useEffect(() => {
    if (!selectedVolume || !selectedScent || variants.length === 0) {
      setSelectedVariant(null);
      return;
    }

    const matched = variants.find((v) => {
      const scent =
        v.attributes?.find((a) => a.attributeId.name === "Mùi hương")?.valueId
          ?.value || v.flavors;
      const volume =
        v.attributes?.find((a) => a.attributeId.name === "Dung tích")?.valueId
          ?.value || v.volume.toString();

      return scent === selectedScent && volume === selectedVolume;
    });

    if (matched) {
      setSelectedVariant(matched);
      setQuantity(1);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedVolume, selectedScent, variants]);

  const addToCart = async (product: ProductDetailType) => {
    if (!selectedVariant || !user) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as any[];
    const existing = cart.find(
      (item) => item.variantId === selectedVariant._id
    );

    const cartItem = {
      userId: user._id,
      variantId: selectedVariant._id,
      productId: product._id,
      name: product.name,
      image: selectedVariant.image,
      price: selectedVariant.price,
      selectedScent,
      selectedVolume,
      quantity,
    };

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    try {
      console.log("Gửi cartItem:", cartItem);
      await axios.post("http://localhost:3000/cart", cartItem);
      console.log("Sản phẩm đã được gửi lên server.");
    } catch (error) {
      console.error("Lỗi khi gửi sản phẩm lên server:", error);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    if (!selectedScent || !selectedVolume) {
      alert("Vui lòng chọn hương và dung tích!");
      return;
    }

    if (product) {
      addToCart(product);
      setAddedMessage("Đã thêm vào giỏ hàng!");
      setQuantity(1);
      setTimeout(() => setAddedMessage(""), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!selectedScent || !selectedVolume) {
      alert("Vui lòng chọn hương và dung tích!");
      return;
    }

    if (!selectedVariant || !product) {
      alert("Không tìm thấy biến thể phù hợp!");
      return;
    }

    const buyNowItem = {
      _id: product._id,
      name: product.name,
      image: selectedVariant.image,
      price: selectedVariant.price,
      quantity,
      selectedScent,
      selectedVolume,
      variantId: selectedVariant._id,
    };

    localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    navigate("/checkout");
  };


  if (!id)
    return <div className="text-center py-10">Không có ID sản phẩm.</div>;
  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!product)
    return <div className="text-center py-10">Không tìm thấy sản phẩm.</div>;

  const imageMap = new Map<string, string>();

variants.forEach((v) => {
  const scent =
    v.attributes?.find((a) => a.attributeId.name === "Mùi hương")?.valueId?.value || v.flavors;
  const volume =
    v.attributes?.find((a) => a.attributeId.name === "Dung tích")?.valueId?.value || v.volume.toString();

  const key = `${scent}-${volume}`;
  if (!imageMap.has(key)) {
    imageMap.set(key, v.image);
  }
});

const thumbnails = [product.image, ...Array.from(imageMap.values())].filter(Boolean);

console.log("Thumbnails:", thumbnails);


console.log("productId detail:", productId);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-5">
        <Link to="/" className="text-gray-500 hover:text-gray-900">
          Trang chủ
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/products" className="text-gray-500 hover:text-gray-900">
          Danh sách sản phẩm
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Chi tiết sản phẩm</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[50%] mx-auto">
            <img
              src={mainImg}
              alt={product.name}
              className="w-full rounded shadow object-contain max-h-[400px]"
            />
            <div className="flex gap-2 mt-4 justify-center">
            {thumbnails.slice(0, 5).map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`thumb-${index}`}
                className={`w-14 h-14 border rounded object-cover cursor-pointer ${
                  mainImg === src ? "border-purple-600" : ""
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
              {(
                selectedVariant?.price ||
                product.priceDefault ||
                0
              ).toLocaleString()}
            </p>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                Thương hiệu:{" "}
                <span className="text-[#5f518e] font-semibold">
                  {product.brandId?.name || "Không rõ"}
                </span>
              </p>
              <p>
                Loại sản phẩm:{" "}
                <span className="text-[#5f518e] font-semibold">
                  Nước hoa {product.categoryId?.name || "Không rõ"}
                </span>
              </p>
              <p>
                Tình trạng:{" "}
                <span className="text-green-700 font-semibold">
                  {product.status || "Còn hàng"}{" "}
                  {selectedVariant &&
                    typeof selectedVariant.stock_quantity === "number" && (
                      <>({selectedVariant.stock_quantity} sản phẩm)</>
                    )}
                </span>
              </p>
              <p className="text-xs italic text-gray-500">
                Lưu ý: Mùi hương thực tế tùy vào sở thích cá nhân.
              </p>

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
                        setQuantity(
                          Math.min(
                            Math.max(1, val),
                            selectedVariant?.stock_quantity || 1
                          )
                        );
                      }
                    }}
                    className="w-8 h-8 text-center border-x border-gray-300 text-sm focus:outline-none flex items-center justify-center"
                    style={{ lineHeight: "normal" }}
                  />
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(
                          prev + 1,
                          selectedVariant?.stock_quantity || prev + 1
                        )
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
              <p className="text-sm font-medium">
                {scentAttr?.name || "Mùi hương"}:
              </p>
              <div className="flex gap-2 mt-1">
                {uniqueScents.map((scent, idx) => (
                  <button
                    key={`${scent}-${idx}`}
                    onClick={() => {
                      setSelectedScent(scent);
                      const variantsByScent = variants.filter((v) => {
                        const scentAttr = v.attributes?.find(
                          (a) => a.attributeId.name === "Mùi hương"
                        );
                        const value = scentAttr?.valueId?.value || v.flavors;
                        return value === scent;
                      });
                      if (variantsByScent.length > 0) {
                        const firstVolume =
                          variantsByScent[0].attributes?.find(
                            (a) => a.attributeId.name === "Dung tích"
                          )?.valueId?.value ||
                          variantsByScent[0].volume.toString();

                        setSelectedVolume(firstVolume);
                      }
                    }}
                    className={`px-3 py-1 border rounded text-sm hover:bg-[#696faa] hover:text-white ${
                      selectedScent === scent ? "bg-[#5f518e] text-white" : ""
                    }`}
                  >
                    {getLabelFromAttribute(scent ?? "", "scent")}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium">
                {volumeAttr?.name || "Dung tích"}:
              </p>
              <div className="flex gap-2 mt-1">
                {uniqueVolumes.map((vol, idx) => (
                  <button
                    key={`${vol}-${idx}`}
                    onClick={() => {
                      const matched = variants.find((v) => {
                        const scent =
                          v.attributes?.find(
                            (a) => a.attributeId.name === "Mùi hương"
                          )?.valueId?.value || v.flavors;
                        const volume =
                          v.attributes?.find(
                            (a) => a.attributeId.name === "Dung tích"
                          )?.valueId?.value || v.volume.toString();

                        return (
                          scent === selectedScent && volume === String(vol)
                        );
                      });

                      if (matched) {
                        setSelectedVolume(String(vol));
                        setSelectedVariant(matched);
                        setQuantity(1);
                      } else {
                        alert(
                          "Không tìm thấy biến thể phù hợp với mùi hương đã chọn."
                        );
                      }
                    }}
                    className={`px-3 py-1 border rounded text-sm hover:bg-[#696faa] hover:text-white ${
                      selectedVolume === String(vol)
                        ? "bg-[#5f518e] text-white"
                        : ""
                    }`}
                  >
                    {getLabelFromAttribute(vol, "volume")}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-8">
              <button
                onClick={handleAddToCart}
                className="bg-[#5f518e] text-white px-6 py-2 rounded hover:bg-[#696faa] flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                THÊM VÀO GIỎ HÀNG
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
              >
                MUA NGAY
              </button>
            </div>
            {addedMessage && (
              <p className="text-green-600 text-sm mt-2">{addedMessage}</p>
            )}
          </div>
        </div>

        <div className="hidden lg:block col-span-4 space-y-6 w-full max-w-[600px] mx-auto">
          <div className="border p-6 rounded shadow text-center">
            <h3 className="font-semibold mb-5">ƯU ĐIỂM</h3>
            <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
              {[
                { label: "Xuân", color: "bg-green-400", icon: <i className="fas fa-leaf text-green-400"></i> },
                { label: "Hạ", color: "bg-red-300", icon: <i className="fas fa-sun text-red-300"></i> },
                { label: "Thu", color: "bg-yellow-400", icon: <i className="fas fa-wind text-yellow-400"></i> },
                { label: "Đông", color: "bg-blue-400", icon: <i className="fas fa-snowflake text-blue-400"></i> },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="text-xl">{item.icon}</div>
                  <div className="mt-1 font-medium">{item.label}</div>
                  <div className="w-full h-2 rounded bg-gray-200 mt-1">
                    <div
                      className={`h-2 rounded ${item.color}`}
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border p-6 rounded shadow">
            <h3 className="font-semibold mb-6 text-center">DỊCH VỤ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-5">
                <span className="text-xl"><i className="fas fa-shield-alt text-xl mt-1 text-gray-500"></i></span>
                <div>
                  <p className="font-semibold">Cam kết chính hãng 100%</p>
                  <p className="text-gray-500 text-xs">
                    Tất cả các dòng nước hoa
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <span className="text-xl"><i className="fas fa-undo-alt text-xl mt-1 text-gray-500"></i></span>
                <div>
                  <p className="font-semibold">Bảo hành đến giọt cuối cùng</p>
                  <p className="text-gray-500 text-xs">
                    Miễn phí đổi trả trong 7 ngày
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <span className="text-xl"><i className="fas fa-truck text-base mt-1 text-gray-500"></i></span>
                <div>
                  <p className="font-semibold">Giao hàng miễn phí toàn quốc</p>
                  <p className="text-gray-500 text-xs">
                    Miễn phí thiệp & gói quà
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-12">
          <div className="flex gap-4 border-b border-gray-300">
            <button
              className={`px-6 py-3 font-semibold ${
                activeTab === "description"
                  ? "border-b-4 border-[#5f518e]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Mô tả
            </button>
            <button
              className={`px-6 py-3 font-semibold ${
                activeTab === "review"
                  ? "border-b-4 border-[#5f518e]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("review")}
            >
              Đánh giá
            </button>
          </div>

          {activeTab === "description" && (
            <div className="max-w-6xl mt-3 mx-auto px-6 py-6 bg-white text-gray-800 leading-relaxed space-y-6">
              {product.description ? (
                product.description.split("\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base md:text-base text-justify"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="italic text-gray-500 text-center">
                  Chưa có mô tả cho sản phẩm này.
                </p>
              )}
            </div>
          )}

          {activeTab === "review" && (
            <div className="p-6">


            <div className="mt-8">
  <h2 className="text-xl font-semibold mb-4">Đánh giá sản phẩm</h2>

  {comments.length === 0 ? (
    <p>Chưa có đánh giá nào.</p>
  ) : (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="border rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{comment.userId?.username || "Người dùng"}</span>
            <span className="text-sm text-gray-500">{moment(comment.createdAt).format("DD/MM/YYYY HH:mm:ss")}</span>
          </div>
          <div className="flex mb-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} className={index < comment.rating ? "text-yellow-400" : "text-gray-300"}>
                ★
              </span>
              
            ))}
          </div>
          <p>{comment.content}</p>
          {(comment.image?.length ?? 0) > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {comment.image?.map((img, idx) => {
                      const imageUrl = img.startsWith("/uploads/")
                        ? `http://localhost:3000${img}`
                        : `http://localhost:3000/uploads/${img}`;
                      return (
                    <a
                      key={idx}
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={imageUrl}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded border hover:brightness-75 transition"
                      />
                    </a>
                  );
                })}
              </div>
            )}

        </div>
      ))}
    </div>
    
  )}
</div>

            </div>
          )}
        </div>

        <div className="col-span-12 mt-10">
          <h3 className="text-xl font-semibold mb-6">SẢN PHẨM LIÊN QUAN</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                Không có sản phẩm liên quan.
              </p>
            ) : (
              relatedProducts.map((rel) => {
                return (
                  <Link
                    to={`/productdetails/${rel._id}`}
                    key={rel._id}
                    className="group p-4 border rounded-lg hover:shadow transition block"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 text-left">
                      {rel.name}
                    </h3>

                    <div className="flex gap-2 mb-2">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                        {rel.categoryId?.name || "Danh mục?"}
                      </span>
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        {rel.brandId?.name || "Thương hiệu?"}
                      </span>
                    </div>

                    <div className="text-red-500 font-semibold text-sm text-left">
                      {rel.priceDefault?.toLocaleString() || "Liên hệ"}
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