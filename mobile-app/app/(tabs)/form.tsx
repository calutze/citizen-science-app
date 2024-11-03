import { View, StyleSheet } from 'react-native';
import DynamicForm from '@/components/DynamicForm';

export default function FormScreen() {
  const sampleFormData = {
    form_id: 1,
    elements: [
      {
        id: 1,
        title: 'Full Name',
        type: 'TextInput',
        options: {
          placeholder: 'Enter your full name'
        },
        order: 1
      },
      {
        id: 2,
        title: 'Sample Secure Input',
        type: 'TextInput',
        options: {
          placeholder: 'Enter your secure text',
          secureTextEntry: true
        },
        order: 2
      },
      {
        id: 3,
        title: 'Notifications',
        type: 'Switch',
        order: 3
      },
      {
        id: 4,
        title: 'User Type',
        type: 'Select',
        options: {
          items: [
            { label: 'Personal', value: 'personal' },
            { label: 'Business', value: 'business' }
          ]
        },
        order: 4
      },
      {
        id: 6,
        title: 'Sample Checkbox',
        type: 'Checkbox',
        options: {
          status: 'unchecked'
        },
        order: 6
      },
      {
        id: 7,
        title: 'Sample 3',
        type: 'TextInput',
        options: {
          placeholder: 'Enter your full name',
          multiline: true
        },
        order: 7
      },
      {
        id: 8,
        title: 'Something',
        type: 'TextInput',
        options: {
          placeholder: 'Enter your email',
          keyboardType: 'email-address'
        },
        order: 8
      },
    ]
  };

  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
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