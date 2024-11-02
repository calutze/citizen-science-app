import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Checkbox, RadioButton, Title, Surface } from 'react-native-paper';

const sample_form_data = {form_id: 1,
    elements: [{'id': 1,
    'title': 'Text Input',
    'type': 'TextInput',
    'options': {placeholder: 'Enter your text here'},
    'order': 1}]
}

const ObservationForm = () => {
  const [formData, setFormData] = useState({
    textInput: '',
    checkbox: false,
    radioButtons: 'email'
  });

  function handleSubmit() {
      // Handle form submission here
      // Replace this with connection to back end when ready
      console.log('Form submitted:', formData);
    }

  return (
    <ScrollView>
      <Surface style={styles.container}>
        <Title style={styles.title}>Sample Form</Title>

        <TextInput
          label="Static Text Input"
          value={formData.textInput}
          onChangeText={(text) => setFormData({ ...formData, textInput: text })}
          mode="outlined"
          style={styles.textInput}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox.Item
            label="Checkbox"
            status={formData.checkbox ? 'checked' : 'unchecked'}
            onPress={() => setFormData({ ...formData, checkbox: !formData.checkbox })}
          />
        </View>

        <Title style={styles.subtitle}>Sample Radio Group</Title>
        <RadioButton.Group
          value={formData.radioButtons}
          onValueChange={(value) => setFormData({ ...formData, radioButtons: value })}
        >
          <RadioButton.Item label="Email" value="email" />
          <RadioButton.Item label="Phone" value="phone" />
        </RadioButton.Group>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Submit
        </Button>
      </Surface>
    </ScrollView>
  );
};
  
const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 20,
    marginTop: 40
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10
  },
  textInput: {
    marginBottom: 10
  },
  checkboxContainer: {
    marginVertical: 10
  },
  button: {
    marginTop: 20
  },
});

export default ObservationForm;