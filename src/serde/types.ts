import { BufferReader, BufferWriter } from "@xobj/buffer";
import { NBTTag } from "../types";
import { EnumData } from "@alan404/enum";

export type NBTTagSerde = {
    [V in NBTTag["type"]]: {
        write: (buf: BufferWriter, value: EnumData<NBTTag, V>, ...opts: any[]) => void;
        read: (buf: BufferReader, ...opts: any[]) => EnumData<NBTTag, V>;
    };
};

export class NBTError extends Error {
    constructor(message: string, buf: BufferReader | BufferWriter) {
        super(`${message} -- at position ${buf.position}`);
    }
};
