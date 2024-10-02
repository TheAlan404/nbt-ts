import { NBTTagType } from "../types";
import { NBTDocument } from "./NBTDocument";

export const NBTCompoundFields = Symbol.for("NBTCompoundFields");
export const NBTRoot = Symbol.for("NBTRoot");
export const NBTDeserializedFrom = Symbol.for("NBTDeserializedFrom");

export type NBTFieldMap = Record<string, NBTFieldInfo>;

export type NBTFieldInfo = {
    type: NBTFieldType;
};

export type NBTFieldType = NBTFieldTypePrimitive | NBTFieldTypeCompound | NBTFieldTypeList;
export type NBTFieldTypeList = [tagType: "List", inner: NBTFieldType];
export type NBTFieldTypeCompound = [tagType: "Compound"] | [tagType: "Compound", document: typeof NBTDocument];
export type NBTFieldTypePrimitive = [tagType: Exclude<NBTTagType, "Compound" | "List" | "End"> | "Bool"];

