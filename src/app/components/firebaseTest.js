import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseInit';

async function testFirestoreConnection() {
  try {
    // Attempt to add a test document
    const docRef = await addDoc(collection(db, 'test-collection'), {
      testField: 'testValue',
    });
    console.log('Document written with ID: ', docRef.id);
    
    // Attempt to read the test document
    const querySnapshot = await getDocs(collection(db, 'test-collection'));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });

  } catch (e) {
    console.error('Error testing Firestore connection: ', e);
  }
}

export { testFirestoreConnection };
