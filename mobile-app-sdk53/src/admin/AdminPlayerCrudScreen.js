import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, Button, Alert, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CrudList from '../components/admin/CrudList';
import dataService from '../services/dataService';

export default function AdminPlayerCrudScreen() {
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [position, setPosition] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('موريتانيا');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [teams, setTeams] = useState([]);
  const listRef = React.useRef();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const teamsData = await dataService.getTeams();
      setTeams(teamsData || []);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setTeamId('');
    setPosition('');
    setJerseyNumber('');
    setAge('');
    setNationality('موريتانيا');
    setHeight('');
    setWeight('');
    setBio('');
    setImageUrl('');
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('خطأ', 'اسم اللاعب مطلوب');
      return;
    }
    
    try {
      const playerData = {
        name,
        team_id: teamId || null,
        position: position || null,
        jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
        age: age ? parseInt(age) : null,
        nationality: nationality || 'موريتانيا',
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        bio: bio || null,
        image_url: imageUrl || null
      };

      let result;
      if (editingId) {
        result = await dataService.updatePlayer(editingId, playerData);
      } else {
        result = await dataService.createPlayer(playerData);
      }

      if (result.success) {
        Alert.alert('نجح', editingId ? 'تم التحديث بنجاح' : 'تم الإنشاء بنجاح');
        resetForm();
        listRef.current?.reload();
      } else {
        Alert.alert('خطأ', result.error || 'فشلت العملية');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', 'فشلت العملية');
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await dataService.deletePlayer(id);
      if (result.success) {
        Alert.alert('نجح', 'تم الحذف بنجاح');
        listRef.current?.reload();
      } else {
        Alert.alert('خطأ', result.error || 'فشل الحذف');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', 'فشل الحذف');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>إدارة اللاعبين</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="اسم اللاعب" 
        value={name} 
        onChangeText={setName} 
      />
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={teamId}
          onValueChange={setTeamId}
          style={styles.picker}
        >
          <Picker.Item label="اختر الفريق" value="" />
          {teams.map(team => (
            <Picker.Item key={team.id} label={team.name} value={team.id} />
          ))}
        </Picker>
      </View>
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={position}
          onValueChange={setPosition}
          style={styles.picker}
        >
          <Picker.Item label="اختر المركز" value="" />
          <Picker.Item label="حارس مرمى" value="حارس مرمى" />
          <Picker.Item label="مدافع" value="مدافع" />
          <Picker.Item label="وسط" value="وسط" />
          <Picker.Item label="مهاجم" value="مهاجم" />
        </Picker>
      </View>
      
      <TextInput 
        style={styles.input} 
        placeholder="رقم القميص" 
        value={jerseyNumber} 
        onChangeText={setJerseyNumber}
        keyboardType="numeric"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="العمر" 
        value={age} 
        onChangeText={setAge}
        keyboardType="numeric"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="الجنسية" 
        value={nationality} 
        onChangeText={setNationality} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="الطول (سم)" 
        value={height} 
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="الوزن (كجم)" 
        value={weight} 
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="رابط الصورة" 
        value={imageUrl} 
        onChangeText={setImageUrl} 
      />
      
      <TextInput 
        style={[styles.input, { height: 80 }]} 
        placeholder="السيرة الذاتية" 
        multiline
        value={bio} 
        onChangeText={setBio} 
      />
      
      <Button title={editingId ? 'تحديث' : 'إنشاء'} onPress={handleSave} />
      {editingId && <Button color="grey" title="إلغاء" onPress={resetForm} />}

      <Text style={[styles.title, { marginTop: 30 }]}>اللاعبون الموجودون</Text>
      <CrudList
        ref={listRef}
        fetchFn={dataService.getPlayers}
        deleteFn={handleDelete}
        onEdit={(item) => {
          setEditingId(item.id);
          setName(item.name);
          setTeamId(item.team_id || '');
          setPosition(item.position || '');
          setJerseyNumber(item.jersey_number ? item.jersey_number.toString() : '');
          setAge(item.age ? item.age.toString() : '');
          setNationality(item.nationality || 'موريتانيا');
          setHeight(item.height ? item.height.toString() : '');
          setWeight(item.weight ? item.weight.toString() : '');
          setBio(item.bio || '');
          setImageUrl(item.image_url || '');
        }}
        renderItemFields={(item) => (
          <View>
            <Text style={{ fontWeight: '500' }}>{item.name}</Text>
            <Text>{item.position} • #{item.jersey_number}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {item.teams?.name || 'بدون فريق'}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e3c72', marginBottom: 20 },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 15 },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
});