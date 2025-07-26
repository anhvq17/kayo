import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import moment from "moment";

interface Comment {
  _id: string;
  userId: {
    name: string;
  };
  content: string;
  rating: number;
  image?: string[] | string;
  createdAt: string;
}

const ReviewPage = () => {
  const { productId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ratingError, setRatingError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/comments/product/${productId}`
      );
      setComments(res.data);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm.");
      return;
    }

    let hasError = false;
    if (rating === 0) {
      setRatingError(true);
      hasError = true;
    }
    if (!content.trim()) {
      setContentError(true);
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("productId", productId || "");
      formData.append("content", content);
      formData.append("rating", rating.toString());

      imageFiles.forEach((file) => {
        formData.append("image", file);
      });

      await axios.post("http://localhost:3000/comments", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setRating(0);
      setImageFiles([]);
      setRatingError(false);
      setContentError(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      alert("Đã có lỗi xảy ra khi gửi đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 3) {
      alert("Chỉ được chọn tối đa 3 ảnh.");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Đánh giá sản phẩm</h2>

      {/* Form đánh giá */}
      <div className="mb-8 border rounded-lg p-4 shadow bg-white">
        <h3 className="text-lg font-semibold mb-3">Viết đánh giá của bạn</h3>

        <div className="flex flex-col items-center mb-3">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer mr-1 text-2xl transition ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => {
                  setRating(star);
                  setRatingError(false);
                }}
              />
            ))}
          </div>
          {ratingError && (
            <p className="text-red-500 text-sm mt-1">
              Vui lòng chọn số sao đánh giá.
            </p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="flex gap-2 flex-wrap mb-3">
          {imageFiles.map((file, index) => (
            <div
              key={index}
              className="relative w-20 h-20 border-2 border-dashed rounded overflow-hidden"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() =>
                  setImageFiles((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          {imageFiles.length < 3 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7h4l2-3h6l2 3h4v13H3V7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11a3 3 0 100 6 3 3 0 000-6z"
                />
              </svg>
            </div>
          )}
        </div>

        <textarea
          className={`w-full border rounded p-2 mb-1 ${
            contentError ? "border-red-500" : ""
          }`}
          rows={4}
          placeholder="Nhập đánh giá của bạn..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setContentError(false);
          }}
        />
        {contentError && (
          <p className="text-red-500 text-sm mb-3">
            Vui lòng nhập nội dung đánh giá.
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>

          <button
            type="button"
            onClick={() => {
              setContent("");
              setRating(0);
              setImageFiles([]);
              setRatingError(false);
              setContentError(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            disabled={loading}
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-60"
          >
            Hủy
          </button>
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">Chưa có đánh giá nào.</p>
        ) : (
          comments.map((comment) => {
            const images: string[] =
              typeof comment.image === "string"
                ? [comment.image]
                : Array.isArray(comment.image)
                ? comment.image
                : [];

            return (
              <div
                key={comment._id}
                className="border-b py-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 font-medium">
                  {comment.userId.name}
                  <span className="text-sm text-gray-500">
                    {moment(comment.createdAt).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`${
                        star <= comment.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p>{comment.content}</p>

                {images.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {images.map((img, idx) => {
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
                            alt={`Ảnh ${idx}`}
                            className="w-20 h-20 object-cover rounded border hover:brightness-75 transition"
                          />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
