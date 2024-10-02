import fs from "node:fs";

export const readFileToArrayBuffer = (p: string) => {
    let b = fs.readFileSync(p);
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
};

export const bufferToHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");

export const bufferFromHex = (hex: string) => new Uint8Array(hex.match(/../g)!.map(h=>parseInt(h,16))).buffer;
