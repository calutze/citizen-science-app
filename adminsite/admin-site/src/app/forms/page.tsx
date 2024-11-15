'use client';

import React, { useState } from "react";
import { Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';

interface FormField {
  form_id: number;
  form_title: string;
  elements: FormElement[];
}
interface FormElement {
  id: number;
  title: string;
  type: string;
  order: number;
  options?: {
    placeholder?: string;
    //keyboardType?: boolean;
    secure?: boolean;
    multiline?: boolean;
    items?: [];
  };
}

export default function Page() {
  const [formFields, setFormFields] = useState<FormElement[]>([]);
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
        id: formFields.length + 1,
        title: `Field ${formFields.length + 1}`,
        type: 'TextInput',
        order: formFields.length + 1,
        options: {
          placeholder: 'Enter text here',
          items: []
        }
      }
    ]);
  }

  function generateJSON() {
    const template = {
      form_id: 1, //need to get this id from the backend?
      form_title: formTitle,
      elements: formFields.map(field => ({
        ...field,
      }))
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
        <div key={field.id}>
          {/*Title, move and delete buttons*/}
          <h3>Field {index + 1}</h3>
          <button><MoveUp /></button>
          <button><MoveDown /></button>
          <button><Trash2 /></button>
          {/*Type of field*/}
          <div>
            <label>Type</label>
            <select
              value={field.type}>
                {fieldTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
            </select>
          </div>
          {/*Field Title*/}
          <div>
            <label>Label</label>
            <input 
              value={field.title}
              placeholder="Field label"/>
          </div>
          {/*Field Placeholder*/}
          <div>
            <label>Placeholder</label>
            <input 
              value={field.options?.placeholder || ''}
              placeholder="Field placeholder"/>
          </div>
          {/*Options for Select, Radio, Checkbox, only displays if those types*/}
          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <div>
            <label>Options (comma-separated)</label>
            <input 
              value={field.options?.items?.join(', ') || ''}
              placeholder="Option 1, Option 2, Option 3"/>
          </div>)}
        </div>
      ))}
      <button onClick={addField}>
        <Plus />Add Field</button>
      <button 
        onClick={generateJSON}
        className="btn btn-primary"
        >Generate Form</button>
    </div>
  )
};
