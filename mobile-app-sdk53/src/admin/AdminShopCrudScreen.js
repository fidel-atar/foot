import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, Button, Alert, View, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CrudList from '../components/admin/CrudList';
import dataService from '../services/dataService';

export default function AdminShopCrudScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const listRef = React.useRef();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await dataService.getShopCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setStockQuantity('');
    setSize('');
    setColor('');
    setImageUrl('');
    setCategoryId('');
    setIsAvailable(true);
  };

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert('خطأ', 'اسم المنتج والسعر مطلوبان');
      return;
    }
    
    try {
      const itemData = {
        name,
        description: description || null,
        price: parseFloat(price),
        stock_quantity: stockQuantity ? parseInt(stockQuantity) : 0,
        size: size || null,
        color: color || null,
        image_url: imageUrl || null,
        category_id: categoryId || null,
        is_available: isAvailable
      };

      let result;
      if (editingId) {
        result = await dataService.updateShopItem(editingId, itemData);
      } else {
        result = await dataService.createShopItem(itemData);
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
      const result = await dataService.deleteShopItem(id);
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
      <Text style={styles.title}>إدارة المتجر</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="اسم المنتج" 
        value={name} 
        onChangeText={setName} 
      />
      
      <TextInput 
        style={[styles.input, { height: 80 }]} 
        placeholder="وصف المنتج" 
        multiline
        value={description} 
        onChangeText={setDescription} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="السعر (MRU)" 
        value={price} 
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="الكمية المتوفرة" 
        value={stockQuantity} 
        onChangeText={setStockQuantity}
        keyboardType="numeric"
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>الفئة</Text>
        <Picker
          selectedValue={categoryId}
          onValueChange={setCategoryId}
          style={styles.picker}
        >
          <Picker.Item label="اختر الفئة" value="" />
          {categories.map(category => (
            <Picker.Item key={category.id} label={category.name} value={category.id} />
          ))}
        </Picker>
      </View>
      
      <TextInput 
        style={styles.input} 
        placeholder="الحجم" 
        value={size} 
        onChangeText={setSize} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="اللون" 
        value={color} 
        onChangeText={setColor} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="رابط الصورة" 
        value={imageUrl} 
        onChangeText={setImageUrl} 
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>متوفر للبيع</Text>
        <Switch
          value={isAvailable}
          onValueChange={setIsAvailable}
          trackColor={{ false: '#767577', true: '#1e3c72' }}
          thumbColor={isAvailable ? '#fff' : '#f4f3f4'}
        />
      </View>
      
      <Button title={editingId ? 'تحديث' : 'إنشاء'} onPress={handleSave} />
      {editingId && <Button color="grey" title="إلغاء" onPress={resetForm} />}

      <Text style={[styles.title, { marginTop: 30 }]}>المنتجات الموجودة</Text>
      <CrudList
        ref={listRef}
        fetchFn={dataService.getShopItems}
        deleteFn={handleDelete}
        onEdit={(item) => {
          setEditingId(item.id);
          setName(item.name);
          setDescription(item.description || '');
          setPrice(item.price ? item.price.toString() : '');
          setStockQuantity(item.stock_quantity ? item.stock_quantity.toString() : '');
          setSize(item.size || '');
          setColor(item.color || '');
          setImageUrl(item.image_url || '');
          setCategoryId(item.category_id || '');
          setIsAvailable(item.is_available !== false);
        }}
        renderItemFields={(item) => (
          <View>
            <Text style={{ fontWeight: '500' }}>{item.name}</Text>
            <Text>{item.price} MRU • المخزون: {item.stock_quantity}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {item.shop_categories?.name || 'بدون فئة'} • {item.is_available ? 'متوفر' : 'غير متوفر'}
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