import { XMarkIcon } from "@heroicons/react/24/outline"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  isDeleting: boolean
  onConfirm: () => Promise<void>
  onCancel: () => void
  error?: string | null
}

export default function DeleteConfirmationModal({
  isOpen,
  title,
  message,
  isDeleting,
  onConfirm,
  onCancel,
  error,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 backdrop-brightness-50 transition-opacity"
          onClick={onCancel}
        ></div>

        <div className="relative z-10 w-full max-w-xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:text-red-200 dark:border-red-700">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm()}
              disabled={isDeleting}
              className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <span className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
