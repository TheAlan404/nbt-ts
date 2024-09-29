# nbt-ts

NBT serialize and deserialize library for TypeScript

## Installation

```
npm i @alan404/nbt
pnpm add @alan404/nbt
yarn add @alan404/nbt
```

## NBTTag

NBT tags are represented as [Enum](https://github.com/TheAlan404/enum?tab=readme-ov-file)s - `{ type: string; data: any; }`

```ts
import { NBTTag } from "@alan404/nbt";

let tag = {
    type: "Compound",
    data: {
        name: {
            type: "String",
            data: "Sophia",
        },
        age: {
            type: "Byte",
            data: 19,
        },
    },
};

// Same thing but with enum factory

let tag = NBTTag.Compound({
    name: NBTTag.String("Sophia"),
    age: NBTTag.Byte(19),
});
```

## Manual Serialization / Deserialization

This library uses the native javascript [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) API.

```ts
import { NBTCompound, serializeNBT, deserializeNBT } from "@alan404/nbt";

let buffer: ArrayBuffer = serializeNBT(tag);
let anotherTag: NBTCompound = deserializeNBT(buffer);
```

## NBTDocument

This library also provides some support for serde-like functionality:

```ts
import { NBTDocument, Field } from "@alan404/nbt";

class Person extends NBTDocument {
    @Field("String")
    name: string = "";

    @Field("Byte")
    age: number = 0;
}

// or Person.deserialize(ArrayBuffer)
let person = Person.deserializeFromTag(tag);

let buf: ArrayBuffer = person.serialize();
let tag = person.serializeToTag();
```

Supports more complicated scenarios:

```ts
import { NBTRoot, NBTDocument, Field } from "@alan404/nbt";

class Server extends NBTDocument {
    @Field("String")
    name: string;

    @Field("String")
    ip: string;
    
    @Field("String")
    icon: boolean;
}

class ServersDat extends NBTDocument {
    [NBTRoot] = "";

    @Field("List", ["Compound", Server])
    servers: Server[];
}
```

The `[NBTRoot]` symbol property allows you to serialize and deserialize **root** NBT tags (nbt format is implicitly inside a NBTCompound), set to `false` to mark as not root (default) or a string to give it a name.
