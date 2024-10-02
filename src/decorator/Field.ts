import { NBTCompoundFields, NBTDocument, NBTFieldMap, NBTFieldType } from ".";

export const Field = (
    ...fieldType: NBTFieldType
) => {
    return <This extends NBTDocument, Value>(
        value: Value,
        ctx: ClassFieldDecoratorContext<This, Value>
    ) => {
        return function(this: This, initial: Value) {
            if(typeof ctx.name !== "symbol") {
                let fieldMap = this.constructor[NBTCompoundFields] as NBTFieldMap;
                if(!fieldMap[ctx.name])
                    fieldMap[ctx.name] = { type: fieldType };
                fieldMap[ctx.name].type = fieldType;
            }

            return initial as any;
        };
    };
};
