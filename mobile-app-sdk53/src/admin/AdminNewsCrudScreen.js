import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, Button, Alert, View, Switch } from 'react-native';
import CrudList from '../components/admin/CrudList';
import dataService from '../services/dataService';

export default function AdminNewsCrudScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const listRef = React.useRef();

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setAuthor('');
    setImageUrl('');
    setIsFeatured(false);
  };

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('خطأ', 'العنوان والمحتوى مطلوبان');
      return;
    }
    
    try {
      const newsData = {
        title,
        content,
        author: author || 'إدارة الموقع',
        image_url: imageUrl || null,
        is_featured: isFeatured,
        published: true
      };

      let result;
      if (editingId) {
        result = await dataService.updateNews(editingId, newsData);
      } else {
        result = await dataService.createNews(newsData);
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
      const result = await dataService.deleteNews(id);
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
      <Text style={styles.title}>إدارة الأخبار</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="عنوان الخبر" 
        value={title} 
        onChangeText={setTitle} 
      />
      
      <TextInput 
        style={[styles.input, { height: 100 }]} 
        placeholder="محتوى الخبر" 
        multiline
        value={content} 
        onChangeText={setContent} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="الكاتب (اختياري)" 
        value={author} 
        onChangeText={setAuthor} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="رابط الصورة (اختياري)" 
        value={imageUrl} 
        onChangeText={setImageUrl} 
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>خبر مميز</Text>
        <Switch
          value={isFeatured}
          onValueChange={setIsFeatured}
          trackColor={{ false: '#767577', true: '#1e3c72' }}
          thumbColor={isFeatured ? '#fff' : '#f4f3f4'}
        />
      </View>
      
      <Button title={editingId ? 'تحديث' : 'إنشاء'} onPress={handleSave} />
      {editingId && <Button color="grey" title="إلغاء" onPress={resetForm} />}

      <Text style={[styles.title, { marginTop: 30 }]}>الأخبار الموجودة</Text>
      <CrudList
        ref={listRef}
        fetchFn={dataService.getNews}
        deleteFn={handleDelete}
        onEdit={(item) => {
          setEditingId(item.id);
          setTitle(item.title);
          setContent(item.content);
          setAuthor(item.author || '');
          setImageUrl(item.image_url || '');
          setIsFeatured(item.is_featured || false);
        }}
        renderItemFields={(item) => (
          <View>
            <Text style={{ fontWeight: '500' }}>{item.title}</Text>
            <Text numberOfLines={2}>{item.content}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {item.author} • {item.is_featured ? 'مميز' : 'عادي'}
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1e3c72',
    fontWeight: '500',
  },
});