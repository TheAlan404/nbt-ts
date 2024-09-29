import { EnumVariant } from "@alan404/enum";
import { deserializeNBT, serializeNBT } from "../serde";
import { NBTCompound, NBTTag } from "../types";
import { NBTCompoundField, NBTFieldType, NBTListField } from ".";

export const NBTCompoundFields = Symbol.for("NBTCompoundFields");
export const NBTRoot = Symbol.for("NBTRoot");

const deserializeField = (
    field: NBTFieldType,
    tag: NBTTag,
) => {
    let [tagType] = field;

    if(tagType == "Bool") {
        return !!tag.data;
    } else if(tagType == "Compound") {
        let child = new (field as NBTCompoundField)[1]();
        deserializeDocument(child, tag as EnumVariant<NBTTag, "Compound">);
        return child;
    } else if (tagType == "List") {
        let [_, inner] = field as NBTListField;
        return (tag as EnumVariant<NBTTag, "List">).data
            .map((child: NBTTag) => deserializeField(inner, child));
    } else {
        return tag.data;
    }
};

const deserializeDocument = (
    self: NBTDocument,
    compound: EnumVariant<NBTTag, "Compound">,
) => {
    for(let [key, field] of Object.entries((self.constructor as typeof NBTDocument)[NBTCompoundFields])) {
        if(compound.data[key])
            self[key] = deserializeField(field, compound.data[key]);
    }
    return self;
};

const serializeField = (
    field: NBTFieldType,
    value: any,
) => {
    let [tagType] = field;
    if(tagType == "Compound") {
        return serializeObject(value as NBTDocument);
    } else if (tagType == "List") {
        let [_, inner] = field as NBTListField;
        return NBTTag.List(
            ((value || []) as any[]).map(x => serializeField(inner, x))
        );
    } else if (tagType == "Bool") {
        return NBTTag.Byte(value ? 1 : 0);
    } else {
        return (NBTTag[tagType] as any)(value);
    }
};

const serializeObject = <T extends NBTDocument>(doc: T) => {
    let comp = {};
    for(let [key, field] of Object.entries((doc.constructor as typeof NBTDocument)[NBTCompoundFields])) {
        comp[key] = serializeField(field, doc[key]);
    }
    return NBTTag.Compound(comp);
};

export class NBTDocument {
    static [NBTCompoundFields]: Record<string, NBTFieldType> = {};
    [NBTRoot]: false | string = false;

    static deserialize(buffer: ArrayBuffer) {
        return this.deserializeFromTag(deserializeNBT(buffer));
    }

    static deserializeFromTag(tag: NBTCompound) {
        let compound = tag;

        let self = new this();
        if(typeof self[NBTRoot] == "string")
            compound = compound.data[self[NBTRoot]] as EnumVariant<NBTTag, "Compound">;

        deserializeDocument(self, compound);
        return self;
    }

    serializeToTag() {
        let compound = serializeObject(this);

        if(typeof this[NBTRoot] == "string")
            compound = NBTTag.Compound({ [this[NBTRoot]]: compound });
        return compound;
    }

    serialize() {
        return serializeNBT(this.serializeToTag());
    }
}
