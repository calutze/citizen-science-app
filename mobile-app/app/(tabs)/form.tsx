import { View, StyleSheet } from 'react-native';
import DynamicForm from '@/components/DynamicForm';

export default function FormScreen() {
  const sampleFormData = {
    form_id: 1,
    description: 'Sample form description',
    project_id: 123,
    fields: [
      {
        field_id: 1,
        field_title: 'Full Name',
        field_type: 'TextInput',
        field_description: 'Enter your full name',
        field_order: 1,
        field_options: null,
        is_required: true
      },
      {
        field_id: 2,
        field_title: 'Sample Secure Input',
        field_type: 'TextInput',
        field_description: 'Enter your secure text',
        field_order: 2,
        field_options: null,
        is_required: true
      }/*,
      {
        field_id: 3,
        field_title: 'Switch',
        field_type: 'Switch',
        field_description: '',
        field_order: 3,
        field_options: null,
        is_required: false
      },
      {
        field_id: 4,
        field_title: 'User Type',
        field_type: 'Select',
        field_description: '',
        field_order: 4,
        field_options: ['Personal', 'Business'],
        is_required: true
      },
      {
        field_id: 6,
        field_title: 'Sample Checkbox',
        field_type: 'Checkbox',
        field_description: '',
        field_order: 6,
        field_options: null,
        is_required: false
      },
      {
        field_id: 7,
        field_title: 'Sample 3',
        field_type: 'TextInput',
        field_description: 'Enter your full name',
        field_order: 7,
        field_options: null,
        is_required: true
      },
      {
        field_id: 8,
        field_title: 'Something',
        field_type: 'TextInput',
        field_description: 'Enter your email',
        field_order: 8,
        field_options: null,
        is_required: true
      },
      {
        field_id: 9,
        field_title: 'Radio Buttons Group',
        field_type: 'RadioButton',
        field_description: '',
        field_order: 9,
        field_options: ['Option 1', 'Option 2', 'Option 3'],
        is_required: true
      }*/
    ]
  };

  // Post formJSON to the backend to create a new form
  async function fetchForm() {
    const formHeader = new Headers();
    formHeader.append('Content-Type', 'application/json');
    const formURL = `https://capstone-deploy-production.up.railway.app/form/6`;
    const formRequest = new Request("https://capstone-deploy-production.up.railway.app/form/", {
      method: 'GET',
      credentials: 'include',
      headers: formHeader
    })

    try {
      const response = await fetch(formRequest);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      else {
        const formData = await response.json();
      }
    }
    catch (error: any) {
      console.error('Error:', error.message);
    }
  }

  function handleSubmit (values: any) {
    console.log("form.tsx", values);

    // Handle form submission here
  };

  return (
    <View style={styles.container}>
      <DynamicForm 
        formData={sampleFormData}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});