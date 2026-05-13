import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';
import { FashionItem, OperationType } from '../types';

const COLLECTION_NAME = 'fashion_items';

export const fashionItemService = {
  async getItems(limitCount: number = 20): Promise<FashionItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy('createdAt', 'desc'), 
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FashionItem));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  subscribeToItems(callback: (items: FashionItem[]) => void) {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('createdAt', 'desc'), 
      limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FashionItem));
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  async createItem(item: Partial<FashionItem>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...item,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      return null;
    }
  }
};
