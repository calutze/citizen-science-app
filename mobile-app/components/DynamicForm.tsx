import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text, Alert, Button } from 'react-native';
import { Switch, Checkbox, RadioButton, Title, Surface } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { routeToScreen } from 'expo-router/build/useScreens';

import { KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

import globalStyles from "../app/styles/globalStyles";

interface FormField {
  field_id: number;
  field_title: string;
  field_type: string;
  field_description: string;
  field_order: number;
  field_options: string[] | null;
  is_required: boolean;
  form?: number;
}

interface FormData {
  form_id: number;
  created_at?: string;
  description: string;
  created_by?: number;
  fields: FormField[];
}

interface DynamicFormProps {
  formData: FormData;
  onSubmit: (values: { [key: string]: any }) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData , onSubmit }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string | boolean | null }>(
    formData.fields.reduce((acc, field) => {
      acc[field.field_id] = field.field_type === 'checkbox' ? false : '';
      return acc;
    }, {} as { [key: string]: string | boolean | null })
  );
  const submitRef = useRef(onSubmit);

  useEffect(() => {
    submitRef.current = onSubmit;
  }, [onSubmit]);

  // Handle form value changes
  const handleChange = (elementId: number, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [elementId]: value
    }));
  };

  // Render different form elements based on type
  const renderFormElement = (field: FormField) => {
    //descructure the field object
    const { field_id, field_title, field_type, field_options, is_required, form, field_order, field_description } = field;  

    switch (field_type) {
      case 'text':
        return (
          <View style={globalStyles.inputContainer} key={field_id}>
            <Text style={globalStyles.label}>{field_title}</Text>
            <TextInput
              style={globalStyles.textInput}
              onChangeText={(value) => handleChange(field_id, value)}
              value={typeof formValues[field_id] === 'string' ? formValues[field_id] : ''}
              placeholder={field_description}
              multiline={true}
            />
          </View>
        );

      case 'select':
        return (
          <View style={globalStyles.inputContainer} key={field_id}>
            <Text style={globalStyles.label}>{field_title}</Text>
            <View style={globalStyles.pickerContainer}>
              <Picker
                selectedValue={formValues[field_id]}
                onValueChange={(value) => handleChange(field_id, value)}
                style={globalStyles.picker}
              >
                {field_options && field_options.map((item) => (
                  <Picker.Item
                    key={item}
                    label={item}
                    value={item}
                  />
                ))}
              </Picker>
            </View>
          </View>
        );

      case 'Switch':
        return (
          <View style={globalStyles.switchContainer} key={field_id}>
            <Text style={globalStyles.label}>{field_title}</Text>
            <Switch
              value={typeof formValues[field_id] === 'boolean' ? formValues[field_id] : false}
              onValueChange={(value) => handleChange(field_id, value)}
            />
          </View>
        );

      case 'checkbox':
        return (
            <View style={globalStyles.checkboxContainer} key={field_id}>
                <Checkbox.Item
                    label={field_title}
                    status={formValues[field_id] ? 'checked' : 'unchecked'}
                    onPress={() => handleChange(field_id, !formValues[field_id])}
                />
            </View>
        );

      case 'radio':
        return (
          <View style={globalStyles.radioButtonContainer} key={field_id}>
            <Text style={globalStyles.label}>{field_title}</Text>
            <RadioButton.Group 
              onValueChange={newValue => handleChange(field_id, newValue)} 
              value={typeof formValues[field_id] === 'string' ? formValues[field_id] : ''}
            >
              {field_options && field_options.map(item => (
                <View style={globalStyles.radioChoice} key={item}>
                  <RadioButton value={item} color="#a368eb" />
                  <Text style={globalStyles.radioText}>{item}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        )

      default:
        return null;
    }
  };

  function handleSubmit() {
    const submit_data = {
      project_id: formData.form_id,
      student_identifier: null,
      image_url: null,
      observation_values: formData.fields.map(specific_field => ({
        field: specific_field.field_id,
        value: formValues[specific_field.field_id],
      })),
    };
    onSubmit(submit_data);
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={globalStyles.keyboardAvoidingView}
    >

      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Surface style={globalStyles.container}>
          <Title style={globalStyles.observationTitle}>{formData.description}</Title>
          {formData.fields.sort(
              (a, b) => a.field_order - b.field_order
            ).map(field => renderFormElement(field))}

        <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
          <Text style={globalStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
        
        </Surface>
      </ScrollView>

  </KeyboardAvoidingView>
  );
};

export default DynamicForm;