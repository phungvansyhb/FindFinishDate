import { DataTable } from '@/components/tables/dataTable'
import { useGetListRegisterForm } from '@/services/regForm.service'
import { IRegisterFormDTO } from '@/typedefs/IRegisterForm'
import CreateModal from './CreateModal'
import { columns } from './columns'


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