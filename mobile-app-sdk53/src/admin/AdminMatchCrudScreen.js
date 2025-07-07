import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, Button, Alert, View, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CrudList from '../components/admin/CrudList';
import dataService from '../services/dataService';

export default function AdminMatchCrudScreen() {
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [matchDate, setMatchDate] = useState(new Date());
  const [venue, setVenue] = useState('');
  const [referee, setReferee] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [round, setRound] = useState('');
  const [competition, setCompetition] = useState('Super-D1');
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    setHomeTeamId('');
    setAwayTeamId('');
    setMatchDate(new Date());
    setVenue('');
    setReferee('');
    setStatus('scheduled');
    setHomeScore('');
    setAwayScore('');
    setRound('');
    setCompetition('Super-D1');
  };

  const handleSave = async () => {
    if (!homeTeamId || !awayTeamId) {
      Alert.alert('خطأ', 'يجب اختيار الفريقين');
      return;
    }

    if (homeTeamId === awayTeamId) {
      Alert.alert('خطأ', 'لا يمكن أن يلعب الفريق ضد نفسه');
      return;
    }
    
    try {
      const homeTeam = teams.find(t => t.id === homeTeamId);
      const awayTeam = teams.find(t => t.id === awayTeamId);

      const matchData = {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_team_name: homeTeam?.name || '',
        away_team_name: awayTeam?.name || '',
        match_date: matchDate.toISOString(),
        venue: venue || null,
        referee: referee || null,
        status,
        home_score: homeScore ? parseInt(homeScore) : 0,
        away_score: awayScore ? parseInt(awayScore) : 0,
        round: round || 'regular',
        competition: competition || 'Super-D1'
      };

      let result;
      if (editingId) {
        result = await dataService.updateMatch(editingId, matchData);
      } else {
        result = await dataService.createMatch(matchData);
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
      const result = await dataService.deleteMatch(id);
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

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || matchDate;
    setShowDatePicker(Platform.OS === 'ios');
    setMatchDate(currentDate);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>إدارة المباريات</Text>
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>الفريق المضيف</Text>
        <Picker
          selectedValue={homeTeamId}
          onValueChange={setHomeTeamId}
          style={styles.picker}
        >
          <Picker.Item label="اختر الفريق المضيف" value="" />
          {teams.map(team => (
            <Picker.Item key={team.id} label={team.name} value={team.id} />
          ))}
        </Picker>
      </View>
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>الفريق الضيف</Text>
        <Picker
          selectedValue={awayTeamId}
          onValueChange={setAwayTeamId}
          style={styles.picker}
        >
          <Picker.Item label="اختر الفريق الضيف" value="" />
          {teams.map(team => (
            <Picker.Item key={team.id} label={team.name} value={team.id} />
          ))}
        </Picker>
      </View>
      
      <View style={styles.dateContainer}>
        <Text style={styles.label}>تاريخ ووقت المباراة</Text>
        <Button title="اختر التاريخ والوقت" onPress={() => setShowDatePicker(true)} />
        <Text style={styles.dateText}>{matchDate.toLocaleString()}</Text>
      </View>
      
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={matchDate}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
      
      <TextInput 
        style={styles.input} 
        placeholder="الملعب" 
        value={venue} 
        onChangeText={setVenue} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="الحكم" 
        value={referee} 
        onChangeText={setReferee} 
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>حالة المباراة</Text>
        <Picker
          selectedValue={status}
          onValueChange={setStatus}
          style={styles.picker}
        >
          <Picker.Item label="مجدولة" value="scheduled" />
          <Picker.Item label="مباشرة" value="live" />
          <Picker.Item label="منتهية" value="completed" />
          <Picker.Item label="ملغية" value="cancelled" />
        </Picker>
      </View>
      
      <View style={styles.scoreContainer}>
        <TextInput 
          style={[styles.input, { flex: 1, marginRight: 10 }]} 
          placeholder="نتيجة المضيف" 
          value={homeScore} 
          onChangeText={setHomeScore}
          keyboardType="numeric"
        />
        <TextInput 
          style={[styles.input, { flex: 1 }]} 
          placeholder="نتيجة الضيف" 
          value={awayScore} 
          onChangeText={setAwayScore}
          keyboardType="numeric"
        />
      </View>
      
      <TextInput 
        style={styles.input} 
        placeholder="الجولة" 
        value={round} 
        onChangeText={setRound} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="البطولة" 
        value={competition} 
        onChangeText={setCompetition} 
      />
      
      <Button title={editingId ? 'تحديث' : 'إنشاء'} onPress={handleSave} />
      {editingId && <Button color="grey" title="إلغاء" onPress={resetForm} />}

      <Text style={[styles.title, { marginTop: 30 }]}>المباريات الموجودة</Text>
      <CrudList
        ref={listRef}
        fetchFn={dataService.getMatches}
        deleteFn={handleDelete}
        onEdit={(item) => {
          setEditingId(item.id);
          setHomeTeamId(item.home_team_id);
          setAwayTeamId(item.away_team_id);
          setMatchDate(new Date(item.match_date || item.date));
          setVenue(item.venue || '');
          setReferee(item.referee || '');
          setStatus(item.status || 'scheduled');
          setHomeScore(item.home_score ? item.home_score.toString() : '');
          setAwayScore(item.away_score ? item.away_score.toString() : '');
          setRound(item.round || '');
          setCompetition(item.competition || 'Super-D1');
        }}
        renderItemFields={(item) => (
          <View>
            <Text style={{ fontWeight: '500' }}>
              {item.home_team_name || item.homeTeam} vs {item.away_team_name || item.awayTeam}
            </Text>
            <Text>{item.home_score || item.homeScore || 0} - {item.away_score || item.awayScore || 0}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {new Date(item.match_date || item.date).toLocaleDateString()} • {item.status}
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
    padding: 10,
  },
  picker: {
    height: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e3c72',
    marginBottom: 5,
  },
  dateContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
  },
  dateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  scoreContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
});