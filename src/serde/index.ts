import { NBTCompression, NBTTag } from "../types";
import { BufferReader, BufferWriter } from "@xobj/buffer";
import { serde } from "./serde";
import { EnumVariant } from "@alan404/enum";

export * from "./serde";
export * from "./types";

export type SerdeOptions = {
    compression?: NBTCompression;
};

export const serializeNBT = (
    value: EnumVariant<NBTTag, "Compound">,
    options?: SerdeOptions
) => {
    let writer = new BufferWriter();
    serializeNBTTo(writer, value);
    return writer.buffer;
};

export const deserializeNBT = (
    buffer: ArrayBuffer,
    options?: SerdeOptions,
) => {
    let reader = new BufferReader(buffer);
    return deserializeNBTFrom(reader);
};

export const deserializeNBTFrom = (buf: BufferReader) =>
    NBTTag.Compound(serde.Compound.read(buf));

export const serializeNBTTo = (buf: BufferWriter, value: EnumVariant<NBTTag, "Compound">) =>
    serde.Compound.write(buf, value.data, true);
