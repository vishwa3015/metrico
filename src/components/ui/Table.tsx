type Column<T> = {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

const Table = <T,>({ columns, data, emptyMessage = 'No data available' }: TableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            {columns.map(col => (
              <th
                key={String(col.key)}
                className="px-5 py-3 font-semibold text-gray-600 uppercase tracking-wide text-xs"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                {columns.map(col => (
                  <td key={String(col.key)} className="px-5 py-3.5 text-gray-700">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
