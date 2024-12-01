'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import { Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';
import "./styles.css";
import { API_URL } from '@/constants/api';

// Type definition for FormField, matches backend Model
interface FormField {
  field_id?: number;
  field_title: string;
  field_type: string;
  field_description: string;
  field_order: number;
  is_required: boolean;
  form?: number;
  field_options: string[] | null;
}

// Type defintion for FromTemplate, matches backend Model
interface FormTemplate {
  form_id?: number;
  created_at?: string;
  description: string;
  created_by?: string;
  project_id: number;
  fields: FormField[];
}

export default function Page() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const router = useRouter()
  const searchParams = useSearchParams();
  const selected_project = Number(searchParams.get('project_id'));
  const isExistingForm: Boolean = (searchParams.get('edit') === 'true');

  const fieldTypes = [
    'text',
    'select',
    'radio',
    'checkbox',
  ]
  
  //Check if existing form for this project id exists
  async function getForm() {
    // make header
    const formHeader = new Headers();
    formHeader.append("Content-Type", "application/json");

    // create request
    const formRequest = new Request(`${API_URL}/form/` + selected_project,{
        method: "GET",
        credentials: "include",
        headers: formHeader
    })

    // grab the form
    try {
        const formResponse = await fetch(formRequest)
        if (!formResponse.ok) {
          if (formResponse.status === 404) {
            console.log('No form found for this project')
          } else {
            throw new Error(`Response status: ${formResponse.status}}`)
          }
        } else {
            // load form data into FormFields for display
            const form_data = await formResponse.json();
            form_data.fields.sort((a: FormField, b: FormField) => a.field_order - b.field_order);
            setFormFields(form_data.fields)
        }
    } catch (error: any) {
        console.error(error.message)
    }
  }

  if (isExistingForm) {
    useEffect(() => {getForm()}, []);
  }

  // Add a new field to the form builder
  function addField() {
    setFormFields([
      ...formFields,
      {
        field_title: '',
        field_type: 'text',
        field_description: '',
        field_options: null,
        field_order: formFields.length + 1,
        is_required: true,
      }
    ]);
  }

  // Update form field value(s) in the form builder
  function updateField(index: number, key: keyof FormField, value: FormField[keyof FormField]) {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFormFields(newFields);
  }

  // Delete a field from the form builder
  function removeField(index: number) {
    const newFields = [...formFields];
    newFields.splice(index, 1);
    setFormFields(newFields);
  };

  // Move a field up or down in the form builder
  const moveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
          (direction === 'down' && index === formFields.length -1)) 
       return
    const newFields = [...formFields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap the two fields
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];

    // Update the field_order properties
    newFields[index].field_order = index;
    newFields[newIndex].field_order = newIndex;
    setFormFields(newFields);
  };

  // Post formJSON to the backend to create a new form
  async function submitForm() {
    const formHeader = new Headers();
    formHeader.append('Content-Type', 'application/json');

    const new_form: FormTemplate = {
        project_id: selected_project,
        description: formTitle,
        fields: formFields
    }

    const edit_form = {
      description: formTitle,
      fields: formFields.map(({ field_id, field_description, field_options, field_order, field_title, field_type, is_required }) => ({
        field_id,
        field_description,
        field_options,
        field_order,
        field_title,
        field_type,
        is_required
      }))
    }

    let formRequest: Request;
    if (isExistingForm) {
      formRequest = new Request(`${API_URL}/update-form/${selected_project}`, {
        method: 'PUT',
        credentials: 'include',
        headers: formHeader,
        body: JSON.stringify(edit_form, null, 2)
    })
    } else {
      formRequest = new Request(`${API_URL}/add-form`, {
        method: 'POST',
        credentials: 'include',
        headers: formHeader,
        body: JSON.stringify(new_form, null, 2)
    })}

    try {
      const response = await fetch(formRequest);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      else {
        console.log('Form submitted successfully');
        router.push('/account')
      }
    }
    catch (error: any) {
      console.error('Error:', error.message);
    }
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
      
      {/*Dynamically display form field editing sections*/}
      {formFields.map((field, index) => (
        <div key={index} className="field-container">
          {/*Title, move and delete buttons*/}
          <h3>Field {index + 1}</h3>
          <div className="field-actions">
          <button onClick={() => moveField(index, 'up')}>
            <MoveUp /></button>
          <button onClick={() => moveField(index, 'down')}>
            <MoveDown /></button>
          <button onClick={() => removeField(index)}>
            <Trash2 /></button>
          </div>

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
            <label>Field Label</label>
            <input 
              value={field.field_title}
              placeholder="Enter field label"
              onChange={(e) => updateField(index, 'field_title', e.target.value)}/>
          </div>
          {/*Field Description*/}
          <div>
            <label>Description</label>
            <input 
              value={field.field_description}
              placeholder="Enter field description"
              onChange={(e) => updateField(index, 'field_description', e.target.value)}/>
          </div>
          {/*Required Checkbox*/}
          <div>
            <label>Required</label>
            <input 
              type="checkbox"
              checked={field.is_required}
              onChange={(e) => updateField(index, 'is_required', e.target.checked)}/>
          </div>
          {/*Options for Select, Radio, Checkbox, only displays if those types*/}
          {(field.field_type === 'select' || field.field_type === 'radio') && (
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
          <Plus /> Add Field</button>
      </div>
      <div>
        <button 
          onClick={submitForm}
          >Generate Form</button>
      </div>
    </div>
  )
};
