import type { Convert } from "../../../../entities/convert/model/types"

interface Props {
    convert: Convert
}

export const ConvertCard = ({ convert }: Props) => {
    const typeCode = convert.type_code

    switch (typeCode) {
        case 'important':
            return <ImportantCard/>
    }
}