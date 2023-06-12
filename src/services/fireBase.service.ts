import { db } from '@/lib/firebase.base';
import { DATABASE_KEY } from '@/lib/utils';
import { DocumentData, QueryConstraint, addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where, startAfter, DocumentSnapshot } from 'firebase/firestore';

class FirestoreService {
  public async getListDocs({ key, count, orderKey, orderDirection = 'asc', whereClause, endSnapshot }: { key: string, count?: number, orderKey?: string, orderDirection?: 'asc' | 'desc', whereClause?: [string, '==' | '!=', any][], endSnapshot?: DocumentSnapshot }) {
    try {
      const result: DocumentData[] = []
      const queryConstraint: QueryConstraint[] = []
      if (whereClause) {
        for (let index = 0; index < whereClause.length; index++) {
          queryConstraint.push(where(...whereClause[index]))
        }
      }
      queryConstraint.push(where('isDeleted', '==', false))
      // queryConstraint.push(where('status', '==', true))
      if (count) {
        queryConstraint.push(limit(count))
      }
      if (endSnapshot) {
        queryConstraint.push(startAfter(endSnapshot))
      }
      if (orderKey) {
        queryConstraint.push(orderBy(orderKey, orderDirection))
      }

      const queryObj = query(collection(db, key), ...queryConstraint)
      const querySnapshot = await getDocs(queryObj);
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        result.push({ id: doc.id, ...data })
      });
      return result
    } catch (e) {
      console.error(e);
      throw new Error("get list doc error");
    }
  }

  public async getDetailDoc(key: string, segment?: string[]) {
    try {
      const docRef = segment ? doc(db, key, ...segment) : doc(db, key);
      const document = await getDoc(docRef)
      if (document.exists() && document.data().isDeleted === false && document.data().status === true) {
        return document.data()
      }
      return null
    } catch (e) {
      console.error(e)
      throw new Error('getDetailDoc fail')
    }
  }
  public async getListRegisterFormDocs() {
    try {
      const result: DocumentData[] = []
      const queryConstraint: QueryConstraint[] = []
      queryConstraint.push(where('isDeleted', '==', false))
      const queryObj = query(collection(db, DATABASE_KEY.REGISTER_FORM), ...queryConstraint)
      const querySnapshot = await getDocs(queryObj);
      for (const doc of querySnapshot.docs) {
        const data = doc.data()
        const student = await this.getDetailDoc(DATABASE_KEY.STUDENT + '/' + doc.data().studentId)
        const classRoom = await this.getDetailDoc(DATABASE_KEY.CLASS + '/' + doc.data().classId)
        result.push({ ...data, id: doc.id, student, classRoom })
      }
      return result
    } catch (e) {
      console.error(e);
      throw new Error("get list reg doc error");
    }
  }
  public async getListStudentDocs() {
    try {
      const result: DocumentData[] = []
      const queryConstraint: QueryConstraint[] = []
      queryConstraint.push(where('isDeleted', '==', false))
      const queryObj = query(collection(db, DATABASE_KEY.STUDENT), ...queryConstraint)
      const querySnapshot = await getDocs(queryObj);
      for (const doc of querySnapshot.docs) {
        const data = doc.data()
        const classRoom = await this.getDetailDoc(DATABASE_KEY.CLASS + '/' + doc.data().classId)
        result.push({ ...data, id: doc.id, classRoom: classRoom })
      }
      return result
    } catch (e) {
      console.error(e);
      throw new Error("get list student doc error");
    }
  }
  async createDoc(key: string, data: { [x: string]: any }, customId?: string) {
    try {
      return customId ? await setDoc(doc(db, key, customId), data) : await addDoc(collection(db, key), data);
    } catch (e) {
      console.error(e)
      throw new Error("create error");
    }
  }

  async updateDocument(key: string, data: { [x: string]: any }, segment?: string[]) {
    try {
      const reference = segment ? doc(db, key, ...segment) : doc(db, key)
      return await updateDoc(reference, data);
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("update error");
    }
  }

  public async deleteDocument(key: string, segment?: string[]) {
    try {
      const docRef = segment ? doc(db, key, ...segment) : doc(db, key);
      return await updateDoc(docRef, { isDeleted: true })
    } catch (e) {
      console.error("Error update document: ", e);
      throw new Error('delete fail')
    }
  }
}

export default new FirestoreService();