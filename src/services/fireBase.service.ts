import { convertTimestampFirebaseToDate } from '@/lib/utils';
import { db } from '@/lib/firebase.base';
import { DATABASE_KEY, findCourseEndDate } from '@/lib/utils';
import { IRegisterForm, IRegisterFormDTO } from '@/typedefs/IRegisterForm';
import { DocumentData, QueryConstraint, addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where, startAfter, DocumentSnapshot, writeBatch, runTransaction, Timestamp } from 'firebase/firestore';

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
  /* ======================= EDGE CASE=======================  */
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
  public async getListAbsenceDocs() {
    try {
      const result: DocumentData[] = []
      const queryConstraint: QueryConstraint[] = []
      queryConstraint.push(where('isDeleted', '==', false))
      const queryObj = query(collection(db, DATABASE_KEY.ABSENCE_FORM), ...queryConstraint)
      const querySnapshot = await getDocs(queryObj);
      for (const doc of querySnapshot.docs) {
        const data = doc.data()
        const classRoom = await this.getDetailDoc(DATABASE_KEY.CLASS + '/' + doc.data().classId)
        result.push({ ...data, id: doc.id, classRoom: classRoom })
      }
      return result
    } catch (e) {
      console.error(e);
      throw new Error("get list absence doc error");
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
  async countTeacherAbsentByClassIdAndDate(classId: string, startDate: Date) {
    const queryConstraint: QueryConstraint[] = []
    queryConstraint.push(where('classId', '==', classId))
    queryConstraint.push(where('status', '==', true))
    queryConstraint.push(where('isDeleted', '==', false))
    // queryConstraint.push(where('absenceDate', '>=', startDate))
    const queryObj = query(collection(db, DATABASE_KEY.REGISTER_FORM), ...queryConstraint)
    const querySnapshot = await getDocs(queryObj);
    const size = querySnapshot.size
    return size
  }
  async updateBatchRegisterFormDocument(key: string, amount: number, whereClause?: [string, '==' | '!=' | '>=' | '<=', any][]) {
    const batch = writeBatch(db)
    try {
      const queryConstraint: QueryConstraint[] = []
      if (whereClause) {
        for (let index = 0; index < whereClause.length; index++) {
          queryConstraint.push(where(...whereClause[index]))
        }
      }
      const queryObj = query(collection(db, key), ...queryConstraint)
      const querySnapshot = await getDocs(queryObj);
      for (const item of querySnapshot.docs) {
        const data = item.data() as IRegisterForm
        const path = key + '/' + item.id
        const dataRef = doc(db, path)
        const classRoom = await this.getDetailDoc(DATABASE_KEY.CLASS + '/' + data.classId)
        if (classRoom) {
          const startDate = convertTimestampFirebaseToDate({ date: data.startDate as Timestamp })
          const numberLesson = Math.floor(parseInt(data.receiveMoney) / parseInt(data.lessonCost)) + data.teacherAbsents + amount
          const schedule = classRoom.schedule
          const newEndDate = findCourseEndDate(
            schedule,
            startDate,
            numberLesson
          )
          batch.update(dataRef, {
            teacherAbsents: data.teacherAbsents + amount,
            nextPaymentDate: newEndDate.toDate()
          });


        }
      }
      await batch.commit()
    } catch (e) {
      console.error("Error update batch document: ", e);
      throw new Error("update error");
    }
  }
}

export default new FirestoreService();