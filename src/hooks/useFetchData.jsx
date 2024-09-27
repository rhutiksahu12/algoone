import { useQuery } from "@tanstack/react-query"
import axios from "axios"



export const useFetchData = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: ['fetchData'],
        queryFn: async () => {
            const data = await axios.get(import.meta.env.VITE_FETCH_URL)
            return data.data
        },

        retry: 1
    })
    return { data, isLoading, error, isError, refetch}
}