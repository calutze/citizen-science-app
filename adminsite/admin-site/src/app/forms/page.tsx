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
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formJSON, setFormJSON] = useState('');

  function generateJSON() {
    const template = {
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
      <button 
        onClick={generateJSON}
        className="btn btn-primary"
        >Generate Form</button>
    </div>
  )
};
