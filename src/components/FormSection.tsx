import React from 'react';

interface FieldOption {
  value: number;
  label: string;
}

interface Field {
  name: string;
  label: string;
  type: string;
  min?: number;
  max?: number;
  step?: string;
  options?: FieldOption[];
}

interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  fields: Field[];
  formData: {
    [key: string]: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, fields, formData, onChange }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center">
        <div className="mr-2">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] !== undefined ? formData[field.name] : ''}
                onChange={onChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white border p-2"
              >
                <option value="">Select...</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] !== undefined ? formData[field.name] : ''}
                onChange={onChange}
                min={field.min}
                max={field.max}
                step={field.step}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormSection;