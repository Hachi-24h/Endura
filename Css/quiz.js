import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // flexGrow: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  center: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    marginBottom: 16,
    alignItems: "center",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 16,
    color: "#444",
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
  },
  retryText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default styles;