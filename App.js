import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet , ScrollView, Alert} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './color';
import AsnyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY= "@toDos"
export default function App() {
  const [working, setWorking] = useState(true);

  useEffect(() => {
    loadToDos();
  }, []);

  const [text, setText] = useState('');

  const [toDos, setToDos] = useState({});

  const saveToDos = (toSave) =>{
    AsnyncStorage.setItem(STORAGE_KEY , JSON.stringify(toSave))
  }
  const loadToDos = async() => {
    const s= await AsnyncStorage.getItem(STORAGE_KEY);
    JSON.parse(s);

  }
  const deleteToDo = (key)=> {
    Alert.alert("삭제하기" , "정말 삭제하시겠습니까?", [
      {text: "Yes", 
      style:"destructive",
      onPress: ()=> {
        const newToDos =  {...toDos}
        delete newToDos[key]
        setToDos(newToDos);
        saveToDos(newToDos);
      }},
      {text: "Cancel" }
    ]);
    return;
   
  }

  const schedule = () => setWorking(true);

  const memo = () => setWorking(false);
  const onChangeText = (payload) => setText(payload); 
  const addToDo = async () => {
    if(text === ""){
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: {text,working}})
      
    setToDos(newToDos);+
    setText("");
    await saveToDos(newToDos);
  };
  console.log(toDos);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={schedule}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>
            Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={memo}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>
            Memo
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType='done'
        placeholder={working ? "Add a Schedule" : "Add a Memo"}
        style={styles.input}
        value={text}
        onChangeText={onChangeText}
      />
      <ScrollView  style= {styles.ScrollViewS}>
        {
          Object.keys(toDos).map((key) => 
          toDos[key].working ===working? (<View style={styles.toDo}key={key}>
            <Text style= {styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={()=> deleteToDo(key)}>
            <Fontisto name="trash" size={24} color={"white"}  />
            </TouchableOpacity>
          </View>) : null
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
    marginTop: 100,
    flexDirection: "row",
  },
  btnText: {
    fontWeight: "500",
    fontSize: 38,
    marginHorizontal: 20,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
    
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 12,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: "center" ,
    flexDirection: "row",

  },
  toDoText: {
    color: "white",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  ScrollViewS: {
    width: "100%",
  },
  
});
