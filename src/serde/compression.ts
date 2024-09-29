import { BufferReader } from "@xobj/buffer";
import { NBTCompression, NBTTagTypeToID } from "../types";

export const compressed = (buffer: ArrayBuffer, fmt: NBTCompression) => {
    if (fmt == NBTCompression.None) return buffer;


};

export const decompressed = (buffer: ArrayBuffer, fmt: NBTCompression) => {
    if (fmt == NBTCompression.None) return buffer;


};

const peek = (buf: BufferReader) => {
    let b = buf.readInt8();
    buf.position--;
    return b;
};

export const detectCompression = (buf: BufferReader) => {
    let firstByte = peek(buf);

    if (firstByte == NBTTagTypeToID["Compound"]) return NBTCompression.None;
    if (firstByte == 0x1F) return NBTCompression.Gzip;
    if (firstByte == 0x78) return NBTCompression.Zlib;

    throw new Error("Couldn't detect compression");
};
