export default function CustomerTableSkeleton() {
  return (
    <div className="rounded-md border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 py-3.5 px-3 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-6 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="border-b border-gray-200 dark:border-gray-700 last:border-0 py-4 px-3"
            >
              <div className="grid grid-cols-6 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
                    ></div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
