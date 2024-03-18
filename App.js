import { StatusBar } from "expo-status-bar";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./color";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
	const [text, setText] = useState("");
	const [working, setWorking] = useState(true);
	const [toDos, setToDos] = useState({});

	const STATUS = "@working";
	const STORAGE_KEY = "@toDos";

	useEffect(() => {
		loadTodos();
		callWorking();
	}, []);

	

	useEffect(() => {
		AsyncStorage.setItem(STATUS, JSON.stringify(working));
	}, [working]);

	const callWorking = async () => {
		try {
			const now = await AsyncStorage.getItem(STATUS);
			JSON.parse(now);
			setWorking(now);
		} catch (e) {
			console.error(e);
		}
	};

	const work = async () => {
		setWorking(true);
	};

	const travel = async () => {
		setWorking(false);
	};

	const onChangeText = (text) => {
		setText(text);
	};

	const addTodo = async () => {
		if (text === "") {
			return;
		}
		const newToDos = {
			...toDos,
			[Date.now()]: { text, working, checked:false },
		};
		setToDos(newToDos);
		await saveToDos(newToDos);
		setText("");
	};

	const completedToDo = (key) => {
		const newToDos = { ...toDos };
		newToDos[key].checked = !newToDos[key].checked;
		setToDos(newToDos);
		saveToDos(newToDos);
	};

	const saveToDos = async (toSave) => {
		const s = JSON.stringify(toSave); // AsyncStorage에 저장하기 위해 string으로 저장.
		await AsyncStorage.setItem(STORAGE_KEY, s);
	};

	const loadTodos = async () => {
		try {
			// AsyncStorage는 string으로만 저장되므로 다시 JSON으로 변환 작업 필요.
			const s = await AsyncStorage.getItem(STORAGE_KEY);
			if (s) {
				JSON.parse(s); 
				setToDos(JSON.parse(s));
			}
		} catch (e) {
			console.log(`error: ${e}`);
		}
	};

	const deleteTodo = (key) => {
		Alert.alert("삭제", "삭제하시겠습니까?", [
			{ text: "취소" },
			{
				text: "삭제",
				style: "destructive",
				onPress: () => {
					const newToDos = { ...toDos };
					delete newToDos[key];
					setToDos(newToDos);
					saveToDos(newToDos);
				},
			},
		]);
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
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
					placeholder={working ? "할 일 추가하기" : "여행을 떠나볼까요?"}
				/>
			</View>
			<ScrollView style={styles.toDoList}>
				{Object.keys(toDos).map((key) =>
					toDos[key].working === working ? (
						<View style={styles.toDo} key={key}>
							<Text style={toDos[key].checked ? styles.completeToDoText : styles.toDoText}>
								{toDos[key].text}
							</Text>
							<View style={styles.btnArea}>
								<TouchableOpacity onPress={() => completedToDo(key)}>
									<AntDesign name="check" size={20} color="lime" />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => deleteTodo(key)}>
									<AntDesign name="delete" size={20} color="black" />
								</TouchableOpacity>
							</View>
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
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 15,
		backgroundColor: theme.todoBg,
	},
	toDoText: {
		color: "white",
		fontSize: 20,
		fontWeight: "500",
	},
	completeToDoText: {
		color: "lightgray",
		fontSize: 20,
		fontWeight: "500",
		textDecorationLine: "line-through",
	},
	btnArea: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 45,
	},
	check: {
		paddingRight: 50,
	},
	delete: {
		fontSize: 25,
		marginLeft: 30,
	},
});
