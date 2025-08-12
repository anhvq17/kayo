const NewsList = () => {
  const newsData = [
    {
      id: 1,
      title: "Cách bảo quản và sử dụng nước hoa “hiệu quả nhất”",
      date: "17/08/2025",
      image:
        "https://orchard.vn/wp-content/uploads/2024/10/cach-bao-quan-va-su-dung-nuoc-hoa-hieu-qua-nhat-orchard-youtube.webp",
      description:
        "Để sử dụng và bảo quản một lọ nước hoa có giá trị một cách lâu dài (ít nhất 1 năm) là điều không phải ai cũng hiểu rõ…",
      youtubeLink: "https://www.youtube.com/watch?v=SV_V8PdJ31A",
    },
    {
      id: 2,
      title: "Những Chai Nước Hoa Nam Có Mùi Hương Giống Với Bleu De Chanel",
      date: "31/03/2025",
      image:
        "https://orchard.vn/wp-content/uploads/2024/10/nhung-chai-nuoc-hoa-nam-co-mui-huong-giong-voi-bleu-de-chanel-orchard-youtube.webp",
      description:
        "Chúng ta đã quá quen với cái tên “Chanel Bleu” rồi phải không? Ai cũng biết đến đây là mùi được đánh giá rất cao…",
      youtubeLink: "https://www.youtube.com/watch?v=0Kt_KjUjGPw",
    },
    {
      id: 3,
      title: "Những Chai Nước Hoa Omnia Hot Nhất Của Bvlgari",
      date: "15/12/2024",
      image:
        "https://orchard.vn/wp-content/uploads/2024/10/nhung-chai-nuoc-hoa-omnia-hot-nhat-cua-bvlgari-orchard-youtube.webp",
      description:
        "Bộ sưu tập nước hoa Bvlgari Omnia cũng lấy cảm hứng từ chính những viên đá đã làm nên danh tiếng của nhà hương này…",
      youtubeLink: "https://www.youtube.com/watch?v=zLKsNvf4phg&t=4s",
    },
  ];

  const sortedNews = [...newsData].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    return (
      new Date(yearB, monthB - 1, dayB).getTime() -
      new Date(yearA, monthA - 1, dayA).getTime()
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm mb-6">
        <a href="/" className="text-gray-500 hover:text-gray-900">
          Trang chủ
        </a>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-black">Bài viết</span>
      </div>

      <h1 className="text-3xl font-semibold mb-6">Bài viết mới nhất</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedNews.map((news) => (
          <a
            href={news.youtubeLink}
            key={news.id}
            target="_blank"
            rel="noopener noreferrer"
            className="
              bg-white border rounded-lg overflow-hidden flex flex-col h-full
                hover:shadow-lg hover:-translate-y-1 transform
                transition-all duration-300 ease-out">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-semibold mb-2 hover:text-[#5f518e] cursor-pointer line-clamp-2">
                {news.title}
              </h2>
              <p className="text-sm text-gray-400 mb-2">{news.date}</p>
              <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                {news.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsList;