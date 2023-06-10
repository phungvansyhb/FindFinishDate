import { DataTable } from '@/components/tables/dataTable'
import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'
import { useGetListDoc } from '@/services/hookBase.service'
import { IRegisterForm } from '@/typedefs/IRegisterForm'
import CreateModal from './CreateModal'
import { columns } from './columns'

// type Props = {}

export default function RegisterManage() {
    const { data, isLoading } = useGetListDoc({ queryKey: API_QUERY_KEY.GET_LIST_REGISTERFORM, dbKey: DATABASE_KEY.REGISTER_FORM })
    return (
        <section className=''>
            <div className='float-left mt-4'>
                <CreateModal />
            </div>
            {data && !isLoading &&
                <DataTable columns={columns} data={data as IRegisterForm[]} tableName='classroom' />
            }
        </section>
    )
}