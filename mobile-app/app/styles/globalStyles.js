import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    error: {
      color: "#993323",
      fontSize: 18,
      fontWeight: "bold",
    },
    homeContainer: {
        flex: 1,
        backgroundColor: "#dcd5be",
        minHeight: "100%",
        alignItems: "center",
        display: "flex",
        gap: 12,
        padding: 0,
    },

    headerContainer: {
        backgroundColor: "#a368eb",
        width: "100%",
        alignItems: "center",
      },

    projectContainer: {
        backgroundColor: "#dcd5be",
        minHeight: "100%",
        alignItems: "center",
        display: "flex",
        gap: 12,
    },

    container: {
        flex: 1,
        padding: 0,
        backgroundColor: "#dcd5be",
        elevation: 0,
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },

    keyboardAvoidingView: {
        flex: 1,
        width: "90%",
        paddingBottom: 80, 

    },

    scrollContainer: {
        flexGrow: 1,
        backgroundColor: "#dcd5be",
        paddingBottom: 80, 
        width: "100%"
    },

    listContainer: {
        width: "90%",
        alignSelf: "center",
        marginTop: 20,
    },

    header: {
      backgroundColor: "#a368eb",
      fontSize: 36,
      color: "#ffffff",
      textAlign: "center",
      width: "100%",
      padding: 10,
      paddingBottom: 12,
    },
    title: {
      fontSize: 26,
      marginTop: 24,
      textAlign: "center",
  
    },
    projectHeadline: {
        fontWeight: "bold",
        fontSize: 26, 
        maxWidth: "90%",
        textAlign: "left",
        paddingLeft: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    projectTitle: {
        fontWeight: "bold",
        marginTop: 20,
        fontSize: 22, 
        maxWidth: "90%",
        textAlign: "left",
        paddingLeft: 20,
        marginBottom: 10,
    },
    projectText: {
        fontSize: 18, 
        textAlign: "left",
        maxWidth: "90%",
        lineHeight: 24,
        paddingLeft: 20
    },

    projectSubhead: {
        fontWeight: "bold",
        marginTop: 24,
        fontSize: 20, 
        maxWidth: "90%",
        textAlign: "left",
        paddingLeft: 20,
        marginBottom: 10,
    },

    explanation: {
        fontSize: 14, 
        textAlign: "left",
        maxWidth: "90%",
        lineHeight: 24,
        marginTop: 20,
        paddingLeft: 20,
        paddingBottom: 40,
    },
    main: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 10,
      fontSize: 30,
      gap: 10,
    },
    subHead: {
      fontWeight: "bold",
      fontSize: 24,
      marginTop: 20,
    },
    input: {
      height: 50,
      margin: 10,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      maxWidth: 300,
      width: "100%",
      backgroundColor: "#ffffff",
      textAlign: "center",
      fontSize: 18,
    },
    image: {
      width: "100%",
      minWidth: 0,
      maxWidth: "90%",
      maxHeight: 320,
      marginTop: 20
    },
    button: {
      backgroundColor: "#a368eb",
      paddingVertical: 14, 
      paddingHorizontal: 26,
      borderRadius: 4,
      marginTop: 10,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 22, 
      fontWeight: "500", 
      textAlign: "center",
    },

    observationTitle: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'left'
    },

    listContainer: {
        width: "90%",
        alignSelf: "center",
        marginTop: 20,
    },

    inputContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        marginTop: 20,
        marginBottom: 6,
        textAlign: 'left'
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        fontWeight: '500',
    },
    textInput: {
        backgroundColor: "#ffffff",
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
        backgroundColor: '#ffffff',
        padding: 8,
        marginBottom: 16,
    },
    picker: {
        height: 50,
        fontSize: 16,
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
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#ffffff',
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
        fontSize: 1,
        color: '#333',
        marginLeft: 8,
    },
    radioButtonContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#ffffff',
    },
    radioLabel: {
        fontSize: 1,
        marginBottom: 8,
        color: '#333',
    },
    radioChoice: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    radioText: {
        fontSize: 16,
        marginLeft: 8,
        color: '#333',
    },
    submitButton: {
        backgroundColor: "#a368eb",
        padding: 12,
        borderRadius: 4,
        alignItems: "center",
        marginTop: 16,
        alignSelf: "center",
        
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    cardText: {
        fontSize: 16,
        marginBottom: 4,
        color: "#3e3e3e",
    },
    });
      
  export default globalStyles;
