import { API_QUERY_KEY, DATABASE_KEY } from "@/lib/utils";
import fireBaseService from "./fireBase.service";
import { useQuery } from "@tanstack/react-query";

export function useGetListAbsence() {
    return useQuery({
        queryKey: [API_QUERY_KEY.GETLIST_ABSENCEFORM],
        queryFn: () => fireBaseService.getListAbsenceDocs(),
    })
}