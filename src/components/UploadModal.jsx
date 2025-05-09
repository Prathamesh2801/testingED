'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function UploadModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    // Check if file is selected
    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ]

    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload only Excel files (.xlsx, .xls, .csv)')
      return
    }

    setFile(selectedFile)
    setError('')
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    try {
      // Here you will add the API call to upload the file
      console.log('File ready for upload:', file)
      // Reset state after successful upload
      setFile(null)
      onClose()
    } catch (err) {
      setError('Error uploading file. Please try again.')
      console.error('Upload error:', err)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <DocumentArrowUpIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Upload User Data
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please upload an Excel file (.xlsx, .xls, .csv) containing user data
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                {file && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                onClick={handleUpload}
              >
                Upload
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
