import React, { useEffect, useState } from "react";

type Category = { _id: string; name: string };
type Brand = { _id: string; name: string };
type Attribute = { _id: string; name: string; attributeCode: string };
type AttributeValue = {
  _id: string;
  value: string;
  valueCode: string;
  attributeId: {
    _id: string;
    name: string;
  };
};
type SelectedAttribute = { attributeId: string; attributeName: string; selectedValues: string[] };
type Variant = {
  sku: string;
  price: string;
  stock: string;
  image: File | null;
  attributes: { attributeId: string; valueId: string; valueName: string }[];
};

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);

  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [showAttributeSelector, setShowAttributeSelector] = useState(false);
  const [currentAttributeId, setCurrentAttributeId] = useState("");
  const [tempSelectedValues, setTempSelectedValues] = useState<string[]>([]);
  const [step, setStep] = useState<"select-attribute" | "select-values">("select-attribute");

  useEffect(() => {
    const fetchAll = async () => {
      const [cat, brand, attr, attrVal] = await Promise.all([
        fetch("http://localhost:3000/categories").then((res) => res.json()),
        fetch("http://localhost:3000/brands").then((res) => res.json()),
        fetch("http://localhost:3000/attribute").then((res) => res.json()),
        fetch("http://localhost:3000/attribute-value").then((res) => res.json()),
      ]);
      setCategories(cat.data || []);
      setBrands(brand.data || []);
      setAttributes(attr.data || []);
      setAttributeValues(attrVal.data || []);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    generateVariants();
  }, [selectedAttributes]);

  const getAttributeValues = (attrId: string) =>
    attributeValues.filter((v) => v.attributeId?._id === attrId);

  const getAvailableAttributes = () =>
    attributes.filter((a) => !selectedAttributes.find((s) => s.attributeId === a._id));

  const handleStartSelectAttribute = (attrId: string) => {
    setCurrentAttributeId(attrId);
    setTempSelectedValues([]);
    setStep("select-values");
  };

  const handleToggleValue = (valueId: string) => {
    setTempSelectedValues((prev) =>
      prev.includes(valueId) ? prev.filter((v) => v !== valueId) : [...prev, valueId]
    );
  };

  const handleConfirmAttributeValues = () => {
    const attr = attributes.find((a) => a._id === currentAttributeId);
    if (!attr || tempSelectedValues.length === 0) return;

    setSelectedAttributes((prev) => [
      ...prev,
      { attributeId: attr._id, attributeName: attr.name, selectedValues: tempSelectedValues },
    ]);

    setShowAttributeSelector(false);
    setStep("select-attribute");
    setCurrentAttributeId("");
    setTempSelectedValues([]);
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setSelectedAttributes((prev) => prev.filter((a) => a.attributeId !== attributeId));
  };

  const generateVariants = () => {
    const valid = selectedAttributes.filter((a) => a.selectedValues.length > 0);
    if (valid.length === 0) return setVariants([]);

    let combinations: Variant["attributes"][] = [[]];

    valid.forEach((attr) => {
      const values = attr.selectedValues.map((vId) => {
        const val = attributeValues.find((v) => v._id === vId);
        return val
          ? { attributeId: val.attributeId._id, valueId: vId, valueName: val.value }
          : null;
      }).filter(Boolean) as Variant["attributes"];

      combinations = combinations.flatMap((combo) =>
        values.map((val) => [...combo, val])
      );
    });

    const newVariants = combinations.map((combo) => ({
      sku: `${name.slice(0, 3).toUpperCase()}-${combo.map(c => c.valueName.slice(0, 2)).join("-")}-${Date.now().toString().slice(-4)}`,
      price: "",
      stock: "",
      image: null,
      attributes: combo,
    }));

    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveAttributeValue = (attributeId: string, valueId: string) => {
    setSelectedAttributes((prev) =>
      prev
        .map((attr) =>
          attr.attributeId === attributeId
            ? {
              ...attr,
              selectedValues: attr.selectedValues.filter((v) => v !== valueId),
            }
            : attr
        )
        .filter((attr) => attr.selectedValues.length > 0)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, description, categoryId, brandId, image, variants });
    alert("Đã submit, cần xử lý gửi lên server.");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 space-y-6 bg-white rounded">
      <h2 className="text-xl font-semibold">Thêm sản phẩm</h2>

      {/* Basic fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Giá mặc định"
          type="number"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          className="border p-2 rounded w-full"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Chọn danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full"
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          required
        >
          <option value="">Chọn thương hiệu</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      </div>

      <textarea
        className="border p-2 rounded w-full"
        placeholder="Mô tả sản phẩm"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        className="border p-2 rounded w-full"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        required
      />

      {/* Attribute section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Phân loại sản phẩm</h3>
          <button
            type="button"
            onClick={() => {
              setShowAttributeSelector(true);
              setStep("select-attribute");
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Thêm thuộc tính
          </button>
        </div>

        {selectedAttributes.map((attr) => (
          <div key={attr.attributeId} className="mb-4 border p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <strong>{attr.attributeName}</strong>
              <button
                type="button"
                onClick={() => handleRemoveAttribute(attr.attributeId)}
                className="text-red-500 text-sm"
              >
                Xóa
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {getAttributeValues(attr.attributeId).map((val) => {
                const isSelected = attr.selectedValues.includes(val._id);
                return (
                  <span
                    key={val._id}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer ${isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    onClick={() => {
                      if (isSelected) {
                        handleRemoveAttributeValue(attr.attributeId, val._id);
                      } else {
                        setSelectedAttributes((prev) =>
                          prev.map((a) =>
                            a.attributeId === attr.attributeId
                              ? { ...a, selectedValues: [...a.selectedValues, val._id] }
                              : a
                          )
                        );
                      }
                    }}
                  >
                    {val.value}
                    {isSelected && (
                      <button
                        type="button"
                        className="font-bold ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAttributeValue(attr.attributeId, val._id);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </span>
                );
              })}

            </div>
          </div>
        ))}

      </div>

      {/* Variant table */}
      {variants.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Biến thể sản phẩm ({variants.length})</h4>
          <div className="overflow-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {selectedAttributes.map((attr) => (
                    <th key={attr.attributeId} className="border px-2 py-1">{attr.attributeName}</th>
                  ))}
                  <th className="border px-2 py-1">SKU</th>
                  <th className="border px-2 py-1">Giá</th>
                  <th className="border px-2 py-1">Kho</th>
                  <th className="border px-2 py-1">Ảnh</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v, i) => (
                  <tr key={i}>
                    {v.attributes.map((a) => (
                      <td key={a.valueId} className="border px-2 py-1">{a.valueName}</td>
                    ))}
                    <td className="border px-2 py-1">
                      <input
                        value={v.sku}
                        onChange={(e) => handleVariantChange(i, "sku", e.target.value)}
                        className="border rounded px-1 w-24"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                        className="border rounded px-1 w-20"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                        className="border rounded px-1 w-20"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleVariantChange(i, "image", e.target.files?.[0] || null)
                        }
                        className="text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Thêm sản phẩm
      </button>

      {/* Modal: chọn thuộc tính và giá trị */}
      {showAttributeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-bold mb-4">
              {step === "select-attribute"
                ? "Chọn thuộc tính"
                : "Chọn giá trị cho thuộc tính"}
            </h4>

            {step === "select-attribute" ? (
              <>
                {getAvailableAttributes().map((a) => (
                  <button
                    key={a._id}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                    onClick={() => handleStartSelectAttribute(a._id)}
                  >
                    {a.name}
                  </button>
                ))}
                {getAvailableAttributes().length === 0 && (
                  <p className="text-gray-500 text-sm text-center">
                    Không còn thuộc tính nào khả dụng
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {getAttributeValues(currentAttributeId).map((v) => {
                    const selected = tempSelectedValues.includes(v._id);
                    return (
                      <span
                        key={v._id}
                        className={`px-3 py-2 rounded-md cursor-pointer text-center ${selected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700"
                          }`}
                        onClick={() => handleToggleValue(v._id)}
                      >
                        {v.value}
                      </span>
                    );
                  })}
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="text-sm text-gray-500"
                    onClick={() => setStep("select-attribute")}
                  >
                    ← Quay lại
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 bg-blue-500 text-white rounded ${tempSelectedValues.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                    onClick={handleConfirmAttributeValues}
                    disabled={tempSelectedValues.length === 0}
                  >
                    Xác nhận ({tempSelectedValues.length} giá trị)
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => setShowAttributeSelector(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm block mx-auto"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddProduct;
