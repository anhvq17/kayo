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
  export function getDistrictsByProvinceCode(code: string): District[];
  export function getWardsByDistrictCode(code: string): Ward[];
}
