import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from "react-native";
import { theme } from "./color";

export default function App() {
	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<View style={styles.header}>
				<TouchableOpacity activeOpacity={0}>
					<Text style={styles.btnText}>일하고</Text>
				</TouchableOpacity>
				<TouchableHighlight
					underlayColor="#ddd"
					activeOpacity={0}
					onPress={() => {
						console.log("pressed");
					}}
				>
					<Text style={styles.btnText}>여행하고</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.bg,
		paddingHorizontal: 20,
	},
	header: {
		justifyContent: "space-between",
		flexDirection: "row",
		marginTop: 100,
	},
	btnText: {
		fontSize: 35,
		// color: theme.gray,
		color: "white",
		fontWeight: "600",
	},
});
