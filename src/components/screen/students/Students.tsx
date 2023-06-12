import { useGetListStudent } from '@/services/student.service'
import { IStudentDTO } from '@/typedefs/IStudent'
import { DataTable } from '../../tables/dataTable'
import CreateModal from './CreateModal'
import { columns } from './columns'


export default function Students() {
    const { data, isLoading } = useGetListStudent()
    return (
        <section className=''>
            <div className='float-left mt-4'>
                <CreateModal />
            </div>
            {data && !isLoading &&
                <DataTable columns={columns} data={data as IStudentDTO[]} tableName='student' />
            }
        </section>
    )
}