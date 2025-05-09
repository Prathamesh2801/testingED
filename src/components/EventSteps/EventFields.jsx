import React, { useState } from 'react'

function EnumModal({ isOpen, onClose, onSubmit }) {
    const [optionValue, setOptionValue] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (optionValue.trim()) {
            onSubmit(optionValue.trim())
            setOptionValue('')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-medium mb-4">Add Enum Option</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={optionValue}
                        onChange={(e) => setOptionValue(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Enter option value"
                        autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function EventFields({ onSubmit, onPrevious, initialData = [] }) {
    const [fields, setFields] = useState(() => {
        if (initialData.length > 0) {
            return initialData.map(field => ({
                ...field,
                enumValues: field.enumValues || []
            }))
        } else {
            // Default one field if initialData is empty
            return [{
                name: '',
                type: 'varchar',
                length: '',
                required: false,
                unique: false,
                enumValues: []
            }]
        }
    })
    const [modalOpen, setModalOpen] = useState(false)
    const [activeFieldIndex, setActiveFieldIndex] = useState(null)

    const handleAddField = () => {
        setFields([...fields, {
            name: '',
            type: 'varchar',
            length: '',
            required: false,
            unique: false,
            enumValues: [],
            allowedFileTypes: []
        }])
    }

    const handleFieldChange = (index, field) => {
        const newFields = [...fields]
        newFields[index] = field
        setFields(newFields)
    }

    const handleAddEnumValue = (index) => {
        setActiveFieldIndex(index)
        setModalOpen(true)
    }

    const handleEnumModalSubmit = (value) => {
        const newFields = [...fields]
        newFields[activeFieldIndex] = {
            ...newFields[activeFieldIndex],
            enumValues: [...newFields[activeFieldIndex].enumValues, value]
        }
        setFields(newFields)
        setModalOpen(false)
    }

    const handleDeleteEnumValue = (fieldIndex, valueIndex) => {
        const newFields = [...fields];
        newFields[fieldIndex] = {
            ...newFields[fieldIndex],
            enumValues: newFields[fieldIndex].enumValues.filter((_, index) => index !== valueIndex)
        };
        setFields(newFields);
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(fields)
    }

    return (
        <div className="max-w-5xl mx-auto">
            <EnumModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleEnumModalSubmit}
            />
            <form onSubmit={handleSubmit} >
                <div className="mb-6 ">
                    {/* Changed div to add flex and justify-end */}
                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={handleAddField}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Add Field
                        </button>
                    </div>
                    
                    {/* Rest of your existing code */}
                    {fields.map((field, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg ">
                            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4  gap-1 md:gap-8">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-600">
                                        Field Name
                                    </label>
                                    <input
                                        type="text"
                                        value={field.name}
                                        onChange={(e) => handleFieldChange(index, { ...field, name: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-600">
                                        Type
                                    </label>
                                    <select
                                        value={field.type}
                                        onChange={(e) => handleFieldChange(index, {
                                            ...field,
                                            type: e.target.value,
                                            enumValues: e.target.value === 'enum' ? [] : field.enumValues,
                                            allowedFileTypes: e.target.value === 'file' ? [] : []
                                        })}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="varchar">VARCHAR</option>
                                        <option value="int">INT</option>
                                        <option value="enum">ENUM</option>
                                        <option value="file">FILE</option>
                                    </select>
                                </div>

                                {field.type === 'enum' ? (
                                    // --- ENUM BLOCK ---
                                    <div className="flex flex-col">
                                        <label className="block mb-2 text-sm font-medium text-gray-600">
                                            Enum Values
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                className="w-full p-2 border rounded"
                                                value=""
                                                onChange={() => { }}
                                            >
                                                <option value="" disabled>
                                                    {field.enumValues.length > 0
                                                        ? `${field.enumValues.length} option(s)`
                                                        : "No options yet"}
                                                </option>
                                                {field.enumValues.map((value, i) => (
                                                    <option key={i} value={value}>
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => handleAddEnumValue(index)}
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {field.enumValues.length === 0 && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                Click + to add options
                                            </p>
                                        )}

                                        {field.enumValues.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {field.enumValues.map((value, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
                                                    >
                                                        {value}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteEnumValue(index, i)}
                                                            className="ml-1 text-gray-400 hover:text-red-500"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : field.type === 'file' ? (
                                    // --- FILE BLOCK ---
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-600">
                                            Allowed File Types
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {['png', 'jpg', 'jpeg', 'pdf'].map((fileType) => (
                                                <label key={fileType} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.allowedFileTypes?.includes(fileType)}
                                                        onChange={(e) => {
                                                            const newAllowed = e.target.checked
                                                                ? [...(field.allowedFileTypes || []), fileType]
                                                                : (field.allowedFileTypes || []).filter(type => type !== fileType)
                                                            handleFieldChange(index, {
                                                                ...field,
                                                                allowedFileTypes: newAllowed
                                                            })
                                                        }}
                                                    />
                                                    <span className="text-sm">{fileType.toUpperCase()}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // --- LENGTH FIELD (default) ---
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-600">
                                            Length
                                        </label>
                                        <input
                                            type="number"
                                            value={field.length}
                                            onChange={(e) => handleFieldChange(index, {
                                                ...field,
                                                length: e.target.value
                                            })}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => handleFieldChange(index, {
                                                ...field,
                                                required: e.target.checked
                                            })}
                                            className="mr-2"
                                        />
                                        Required
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={field.unique}
                                            onChange={(e) => handleFieldChange(index, {
                                                ...field,
                                                unique: e.target.checked
                                            })}
                                            className="mr-2"
                                        />
                                        Unique
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EventFields