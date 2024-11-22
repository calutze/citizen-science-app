import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text, KeyboardTypeOptions } from 'react-native';
import { Switch, Button, Checkbox, RadioButton, Title, Surface } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

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
  created_by?: string;
  project_id: number;
  fields: FormField[];
}

interface DynamicFormProps {
  formData: FormData;
  onSubmit: (values: { [key: string]: any }) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData , onSubmit }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
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
    const { field_id, field_title, field_type, field_options, is_required, form, field_order, field_description } = field;  

    switch (field_type) {
      case 'TextInput':
        return (
          <View style={styles.inputContainer} key={field_id}>
            <Text style={styles.label}>{field_title}</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => handleChange(field_id, value)}
              value={formValues[field_id] || ''}
              placeholder={field_description || ''}
              multiline={false}
            />
          </View>
        );

      case 'Select':
        return (
          <View style={styles.inputContainer} key={field_id}>
            <Text style={styles.label}>{field_title}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formValues[field_id]}
                onValueChange={(value) => handleChange(field_id, value)}
                style={styles.picker}
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
          <View style={styles.switchContainer} key={field_id}>
            <Text style={styles.label}>{field_title}</Text>
            <Switch
              value={formValues[field_id] || false}
              onValueChange={(value) => handleChange(field_id, value)}
            />
          </View>
        );

      case 'Checkbox':
        return (
            <View style={styles.checkboxContainer} key={field_id}>
                <Checkbox.Item
                    label={field_title}
                    status={formValues[field_id] ? 'checked' : 'unchecked'}
                    onPress={() => handleChange(field_id, !formValues[field_id])}
                />
            </View>
        );

      case 'RadioButton':
        return (
          <View style={styles.radioButtonContainer} key={field_id}>
            <Text style={styles.label}>{field_title}</Text>
            <RadioButton.Group onValueChange={newValue => handleChange(field_id, newValue)} value={formValues[field_id]}>
              {field_options && field_options.map(item => (
                <View key={item}>
                  <Text style={styles.radioLabel}>{item}<RadioButton value={item} /></Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        )

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    onSubmit(formValues);
    console.log(`Form ID ${formData.form_id} submitted:`, formValues);
  };

  return (
    <ScrollView>
      <Surface style={styles.container}>
        <Title style={styles.title}>Sample Form ID: {formData.form_id}</Title>
        {formData.fields.sort(
            (a, b) => a.field_order - b.field_order
          ).map(element => renderFormElement(element))}
        
        <Button
            style={styles.submitButton}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  radioButtonContainer: {
    justifyContent: 'center',
  },
  radioLabel: {
    fontSize: 14,
    justifyContent: 'center'
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DynamicForm;