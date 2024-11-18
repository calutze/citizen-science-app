'use client';

import React, { useState } from "react";
import { Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';

// Type definition for FormField, matches backend Model
interface FormField {
  field_id: number;
  field_title: string;
  field_type: string;
  field_description: string;
  field_order: number;
  is_required: boolean;
  form: number;
  field_options: string[];
}

// Type defintion for FromTemplate, matches backend Model
interface FormTemplate {
  form_id: number;
  created_at?: string;
  description: string;
  created_by?: string;
  project_id?: number;
  fields: FormField[];
}

export default function Page() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formJSON, setFormJSON] = useState('');

  const fieldTypes = [
    'text',
    'select',
    'radio',
    'checkbox',
  ]

  function addField() {
    setFormFields([
      ...formFields,
      {
        field_id: formFields.length + 1,
        field_title: `Field ${formFields.length + 1}`,
        field_type: 'TextInput',
        field_order: formFields.length + 1,
        field_description: '',
        field_options: [],
        is_required: false,
        form: 0, // TODO get the current form number from backend
      }
    ]);
  }

  function updateField(index: number, key: keyof FormField, value: FormField[keyof FormField]) {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFormFields(newFields);
  }

  function removeField(index: number) {
    const newFields = [...formFields];
    newFields.splice(index, 1);
    setFormFields(newFields);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
          (direction === 'down' && index === formFields.length -1)) 
       return;

    const newFields = [...formFields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const movingField = newFields[index];
    newFields[index] = newFields[newIndex];
    newFields[newIndex] = movingField;
    setFormFields(newFields);
  };

  function generateJSON() {
    const template: FormTemplate = {
      form_id: 1, //TODO need to get this id from the backend?
      description: formTitle,
      fields: formFields
    }
    setFormJSON(JSON.stringify(template, null, 2));
    console.log(formJSON);
  }

  return (
    <div className="form-builder">
      <h1>Form Builder</h1>
      <div>
        <label>Form Title</label>
        <input 
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Enter Form Title"
          />
      </div>
      {formFields.map((field, index) => (
        <div key={field.field_id}>
          {/*Title, move and delete buttons*/}
          <h3>Field {index + 1}</h3>
          <button onClick={() => moveField(index, 'up')}>
            <MoveUp /></button>
          <button onClick={() => moveField(index, 'down')}>
            <MoveDown /></button>
          <button onClick={() => removeField(index)}>
            <Trash2 /></button>
          {/*Type of field*/}
          <div>
            <label>Type</label>
            <select
              value={field.field_type}
              onChange={(e) => updateField(index, 'field_type', e.target.value)}>
                {fieldTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
            </select>
          </div>
          {/*Field Title*/}
          <div>
            <label>Label</label>
            <input 
              value={field.field_title}
              placeholder="Field label"
              onChange={(e) => updateField(index, 'field_title', e.target.value)}/>
          </div>
          {/*Field Placeholder*/}
          <div>
            <label>Placeholder</label>
            <input 
              value={field.field_description}
              placeholder="Field placeholder"
              onChange={(e) => updateField(index, 'field_description', e.target.value)}/>
          </div>
          <div>
            <label>Required</label>
            <input 
              type="checkbox"
              checked={field.is_required}
              onChange={(e) => updateField(index, 'is_required', e.target.checked)}/>
          </div>
          {/*Options for Select, Radio, Checkbox, only displays if those types*/}
          {(field.field_type === 'select' || field.field_type === 'radio' || field.field_type === 'checkbox') && (
          <div>
            <label>Options (comma-separated)</label>
            <input 
              value={field.field_options?.join(', ') || ''}
              placeholder="Option 1, Option 2, Option 3"
              onChange={(e) => updateField(index, 'field_options', e.target.value.split(', '))}/>
          </div>)}
        </div>
      ))}
      <div>
        <button onClick={addField}>
          <Plus />Add Field</button>
      </div>
      <div>
        <button 
          onClick={generateJSON}
          >Generate Form</button>
      </div>
    </div>
  )
};
