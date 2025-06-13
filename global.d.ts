// global.d.ts
// 카카오맵 관련해서 추가한 파일
export {};

declare global {
  interface DaumPostcodeData {
    address: string;
  }

  interface DaumPostcodeOptions {
    oncomplete: (data: DaumPostcodeData) => void;
  }

  interface DaumPostcode {
    embed(container: HTMLElement): void;
  }

  interface Window {
    daum: {
      Postcode: new (opts: DaumPostcodeOptions) => DaumPostcode;
    };
  }
}
