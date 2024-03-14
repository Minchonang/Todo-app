import { StatusBar } from "expo-status-bar";
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./color";
import { useEffect, useState } from "react";

export default function App() {
	const [text, setText] = useState("");
	const [working, setWorking] = useState(true);
	const [toDos, setToDos] = useState({}); // object

	const STORAGE_KEY = "@toDos";

	const travel = () => {
		setWorking(false);
	};
	const work = () => {
		setWorking(true);
	};

	const onChangeText = (e) => {
		setText(e);
	};
	const addTodo = async () => {
		if (text === "") {
			return;
		}
		const newToDos = {
			...toDos,
			[Date.now()]: { text, working },
		};
		// const newToDos = Object.assign({}, toDos, {
		// 	[Date.now()]: { text, work: working },
		// });
		setToDos(newToDos);
		await saveTodos(newToDos);
		setText("");
	};

	const saveTodos = async (toSave) => {
		const s = JSON.stringify(toSave);
		await AsyncStorage.setItem(STORAGE_KEY, s);
	};

	const loadTodos = async () => {
		try {
			const s = await AsyncStorage.getItem(STORAGE_KEY);
			JSON.parse(s);
			setToDos(JSON.parse(s));
		} catch (e) {
			console.log(`error: ${e}`);
		}
	};

	useEffect(() => {
		loadTodos();
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<View style={styles.header}>
				<TouchableOpacity onPress={work}>
					<Text
						style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
					>
						일하고
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={travel}>
					<Text
						style={{ ...styles.btnText, color: working ? theme.gray : "white" }}
					>
						여행하고
					</Text>
				</TouchableOpacity>
			</View>
			<View>
				<TextInput
					onSubmitEditing={addTodo}
					onChangeText={onChangeText}
					returnKeyType="done"
					value={text}
					style={styles.input}
					placeholder={working ? "Todo 추가하기" : "여행을 떠나볼까요?"}
				/>
			</View>
			<ScrollView style={styles.toDoList}>
				{Object.keys(toDos).map((key) =>
					toDos[key].working === working ? (
						<View style={styles.toDo} key={key}>
							<Text style={styles.toDoText}>{toDos[key].text}</Text>
						</View>
					) : null
				)}
			</ScrollView>
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
		fontWeight: "600",
	},
	input: {
		backgroundColor: "white",
		marginVertical: 10,
		marginTop: 20,
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 30,
		fontSize: 18,
	},

	toDoList: {
		marginTop: 30,
	},
	toDo: {
		marginBottom: 10,
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 15,
		backgroundColor: theme.todoBg,
	},
	toDoText: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
	},
});
