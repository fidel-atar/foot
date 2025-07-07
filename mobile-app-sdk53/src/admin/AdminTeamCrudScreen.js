import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, Button, Alert, View } from 'react-native';
import CrudList from '../components/admin/CrudList';
import dataService from '../services/dataService';

export default function AdminTeamCrudScreen() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [coach, setCoach] = useState('');
  const [homeStadium, setHomeStadium] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const listRef = React.useRef();

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCity('');
    setCoach('');
    setHomeStadium('');
    setFoundedYear('');
    setLogoUrl('');
    setDescription('');
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('خطأ', 'اسم الفريق مطلوب');
      return;
    }
    
    try {
      const teamData = {
        name,
        city: city || null,
        coach: coach || null,
        home_stadium: homeStadium || null,
        founded_year: foundedYear ? parseInt(foundedYear) : null,
        logo_url: logoUrl || null,
        description: description || null
      };

      let result;
      if (editingId) {
        result = await dataService.updateTeam(editingId, teamData);
      } else {
        result = await dataService.createTeam(teamData);
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
      const result = await dataService.deleteTeam(id);
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
      <Text style={styles.title}>إدارة الفرق</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="اسم الفريق" 
        value={name} 
        onChangeText={setName} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="المدينة" 
        value={city} 
        onChangeText={setCity} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="المدرب" 
        value={coach} 
        onChangeText={setCoach} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="الملعب الرئيسي" 
        value={homeStadium} 
        onChangeText={setHomeStadium} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="سنة التأسيس" 
        value={foundedYear} 
        onChangeText={setFoundedYear}
        keyboardType="numeric"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="رابط الشعار" 
        value={logoUrl} 
        onChangeText={setLogoUrl} 
      />
      
      <TextInput 
        style={[styles.input, { height: 80 }]} 
        placeholder="الوصف" 
        multiline
        value={description} 
        onChangeText={setDescription} 
      />
      
      <Button title={editingId ? 'تحديث' : 'إنشاء'} onPress={handleSave} />
      {editingId && <Button color="grey" title="إلغاء" onPress={resetForm} />}

      <Text style={[styles.title, { marginTop: 30 }]}>الفرق الموجودة</Text>
      <CrudList
        ref={listRef}
        fetchFn={dataService.getTeams}
        deleteFn={handleDelete}
        onEdit={(item) => {
          setEditingId(item.id);
          setName(item.name);
          setCity(item.city || '');
          setCoach(item.coach || '');
          setHomeStadium(item.home_stadium || '');
          setFoundedYear(item.founded_year ? item.founded_year.toString() : '');
          setLogoUrl(item.logo_url || '');
          setDescription(item.description || '');
        }}
        renderItemFields={(item) => (
          <View>
            <Text style={{ fontWeight: '500' }}>{item.name}</Text>
            <Text>{item.city}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              المدرب: {item.coach || 'غير محدد'}
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
});