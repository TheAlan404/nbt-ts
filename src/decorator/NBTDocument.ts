import { EnumVariant } from "@alan404/enum";
import { deserializeNBT, serializeNBT } from "../serde";
import { NBTCompound, NBTTag, NBTTagList } from "../types";
import { NBTFieldTypeCompound, NBTFieldType, NBTFieldTypeList } from ".";
import { NBTCompoundFields, NBTDeserializedFrom, NBTFieldMap, NBTRoot } from "./types";

type Constructor<T> = { new (): T };

const deserializeField = (
    field: NBTFieldType,
    tag: NBTTag,
): any => {
    let [tagType] = field;

    if(tagType == "Bool") {
        return !!tag.data;
    } else if(tagType == "Compound") {
        let [_, Child] = field as NBTFieldTypeCompound;
        if(Child) {
            let child = new Child();
            child.deserializeFromTag(tag as EnumVariant<NBTTag, "Compound">);
            return child;
        } else {
            return tag.data;
        }
        //deserializeDocument(child, tag as EnumVariant<NBTTag, "Compound">);
    } else if (tagType == "List") {
        let [_, inner] = field as NBTFieldTypeList;
        return (tag as EnumVariant<NBTTag, "List">).data
            .map((child: NBTTag) => deserializeField(inner, child));
    } else {
        return tag.data;
    }
};

const deserializeDocument = (
    self: NBTDocument,
    compound: EnumVariant<NBTTag, "Compound">,
): NBTDocument => {
    for(let [key, field] of Object.entries((self.constructor as typeof NBTDocument)[NBTCompoundFields])) {
        if(compound.data[key])
            self[key] = deserializeField(field.type, compound.data[key]);
    }
    return self;
};

const serializeField = (
    field: NBTFieldType,
    value: any,
): NBTTag => {
    let [tagType] = field;
    if(tagType == "Compound") {
        return serializeObject(value as NBTDocument);
    } else if (tagType == "List") {
        let [_, inner] = field as NBTFieldTypeList;
        return NBTTag.List(
            ((value || []) as any[]).map(x => serializeField(inner, x)) as NBTTagList
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
        comp[key] = serializeField(field.type, doc[key]);
    }
    return NBTTag.Compound(comp);
};

export class NBTDocument {
    static [NBTCompoundFields]: NBTFieldMap = {};
    [NBTRoot]: false | string = false;
    [NBTDeserializedFrom]?: NBTCompound;

    static deserialize<T extends NBTDocument>(this: Constructor<T>, buffer: ArrayBuffer): T {
        return (this as unknown as NBTDocument).deserializeFromTag(deserializeNBT(buffer)) as T;
    }

    static deserializeFromTag<T extends NBTDocument>(this: Constructor<T>, tag: NBTCompound): T {
        return (new this()).deserializeFromTag(tag);
    }

    deserializeFromTag(tag: NBTCompound) {
        let compound = tag;

        if(typeof this[NBTRoot] == "string")
            compound = compound.data[this[NBTRoot]] as EnumVariant<NBTTag, "Compound">;

        deserializeDocument(this, compound);
        this[NBTDeserializedFrom] = compound;
        return this;
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
