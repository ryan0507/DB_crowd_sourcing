import * as React from 'react'


interface Props {
    valueName: string
    valueType: string
    onRemove(): void
    onUpdate(): void
}

const TableSchemaItem: React.SFC<Props> = ({
    valueName,
    valueType,
    onRemove,
    onUpdate,
}) => (
    <div className="schemaValue">
        {valueName}
        {valueType}
        <span className="delete" onClick={onRemove}>
            [삭제]
        </span>

        {/* <span
            className="update"
            style={{ color: 'blue' }}
            onClick={{ onUpdate }}
        >
            [update]
        </span> */}
    </div>
)

export default TableSchemaItem