import { createFactory, Enum, EnumVariant, match } from "@alan404/enum";

export type NBTTagList = {
    [V in NBTTag["type"]]: EnumVariant<NBTTag, V>[]
}[NBTTag["type"]];

export const NBTTag = createFactory<NBTTag>();
export type NBTTag = Enum<{
    End: void;
    Byte: number;
    Short: number;
    Int: number;
    Long: bigint;
    Float: number;
    Double: number;
    ByteArray: number[];
    String: string;
    List: NBTTagList;
    Compound: Record<string, NBTTag>;
    IntArray: number[];
    LongArray: bigint[];
}>;

export type NBTCompound = EnumVariant<NBTTag, "Compound">;

export type NBTTagType = NBTTag["type"];

export const NBTTagTypeToID: Record<NBTTagType, number> = {
    End: 0,
    Byte: 1,
    Short: 2,
    Int: 3,
    Long: 4,
    Float: 5,
    Double: 6,
    ByteArray: 7,
    String: 8,
    List: 9,
    Compound: 10,
    IntArray: 11,
    LongArray: 12,
};

export const NBTTagTypeFromID: Record<number, NBTTagType> = Object.fromEntries(
    (Object.entries(NBTTagTypeToID) as [NBTTagType, number][])
        .map(([variant, byte]) => [byte, variant])
);
