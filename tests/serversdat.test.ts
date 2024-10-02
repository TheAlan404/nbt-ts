import { test, expect } from "vitest";
import { NBTDocument, Field, NBTRoot } from "../src/index"
import { readFileToArrayBuffer } from "./util";

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


test("servers.dat deserialization", () => {
    let dat = ServersDat.deserialize(readFileToArrayBuffer("./tests/bin/servers.dat"));

    expect(dat.servers.length).above(0);
    expect(dat.servers[0].ip).toBe("localhost");
    expect(dat.servers[0].name).toBe("Minecraft Server");
});


