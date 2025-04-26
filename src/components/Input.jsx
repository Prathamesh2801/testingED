import React from 'react'

export default function Input({ field, value, onChange }) {
    const getInputType = (sqlType) => {
        if (field.name === 'Profile_Picture') return 'file'
        if (sqlType.includes('varchar')) return 'text'
        if (sqlType.includes('bigint')) return 'number'
        if (sqlType.includes('enum')) return 'select'
        return 'text'
    }

    const getEnumValues = (type) => {
        if (!type.includes('enum')) return []
        return type
            .replace('enum(', '')
            .replace(')', '')
            .split(',')
            .map(val => val.replace(/'/g, '').trim())
    }

    const inputType = getInputType(field.type)
    const enumValues = getEnumValues(field.type)

    const handleFileChange = (e) => {
        onChange({
            target: {
                name: field.name,
                value: e.target.files[0]
            }
        });
    };

    return (
        <div>
            <label htmlFor={field.name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {field.name.replace(/_/g, ' ')}
                {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {inputType === 'file' ? (
                <input
                    type="file"
                    accept="image/*"
                    name={field.name}
                    id={field.name}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    required={field.required}
                />
            ) : inputType === 'select' ? (
                <select
                    name={field.name}
                    id={field.name}
                    value={value || ''}
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required={field.required}
                >
                    <option value="">Select {field.name}</option>
                    {enumValues.map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={inputType}
                    name={field.name}
                    id={field.name}
                    value={value || ''}
                    onChange={onChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={`Enter your ${field.name.toLowerCase()}`}
                    required={field.required}
                />
            )}
        </div>
    )
}
