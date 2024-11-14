'use client';

import React, { useState } from "react";

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
    items?: { label: string; value: string }[];
  };
}

export default function Page() {
  const [formFields, setFormFields] = useState<FormElement[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formJSON, setFormJSON] = useState('');

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
      <button onClick={addField}>Add Field</button>
      <button 
        onClick={generateJSON}
        className="btn btn-primary"
        >Generate Form</button>
    </div>
  )
};
