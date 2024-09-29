import { NBTTagType } from "../types";
import { NBTDocument } from "./NBTDocument";

export * from "./NBTDocument";
export * from "./Field";

export type NBTListField = [tagType: "List", inner: NBTFieldType];
export type NBTCompoundField = [tagType: "Compound", document: typeof NBTDocument];
export type NBTPrimitiveField = [tagType: Exclude<NBTTagType, "Compound" | "List" | "End"> | "Bool"];
export type NBTFieldType = NBTPrimitiveField | NBTCompoundField | NBTListField;
