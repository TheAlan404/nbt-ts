import { NBTTag, NBTTagList, NBTTagTypeFromID, NBTTagTypeToID } from "../types";
import { NBTError, NBTTagSerde } from "./types";

export const serde: NBTTagSerde = {
    End: { read: () => {}, write: () => {} },
    Byte: {
        read: (buf) => buf.readInt8(),
        write: (buf, value) => buf.writeInt8(value),
    },
    Short: {
        read: (buf) => buf.readInt16(),
        write: (buf, value) => buf.writeInt16(value),
    },
    Int: {
        read: (buf) => buf.readInt32(),
        write: (buf, value) => buf.writeInt32(value),
    },
    Long: {
        read: (buf) => {
            const low = buf.readInt32();
            const high = buf.readInt32();
            return (BigInt(high) << 32n) | BigInt(low >>> 0);
        },
        write: (buf, value) => {
            const low = Number(value & 0xFFFFFFFFn);
            const high = Number(value >> 32n);
            buf.writeInt32(low);
            buf.writeInt32(high);
        },
    },
    Float: {
        read: (buf) => buf.readFloat32(),
        write: (buf, value) => buf.writeFloat32(value),
    },
    Double: {
        read: (buf) => buf.readFloat64(),
        write: (buf, value) => buf.writeFloat64(value),
    },
    ByteArray: {
        read: (buf) => {
            let len = buf.readInt32();
            return Array(len).fill(0).map(() => buf.readInt8());
        },
        write: (buf, value) => {
            buf.writeInt32(value.length);
            for(let v of value) {
                buf.writeInt8(v);
            }
        },
    },
    String: {
        read: (buf) => {
            let len = buf.readUint16();
            let bytes = new Uint8Array(
                Array(len).fill(0).map(() => buf.readInt8())
            );
            return new TextDecoder().decode(bytes);
        },
        write: (buf, value) => {
            let bytes = new TextEncoder().encode(value);
            buf.writeUint16(bytes.length);
            for(let byte of bytes)
                buf.writeInt8(byte);
        },
    },
    List: {
        read: (buf) => {
            let typeId = buf.readUint8();
            let len = buf.readInt32();

            let variant = NBTTagTypeFromID[typeId];

            if(!variant)
                throw new NBTError(`Unknown Type ID: ${typeId}`, buf);

            return Array(len).fill(0)
                .map(() => (
                    (NBTTag[variant] as any)(serde[variant].read(buf))
                )) as any as NBTTagList;
        },
        write: (buf, value) => {
            let variant = value[0]?.type || "End";
            let typeId = NBTTagTypeToID[variant];

            buf.writeUint8(typeId);
            buf.writeInt32(value.length);
            
            for(let v of (value as NBTTag[])) {
                if(v.type !== variant)
                    throw new Error(`Expected NBT tag ${variant} but tag in list has ${v.type}`);
                (serde[variant].write as any)(buf, v.data);
            }
        },
    },
    Compound: {
        read: (buf) => {
            let compound: Record<string, NBTTag> = {};

            while(buf.bytesAvailable) {
                let typeId = buf.readUint8();
                let variant = NBTTagTypeFromID[typeId];
                
                if(!variant)
                    throw new NBTError(`Unknown TypeID: ${typeId}`, buf);
                if(variant == "End") break;

                let name = serde.String.read(buf);
                compound[name] = (NBTTag[variant] as any)(serde[variant].read(buf));
            }

            return compound;
        },
        write: (buf, value, withoutEndTag?: boolean) => {
            for(let [name, tag] of Object.entries(value)) {
                buf.writeUint8(NBTTagTypeToID[tag.type]);
                serde.String.write(buf, name);
                (serde[tag.type].write as any)(buf, tag.data);
            }

            if(!withoutEndTag) buf.writeUint8(NBTTagTypeToID["End"]);
        },
    },
    IntArray: {
        read: (buf) => {
            let len = buf.readInt32();
            return Array(len).fill(0).map(() => buf.readInt32());
        },
        write: (buf, value) => {
            buf.writeInt32(value.length);
            for(let v of value) {
                buf.writeInt32(v);
            }
        },
    },
    LongArray: {
        read: (buf) => {
            let len = buf.readInt32();
            return Array(len).fill(0).map(() => serde.Long.read(buf));
        },
        write: (buf, value) => {
            buf.writeInt32(value.length);
            for(let v of value) {
                serde.Long.write(buf, v);
            }
        },
    },
};
