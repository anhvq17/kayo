import React, { useEffect, useState } from "react";
import axios from "axios";

interface AttributeValue {
  _id: string;
  value: string;
  attributeId: {
    _id: string;
    name: string;
  };
}

interface GroupedAttribute {
  attributeId: string;
  name: string;
  values: AttributeValue[];
}

interface VariantInput {
  attributes: { attributeId: string; valueId: string }[];
  price: string;
  stock: string;
  sku: string;
  image: File | null;
}

interface ProductInput {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  priceDefault: string;
  image: File | null;
}

const AddProduct = () => {
  const [attributes, setAttributes] = useState<GroupedAttribute[]>([]);
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: AttributeValue[] }>({});
  const [variants, setVariants] = useState<VariantInput[]>([]);
  const [productInfo, setProductInfo] = useState<ProductInput>({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    priceDefault: "",
    image: null,
  });

  useEffect(() => {
    const fetchAttributes = async () => {
      const res = await axios.get("http://localhost:3000/attribute-value");
      const values: AttributeValue[] = res.data.data;

      const grouped: { [key: string]: GroupedAttribute } = {};
      values.forEach((val) => {
        const attrId = val.attributeId._id;
        if (!grouped[attrId]) {
          grouped[attrId] = {
            attributeId: attrId,
            name: val.attributeId.name,
            values: [],
          };
        }
        grouped[attrId].values.push(val);
      });

      setAttributes(Object.values(grouped));
    };
    fetchAttributes();
  }, []);

  const handleSelectValues = (attributeId: string, selectedIds: string[]) => {
    const group = attributes.find((a) => a.attributeId === attributeId);
    if (!group) return;
    const selected = group.values.filter((val) => selectedIds.includes(val._id));
    setSelectedValues((prev) => ({ ...prev, [attributeId]: selected }));
  };

  const generateVariants = () => {
    const entries = Object.entries(selectedValues);
    const attrVals = entries.map(([_, vals]) => vals);

    if (attrVals.some((arr) => arr.length === 0)) return;

    const cartesian = attrVals.reduce<AttributeValue[][]>(
      (acc, curr) =>
        ([] as AttributeValue[][]).concat(
          ...acc.map((a) => curr.map((b) => [...a, b]))
        ),
      [[]]
    );

    const newVariants: VariantInput[] = cartesian.map((combo) => {
      const attrs = combo.map((val) => ({
        attributeId: val.attributeId._id,
        valueId: val._id,
      }));
      return {
        attributes: attrs,
        price: "",
        stock: "",
        sku: "",
        image: null,
      };
    });

    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: keyof VariantInput, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(productInfo).forEach(([key, val]) => {
        if (key === "image" && val) formData.append("image", val);
        else formData.append(key, val as string);
      });

      const productRes = await axios.post("http://localhost:3000/products", formData);
      const productId = productRes.data.data._id;

      for (const variant of variants) {
        const variantData = new FormData();
        variantData.append("productId", productId);
        variantData.append("price", variant.price);
        variantData.append("stock_quantity", variant.stock);
        variantData.append("sku", variant.sku);
        if (variant.image) variantData.append("image", variant.image);
        variantData.append("attributes", JSON.stringify(variant.attributes));

        await axios.post("http://localhost:3000/product-variants", variantData);
      }

      alert("Tạo sản phẩm thành công!");
    } catch (error) {
      console.error(error);
      alert("Tạo sản phẩm thất bại");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white space-y-6">
      <h2 className="text-xl font-semibold">Thêm sản phẩm với biến thể</h2>

      <input
        placeholder="Tên sản phẩm"
        className="w-full border px-3 py-2 rounded"
        onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
      />
      <textarea
        placeholder="Mô tả"
        className="w-full border px-3 py-2 rounded"
        onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
      />
      <input
        placeholder="Giá mặc định"
        className="w-full border px-3 py-2 rounded"
        onChange={(e) => setProductInfo({ ...productInfo, priceDefault: e.target.value })}
      />
      <input
        type="file"
        onChange={(e) => setProductInfo({ ...productInfo, image: e.target.files?.[0] || null })}
      />

      {/* Attribute selectors */}
      {attributes.map((attr) => (
        <div key={attr.attributeId} className="mb-4">
          <label className="block font-medium mb-1">{attr.name}</label>
          <select
            className="border px-3 py-2 rounded w-full"
            onChange={(e) => {
              const selectedId = e.target.value;
              if (!selectedId) return;
              const existing = selectedValues[attr.attributeId] || [];
              const alreadySelected = existing.some((v) => v._id === selectedId);
              if (!alreadySelected) {
                const selectedVal = attr.values.find((v) => v._id === selectedId);
                if (selectedVal) {
                  setSelectedValues((prev) => ({
                    ...prev,
                    [attr.attributeId]: [...existing, selectedVal],
                  }));
                }
              }
              e.target.value = "";
            }}
          >
            <option value="">-- Chọn {attr.name} --</option>
            {attr.values.map((val) => (
              <option key={val._id} value={val._id}>{val.value}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {(selectedValues[attr.attributeId] || []).map((val) => (
              <div
                key={val._id}
                className="px-3 py-1 bg-blue-600 text-white rounded-full flex items-center gap-2"
              >
                {val.value}
                <button
                  type="button"
                  onClick={() => {
                    const updated = selectedValues[attr.attributeId].filter((v) => v._id !== val._id);
                    setSelectedValues((prev) => ({ ...prev, [attr.attributeId]: updated }));
                  }}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={generateVariants}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tạo biến thể
      </button>

      {variants.map((variant, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded"
        >
          <div className="md:col-span-2">
            {variant.attributes.map((a, i) => {
              const attr = attributes.find(attr => attr.attributeId === a.attributeId);
              const val = attr?.values.find(v => v._id === a.valueId);
              return (
                <p key={i} className="text-sm">
                  {attr?.name || a.attributeId} - {val?.value || a.valueId}
                </p>
              );
            })}
          </div>
          <input
            placeholder="Giá"
            value={variant.price}
            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <input
            placeholder="Số lượng"
            value={variant.stock}
            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <input
            placeholder="SKU"
            value={variant.sku}
            onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="file"
            onChange={(e) => handleVariantChange(index, "image", e.target.files?.[0] || null)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Thêm sản phẩm
      </button>
    </div>
  );
};

export default AddProduct;
