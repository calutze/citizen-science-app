import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text, KeyboardTypeOptions } from 'react-native';
import { Switch, Button, Checkbox, RadioButton, Title, Surface } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

interface FormElement {
  id: number;
  title: string;
  type: string;
  order: number;
  options?: {
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    secure?: boolean;
    multiline?: boolean;
    items?: { label: string; value: string }[];
  };
}

interface FormData {
  form_id: number;
  elements: FormElement[];
}

interface DynamicFormProps {
  formData: FormData;
  onSubmit: (values: { [key: string]: any }) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData, onSubmit }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

  // Handle form value changes
  const handleChange = (elementId: number, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [elementId]: value
    }));
  };

  // Render different form elements based on type
  const renderFormElement = (element: FormElement) => {
    const { id, title, type, options = {} } = element;

    switch (type) {
      case 'TextInput':
        return (
          <View style={styles.inputContainer} key={id}>
            <Text style={styles.label}>{title}</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => handleChange(id, value)}
              value={formValues[id] || ''}
              placeholder={options.placeholder || ''}
              keyboardType={options.keyboardType || 'default'}
              secureTextEntry={options.secure || false}
              multiline={options.multiline || false}
              {...options}
            />
          </View>
        );

      case 'Select':
        return (
          <View style={styles.inputContainer} key={id}>
            <Text style={styles.label}>{title}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formValues[id]}
                onValueChange={(value) => handleChange(id, value)}
                style={styles.picker}
              >
                {options.items?.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        );

      case 'Switch':
        return (
          <View style={styles.switchContainer} key={id}>
            <Text style={styles.label}>{title}</Text>
            <Switch
              value={formValues[id] || false}
              onValueChange={(value) => handleChange(id, value)}
              {...options}
            />
          </View>
        );

      case 'Checkbox':
        return (
            <View style={styles.checkboxContainer} key={id}>
                <Checkbox.Item
                    label={title}
                    status={formValues[id] ? 'checked' : 'unchecked'}
                    onPress={() => handleChange(id, !formValues[id])}
                />
            </View>
        );

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    onSubmit?.(formValues);
    console.log(`Form ID ${formData.form_id} submitted:`, formValues);
  };

  return (
    <ScrollView>
      <Surface style={styles.container}>
        <Title style={styles.title}>Sample Form ID: {formData.form_id}</Title>
        {formData.elements
            .sort((a, b) => a.order - b.order)
            .map(element => renderFormElement(element))}
        
        <Button
            style={styles.submitButton}
            onPress={handleSubmit}
        >
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