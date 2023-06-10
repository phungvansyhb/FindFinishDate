import { DataTable } from '@/components/tables/dataTable'
import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'
import { useGetListDoc } from '@/services/hookBase.service'
import { IRegisterForm, IRegisterFormDTO } from '@/typedefs/IRegisterForm'
import CreateModal from './CreateModal'
import { columns } from './columns'
import { useGetListRegisterForm } from '@/services/regForm.service'

const data = [
    {
        "id": "FQleYdjcWDeRoJfUn8O4",
        "status": true,
        "className": "lớp mầm non edit 23",
        "classId": "ChcJpgW7lBCm6fI0gfMd",
        "receiveMoney": "3000000",
        "lessonCost": "300000",
        "nextPaymentDate": {
            "seconds": 1689171958,
            "nanoseconds": 216000000
        },
        "updateAt": {
            "seconds": 1686407179,
            "nanoseconds": 708000000
        },
        "startDate": {
            "seconds": 1686407158,
            "nanoseconds": 216000000
        },
        "studentId": "AqEs6kV0awqsnkz3XHp0",
        "isDeleted": false,
        "createAt": {
            "seconds": 1686407179,
            "nanoseconds": 708000000
        },
        "studentName": "hs5",
        "schedule": [
            1,
            2
        ],
        "paymentDate": {
            "seconds": 1686407158,
            "nanoseconds": 216000000
        }
    }
]
export default function RegisterManage() {
    const { data, isLoading } = useGetListRegisterForm()
    // const { data, isLoading } = useGetListDoc({ queryKey: API_QUERY_KEY.GET_LIST_REGISTERFORM, dbKey: DATABASE_KEY.REGISTER_FORM })
    return (
        <section className=''>
            <div className='float-left mt-4'>
                <CreateModal />
            </div>
            {data && !isLoading &&
                <DataTable columns={columns} data={data as IRegisterFormDTO[]} tableName='register' />
            }
        </section>
    )
}