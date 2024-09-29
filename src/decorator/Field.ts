import { NBTCompoundFields, NBTDocument, NBTFieldType } from ".";

export const Field = (
    ...fieldType: NBTFieldType
) => {
    return <This extends NBTDocument, Value>(
        value: Value,
        ctx: ClassFieldDecoratorContext<This, Value>
    ) => {
        return function(this: This, initial: Value) {
            if(typeof ctx.name !== "symbol")
                this.constructor[NBTCompoundFields][ctx.name] = fieldType;

            return initial as any;
        };
    };
};
