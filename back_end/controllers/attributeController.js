import AttributeModel from "../models/AttributeModel.js";
import AttributeValueModel from "../models/AttributeValueModel.js";
import { attributeSchema } from "../validations/attribute.js";

// Lấy danh sách attributes chưa bị xóa mềm
export const getAllAttributes = async (req, res) => {
  try {
    const attributes = await AttributeModel.find({ deletedAt: null })
      .sort({ createdAt: -1 })
    return res.status(200).json({
      message: "All Attributes",
      data: attributes,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAttributeDetail = async (req, res) => {
  try {
    const attribute = await AttributeModel.findById(req.params.id);
    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({
      message: "Detail Attribute",
      data: attribute,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createAttribute = async (req, res) => {
  try {
    const { error } = attributeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { name, attributeCode, description } = req.body;

    // Kiểm tra trùng name
    const nameExists = await AttributeModel.findOne({
      name: name.trim(),
      deletedAt: null,
    });
    if (nameExists) {
      return res.status(400).json({
        message: "Tên thuộc tính đã tồn tại",
        errors: ["Tên thuộc tính đã tồn tại"],
      });
    }

    // Kiểm tra trùng attributeCode
    const codeExists = await AttributeModel.findOne({
      attributeCode: attributeCode.trim(),
      deletedAt: null,
    });
    if (codeExists) {
      return res.status(400).json({
        message: "Mã thuộc tính đã tồn tại",
        errors: ["Mã thuộc tính đã tồn tại"],
      });
    }

    const attribute = await AttributeModel.create({ name, attributeCode, description });
    return res.status(200).json({
      message: "Tạo thuộc tính thành công",
      data: attribute,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const updateAttribute = async (req, res) => {
  try {
    const { error } = attributeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const attribute = await AttributeModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({
      message: "Update Attribute",
      data: attribute,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// xóa mềm 1 cái
export const softDeleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra nếu thuộc tính đang có giá trị
    const isUsed = await AttributeValueModel.exists({
      attributeId: id,
      deletedAt: null,
    });

    if (isUsed) {
      return res.status(400).json({
        message: "Không thể xóa thuộc tính vì vẫn còn giá trị liên kết.",
      });
    }

    const attribute = await AttributeModel.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });

    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính." });
    }

    return res.status(200).json({ message: "Đã chuyển thuộc tính vào thùng rác." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// RESTORE
export const restoreAttribute = async (req, res) => {
  try {
    const attribute = await AttributeModel.findByIdAndUpdate(req.params.id, {
      deletedAt: null,
    });
    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({ message: "Restored Attribute" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// HARD DELETE
export const hardDeleteAttribute = async (req, res) => {
  try {
    const attribute = await AttributeModel.findByIdAndDelete(req.params.id);
    if (!attribute) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({
      message: "Hard Deleted Attribute",
      data: attribute,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Lấy tất cả attribute đã bị xóa mềm
export const getTrashedAttributes = async (req, res) => {
  try {
    const trashedAttributes = await AttributeModel.find({ deletedAt: { $ne: null } });
    return res.status(200).json({
      message: "Danh sách thuộc tính trong thùng rác",
      data: trashedAttributes,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khôi phục nhiều attributes đã bị xóa mềm
export const restoreManyAttributes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await AttributeModel.updateMany(
      { _id: { $in: ids } },
      { deletedAt: null }
    );

    return res.status(200).json({
      message: "Khôi phục thành công các thuộc tính",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa mềm nhiều attributes 
// export const softDeleteManyAttributes = async (req, res) => {
//   try {
//     const { ids } = req.body;
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
//     }

//     // 1. Kiểm tra xem thuộc tính nào đang chứa giá trị con
//     const usedAttributes = await AttributeValueModel.find({
//       attributeId: { $in: ids },
//       deletedAt: null,
//     }).distinct("attributeId"); // Lấy danh sách _id thuộc tính đang bị dùng

//     // 2. Nếu có ràng buộc
//     if (usedAttributes.length > 0) {
//       return res.status(400).json({
//         message: "Không thể xóa các thuộc tính đang chứa giá trị con.",
//         usedAttributeIds: usedAttributes, // Gửi danh sách bị ràng buộc cho FE
//       });
//     }

//     // 3. Xóa các thuộc tính còn lại
//     const result = await AttributeModel.updateMany(
//       { _id: { $in: ids } },
//       { deletedAt: new Date() }
//     );

//     return res.status(200).json({
//       message: "Đã chuyển các thuộc tính vào thùng rác",
//       data: result,
//     });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

// Xóa cứng nhiều attributes đã bị xóa mềm
export const hardDeleteManyAttributes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
    }

    const result = await AttributeModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: "Xóa vĩnh viễn các thuộc tính thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
