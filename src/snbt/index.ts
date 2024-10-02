import { match } from "@alan404/enum";
import { NBTTag } from "../types";

const SafeKeyRegex = /^[0-9a-zA-Z_\-.+]$/;

const stringify = (nbt: NBTTag) => {
    return match(nbt)({
        End: () => ``,
        Byte: (v) => `${v}b`,
        Short: (v) => `${v}s`,
        Int: (v) => `${v}`,
        Long: (v) => `${v}l`,
        Float: (v) => `${v}f`,
        Double: (v) => `${v}d`,
        String: (v) => JSON.stringify(v),
        List: (v) => `[${v.map(x => stringify(x)).join(",")}]`,
        Compound: (v) => `{${
            Object.entries(v).map(([key, value]) => (
                `${SafeKeyRegex.test(key) ? key : JSON.stringify(key)}:${stringify(value)}`
            )).join(",")
        }}`,
        ByteArray: (v) => `[B;${v.map(x => `${x}b`).join(",")}]`,
        IntArray: (v) => `[I;${v.join(",")}]`,
        LongArray: (v) => `[L;${v.map(x => `${x}l`).join(",")}]`,
    });
};

const parse = (snbt: string) => {

};

export const SNBT = {

};
