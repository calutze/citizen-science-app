import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
        
    },
    header: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        marginBottom: 20,
    },
    subHead: {
        fontWeight: "bold",
        fontSize: 24,
        marginBottom: 5,
        marginTop: 20,
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#6200ee",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "80%",
        borderWidth: 2,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
    },
    image: {
        width: "100%",
        minWidth: 0,
        maxWidth: 250,
        maxHeight: 250,
        marginTop: 20
    },
});

export default globalStyles;
