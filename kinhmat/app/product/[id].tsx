import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ProductDetailScreen from '../../src/screens/product/ProductDetailScreen';

const ProductDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Ép kiểu string -> number
  const productId = id ? Number(id) : undefined;
  return <ProductDetailScreen productId={productId} />;
};

export default ProductDetailPage;
