"use client"

import { useState, useMemo } from "react"

export interface Column<T> {
  title: string
  field: keyof T | ((row: T) => React.ReactNode)
  type?: "id" | "date" | "custom"
  sortable?: boolean
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  defaultSortField?: keyof T
  defaultSortDirection?: "asc" | "desc"
}

export default function Table<T>({
  columns,
  data,
  keyField,
  defaultSortField,
  defaultSortDirection = "asc",
}: TableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(
    defaultSortField || null
  )
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    defaultSortDirection
  )

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedData = useMemo(() => {
    if (!sortField) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue === null || aValue === undefined)
        return sortDirection === "asc" ? -1 : 1
      if (bValue === null || bValue === undefined)
        return sortDirection === "asc" ? 1 : -1

      // Handle date comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      // Handle number comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [data, sortField, sortDirection])

  const formatValue = (row: T, column: Column<T>, index: number) => {
    if (typeof column.field === "function") {
      return column.field(row)
    }

    if (column.type === "id") {
      return String(index + 1)
    }

    const value = row[column.field]

    if (value === null || value === undefined) {
      return "-"
    }

    if (column.type === "date" && value instanceof Date) {
      return value.toLocaleDateString()
    }

    return String(value)
  }

  return (
    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              scope="col"
              className={`py-3.5 px-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 ${
                column.sortable
                  ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  : ""
              }`}
              onClick={() =>
                column.sortable &&
                typeof column.field !== "function" &&
                handleSort(column.field)
              }
            >
              <div className="flex items-center">
                {column.title}
                {column.sortable &&
                  typeof column.field !== "function" &&
                  sortField === column.field && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
        {sortedData.map((row, rowIndex) => (
          <tr
            key={String(row[keyField])}
            className="hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 dark:text-gray-400"
              >
                {formatValue(row, column, rowIndex)}
              </td>
            ))}
          </tr>
        ))}
        {sortedData.length === 0 && (
          <tr>
            <td
              colSpan={columns.length}
              className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 dark:text-gray-400 text-center"
            >
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
