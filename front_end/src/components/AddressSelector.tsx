import { useState, useEffect, useRef } from "react";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
  type Province,
  type District,
  type Ward,
} from "sub-vn";
import { ChevronDown, Search } from "lucide-react";

type AddressSelectorProps = {
  onChange: (address: {
    province?: Province;
    district?: District;
    ward?: Ward;
  }) => void;
  value: {
    province?: Province;
    district?: District;
    ward?: Ward;
  }
};

const AddressSelector = ({ onChange, value }: AddressSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"province" | "district" | "ward">("province");

  const [provinces] = useState<Province[]>(getProvinces());
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const { province: selectedProvince, district: selectedDistrict, ward: selectedWard } = value;

  const handleProvinceSelect = (province: Province) => {
    onChange({ province });
    setDistricts(getDistrictsByProvinceCode(province.code));
    setCurrentTab("district");
    setSearchQuery("");
  };

  const handleDistrictSelect = (district: District) => {
    onChange({ province: selectedProvince, district });
    setWards(getWardsByDistrictCode(district.code));
    setCurrentTab("ward");
    setSearchQuery("");
  };

  const handleWardSelect = (ward: Ward) => {
    onChange({ province: selectedProvince, district: selectedDistrict, ward });
    setIsOpen(false);
    setSearchQuery("");
  };

  const filteredProvinces = provinces.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredWards = wards.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cleanName = (name: string) => {
    return name
      .replace(/^(Tỉnh|Thành phố|Quận|Huyện|Thị xã|Phường|Xã|Thị trấn)\s*/, "")
  };

  const getDisplayValue = () => {
    const parts = [];
    if (selectedProvince) {
      parts.push(cleanName(selectedProvince.name));
    }
    if (selectedDistrict) {
      parts.push(cleanName(selectedDistrict.name));
    }
    if (selectedWard) {
      parts.push(cleanName(selectedWard.name));
    }
    
    if (parts.length > 0) {
      return parts.join(', ');
    }

    return "Tỉnh/Thành phố, Quận/Huyện, Phường/Xã";
  };

  const renderList = () => {
    switch (currentTab) {
      case "province":
        return filteredProvinces.map((p) => (
          <li
            key={p.code}
            onClick={() => handleProvinceSelect(p)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {cleanName(p.name)}
          </li>
        ));
      case "district":
        return filteredDistricts.map((d) => (
          <li
            key={d.code}
            onClick={() => handleDistrictSelect(d)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {cleanName(d.name)}
          </li>
        ));
      case "ward":
        return filteredWards.map((w) => (
          <li
            key={w.code}
            onClick={() => handleWardSelect(w)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {cleanName(w.name)}
          </li>
        ));
      default:
        return null;
    }
  };
  
  const resetSelection = () => {
    onChange({});
    setCurrentTab('province');
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex justify-between items-center cursor-pointer"
      >
        <span className="text-gray-700">{getDisplayValue()}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 pl-10 border-b border-gray-200 focus:outline-none"
                />
            </div>
          </div>
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setCurrentTab("province")}
              className={`flex-1 p-2 text-center ${currentTab === "province" ? "border-b-2 border-[#5f518e] text-[#5f518e]" : "text-gray-500"}`}
            >
              Tỉnh/Thành phố
            </button>
            <button
              onClick={() => setCurrentTab("district")}
              disabled={!selectedProvince}
              className={`flex-1 p-2 text-center ${currentTab === "district" ? "border-b-2 border-[#5f518e] text-[#5f518e]" : "text-gray-500"} disabled:cursor-not-allowed disabled:text-gray-300`}
            >
              Quận/Huyện
            </button>
            <button
              onClick={() => setCurrentTab("ward")}
              disabled={!selectedDistrict}
              className={`flex-1 p-2 text-center ${currentTab === "ward" ? "border-b-2 border-[#5f518e] text-[#5f518e]" : "text-gray-500"} disabled:cursor-not-allowed disabled:text-gray-300`}
            >
              Phường/Xã
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {(() => {
                const list = renderList();
                return list && list.length > 0 ? list : <li className="p-4 text-center text-gray-500">Không tìm thấy kết quả.</li>;
            })()}
          </ul>
           { (selectedProvince || selectedDistrict || selectedWard) &&
            <div className="p-2 border-t border-gray-200">
                <button onClick={resetSelection} className="text-sm text-orange-500 hover:underline">Chọn lại từ đầu</button>
            </div>
           }
        </div>
      )}
    </div>
  );
};

export default AddressSelector; 