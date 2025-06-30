import React from "react";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface AttributeValue {
  _id: string;
  value: string;
}

interface AttributeSelectorProps {
  name: string;
  attributeId: string;
  values: AttributeValue[];
  selected: string[];
  onChange: (selectedIds: string[]) => void;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  name,
  attributeId,
  values,
  selected,
  onChange,
}) => {
  const options: Option[] = values.map((v) => ({
    value: v._id,
    label: v.value,
  }));

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{name}</label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={(opts) => onChange(opts ? opts.map((o) => o.value) : [])}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            padding: "2px",
            borderRadius: "6px",
            borderColor: "#d1d5db",
            boxShadow: "none",
            minHeight: "38px",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#e5e7eb",
          }),
        }}
      />
    </div>
  );
};

export default AttributeSelector;
