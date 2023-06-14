import { API_QUERY_KEY } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import fireBaseService from "./fireBase.service";

export function useGetListAbsence() {
    return useQuery({
        queryKey: [API_QUERY_KEY.GET_LIST_ABSENCEFORM],
        queryFn: () => fireBaseService.getListAbsenceDocs(),
    })
}
export function useCheckTeacherAbsent(classId: string, startDate: Date) {
    return useQuery({
        queryKey: [classId, startDate],
        queryFn: () =>
            fireBaseService.countTeacherAbsentByClassIdAndDate(classId, startDate),

    })
}