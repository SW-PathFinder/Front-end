interface TileMapConfig {
  src: string;
  cols: number;
  rows: number;
  width: number;
  height: number;
  gapX?: number;
  gapY?: number;
}

export class TileMap {
  readonly config: Required<TileMapConfig>;

  constructor({
    src,
    cols,
    rows,
    width,
    height,
    gapX = 0,
    gapY = 0,
  }: TileMapConfig) {
    this.config = { src, cols, rows, width, height, gapX, gapY };
  }

  getTileStyle(id: number): React.CSSProperties {
    const { cols, rows, width, height, gapX, gapY } = this.config;
    const col = id % cols;
    const row = Math.floor(id / cols);
    const x = col * (width + gapX);
    const y = row * (height + gapY);

    return {
      width: `${width}px`,
      height: `${height}px`,
      backgroundImage: `url(${this.config.src})`,
      backgroundPosition: `-${x}px -${y}px`,
      backgroundSize: `${cols * (width + gapX)}px ${rows * (height + gapY)}px`,
    };
  }
}

// const cropImages = async () => {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   // crop tilemap into tiles and save as images
//   function cropTileMapToImages(tileMap) {
//     const { cols, rows, width, height, gapX, gapY, src } = tileMap.config;

//     if (!ctx) throw new Error("Canvas context not available");
//     canvas.width = cols * (width + gapX);
//     canvas.height = rows * (height + gapY);
//     const image = new Image();
//     image.src = src;
//     const tileImages = {};
//     return new Promise((resolve) => {
//       image.onload = () => {
//         ctx.drawImage(image, 0, 0);
//         for (let id = 0; id < cols * rows; id++) {
//           const col = id % cols;
//           const row = Math.floor(id / cols);
//           const x = col * (width + gapX);
//           const y = row * (height + gapY);
//           const tileCanvas = document.createElement("canvas");
//           tileCanvas.width = width;
//           tileCanvas.height = height;
//           const tileCtx = tileCanvas.getContext("2d");
//           if (!tileCtx) throw new Error("Tile canvas context not available");
//           tileCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
//           tileImages[id] = tileCanvas.toDataURL();
//         }
//         resolve(tileImages);
//       };
//     });
//   }

//   function downloadFileViaLink(url, filename = "") {
//     const link = document.createElement("a");
//     link.href = url;
//     link.style.display = "none";
//     link.download = filename;

//     document.body.appendChild(link);
//     link.click();

//     setTimeout(() => {
//       document.body.removeChild(link);
//       link.remove();
//     }, 3e4);
//   }

//   const inp = document.createElement("input");
//   inp.type = "file";
//   inp.click();

//   const tileMap = new TileMap({
//     src: URL.createObjectURL(inp.files[0]),
//     width: 120,
//     height: 194,
//     cols: 11,
//     rows: 4,
//     gapX: 6,
//   });

//   const tileImages = await cropTileMapToImages(tileMap);

//   Object.entries(tileImages)
//     .slice(0, 10)
//     .forEach(([idx, img]) => downloadFileViaLink(img, idx));
//   Object.entries(tileImages)
//     .slice(10, 20)
//     .forEach(([idx, img]) => downloadFileViaLink(img, idx));
//   Object.entries(tileImages)
//     .slice(20, 30)
//     .forEach(([idx, img]) => downloadFileViaLink(img, idx));
//   Object.entries(tileImages)
//     .slice(30, 40)
//     .forEach(([idx, img]) => downloadFileViaLink(img, idx));
//   Object.entries(tileImages)
//     .slice(40)
//     .forEach(([idx, img]) => downloadFileViaLink(img, idx));
// };
