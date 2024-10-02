import { expect, test } from "vitest";
import { Field, NBTDocument, NBTTag } from "../src";

class Data extends NBTDocument {
    @Field("Compound")
    properties: Record<string, NBTTag>;
}

test("unnested class compounds", () => {
    let tag = NBTTag.Compound({
        properties: NBTTag.Compound({
            name: NBTTag.String("sophia"),
            age: NBTTag.Byte(19),
        }),
    });

    let dat = Data.deserializeFromTag(tag);

    expect(dat.properties.name).toStrictEqual(NBTTag.String("sophia"));
    expect(dat.properties.age).toStrictEqual(NBTTag.Byte(19));
});
