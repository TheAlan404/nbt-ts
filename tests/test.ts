import fs from "node:fs"
import { NBTDocument, Field, NBTRoot } from "../src/index"
import { BufferReader, BufferWriter } from "@xobj/buffer";
import { EnumVariant } from "@alan404/enum";

const createBuffer = (p: string) => {
    let b = fs.readFileSync(p);
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
};

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");

const fromHex = (hex: string) => new Uint8Array(hex.match(/../g)!.map(h=>parseInt(h,16))).buffer;

// -----------------------------

class Server extends NBTDocument {
    @Field("Bool")
    acceptTextures: boolean;

    @Field("Bool")
    preventsChatReports: boolean;

    @Field("Bool")
    hidden: boolean;

    @Field("String")
    ip: string;

    @Field("String")
    name: string;
}

class ServersDat extends NBTDocument {
    [NBTRoot] = "";

    @Field("List", ["Compound", Server])
    servers: Server[];
}

let x = ServersDat.deserialize( createBuffer("C:/Users/dennis/AppData/Roaming/PrismLauncher/instances/LCTR_Creative/.minecraft/servers.dat") );


let y = ServersDat.deserialize(x.serialize());
console.log(y);

