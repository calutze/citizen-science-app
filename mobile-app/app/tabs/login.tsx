import React, { useState } from 'react';
import { Text, View, TextInput, Button, SafeAreaView } from "react-native";

export default function Login() {
  const [project, setProject] = useState('Project')

  function formSubmit() {
    if (project.length > 0 && project != 'Project'){
      let data_to_send = {
        project_code: project
      }

      // Replace this with connection to back end when ready
      console.log(data_to_send)
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login</Text>

      <Text>Project Code:</Text>
      <TextInput
        value={project}
        onChangeText={setProject}
        style={{
          borderColor: 'gray',
          borderWidth: 1
        }}
      />
      <Button
        title="Submit"
        onPress={formSubmit}
      />
    </View>
  );
}