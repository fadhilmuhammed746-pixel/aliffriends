declare module 'pdfjs-dist/build/pdf.min.mjs' {
  const content: any;
  export = content;
}

declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, options: any);
    loadFromHTML(elements: NodeList | HTMLElement[]): void;
    loadFromImages(images: string[]): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(pageIndex: number, corner?: 'top' | 'bottom'): void;
    destroy(): void;
    on(event: string, callback: (e: any) => void): void;
    off(event: string, callback: (e: any) => void): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
  }
}

