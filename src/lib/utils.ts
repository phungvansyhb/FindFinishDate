import { IBase } from './../typedefs/IBase';
import { ClassValue, clsx } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export function convertTimestampFirebase({ date, format }: { date: { seconds: number, nanoseconds: number }, format?: string }) {
    if (!date) return 'Không xác định'
    return dayjs(
        new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
    ).format(format || "dddd, DD [thg] MM-YYYY")
}
export function convertTimestampFirebaseToDate({ date }: { date: { seconds: number, nanoseconds: number } }) {
    return dayjs(
        new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
    ).toDate()
}
export function beforeCreate<T extends Partial<IBase>>(data: T) {
    data.createAt = new Date();
    data.updateAt = new Date();
    data.isDeleted = false;
}
export function beforeUpdate<T extends Partial<IBase>>(data: T) {
    data.updateAt = new Date()
}
// export function fillUndefinedProperyOfObject(data : object , fillValue : any){
//     const tmp = structuredClone(data);
//     Object.keys(tmp).forEach( key=>{
//         if(tmp[key as keyof(tmp)] === undefined){
//             tmp[key] = fillValue
//         }
//     })
//     return tmp;
// }



// CONSTANT
export const VNCurrencyFormatter = new Intl.NumberFormat('vn-VN', {
    style: 'currency',
    currency: 'VND',
});

export const DAYS = [
    {
        label: 'Chủ nhật',
        value: 0
    },
    {
        label: 'Thứ 2',
        value: 1
    },
    {
        label: 'Thứ 3',
        value: 2
    },
    {
        label: 'Thứ 4',
        value: 3
    },
    {
        label: 'Thứ 5',
        value: 4
    },
    {
        label: 'Thứ 6',
        value: 5
    },
    {
        label: 'Thứ 7',
        value: 6
    },

]

export const DAY_ARRAY = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7',]

export const TABS = { REGISTER: 'registers', STUDENTS: 'students', CLASSROOM: 'classroom' }

export const DATABASE_KEY = {
    CLASS: 'Class',
    STUDENT: 'Student',
    REGISTER_FORM: 'RegisterForm',
    ABSENT_FORM: 'AbsentForm'
}

export const API_QUERY_KEY = {
    GET_LIST_STUDENT: 'get_list_student',
    GET_LIST_REGISTERFORM: 'get_list_registerform',
    GET_LIST_CLASSROOM: 'get_list_classroom',
    GET_DETAIL_STUDENT: 'get_detail_student',
    GET_DETAIL_CLASSROOM: 'get_detail_classroom',
}