declare module 'sub-vn' {
  export interface Province {
    code: string;
    name: string;
  }

  export interface District {
    code: string;
    name: string;
    provinceCode: string;
  }

  export interface Ward {
    code: string;
    name: string;
    districtCode: string;
  }

  export function getProvinces(): Province[];
  export function getDistrictsByProvinceCode(provinceCode: string): District[];
  export function getWardsByDistrictCode(districtCode: string): Ward[];
}
