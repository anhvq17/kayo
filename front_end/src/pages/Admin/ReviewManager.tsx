
import { Table } from 'antd';

const products = [
  { id: 1, name: 'Narciso Rodriguez' },
  { id: 2, name: 'Gucci' },
  
]
const reviews = [
  {
    _id: 'r1',
    userId: 'u1',
    productId: 1,
    star: 5,
    image: 'https://product.hstatic.net/1000025647/product/versace_eros_parfum-min__1__bb9d4342c76c4bd7a860a615c769d743.jpg',
    comment: 'Giao hàng nhanh và chất lượng',
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-01T12:00:00Z',
  },
  {
    _id: 'r2',
    userId: 'u2',
    productId: 1,
    star: 4,
    image: 'https://cf.shopee.vn/file/21574cd3cca2082131d082e75c7e1f95',
    comment: 'Ổn, đáng mua',
    createdAt: '2024-05-02T08:30:00Z',
    updatedAt: '2024-05-02T08:30:00Z',
  },
  {
    _id: 'r3',
    userId: 'u3',
    productId: 2,
    star: 3,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO5EkZC8oyZzI8oID_xoeArYrkpOOGiEP7oA&s',
    comment: 'Tạm ổn',
    createdAt: '2024-05-03T09:00:00Z',
    updatedAt: '2024-05-03T09:00:00Z',
  },
  {
    _id: 'r4',
    userId: 'u4',
    productId: 2,
    star: 4,
    image: 'https://product.hstatic.net/1000025647/product/nuoc_hoa_gucci_guilty_pour_femme_edp_50ml_f4e42fc4aa6549c6ae31fbda6e2d60f5_1024x1024.png',
    comment: 'Tạm ổn',
    createdAt: '2024-05-03T09:00:00Z',
    updatedAt: '2024-05-03T09:00:00Z',
  }
  
];

const ReviewManager = () => {
  const productColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Tên sản phẩm', dataIndex: 'name' },
  ];

  const expandedRowRender = (record: any) => {
    const related = reviews.filter((r) => r.productId === record.id);
    return (
      <Table
        rowKey="_id"
        dataSource={related}
        pagination={false}
        columns={[
          { title: 'User ID', dataIndex: 'userId' },
          { title: 'Sao', dataIndex: 'star' },
          { title: 'Nội dung', dataIndex: 'comment' },
          {
            title: 'Ảnh',
            dataIndex: 'image',
            render: (img: string) =>
              img ? <img src={img} width={40} alt="ảnh" /> : 'Không có',
          },
          { title: 'Tạo lúc', dataIndex: 'createdAt' },
          { title: 'Cập nhật', dataIndex: 'updatedAt' },
        ]}
      />
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tổng hợp đánh giá theo sản phẩm</h1>
      <Table
        rowKey="id"
        dataSource={products}
        columns={productColumns}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

export default ReviewManager;
