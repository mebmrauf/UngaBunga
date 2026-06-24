import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from "../utils/axiosInstance.js";
import {currency} from "../App.jsx";
import {toast} from "react-toastify";

const List = ({token}) => {

    const queryClient = useQueryClient();

    const { data: list = [], isLoading, isError, error } = useQuery({
        queryKey: ['adminProducts'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/product/list');
            if (response.data.success) {
                return response.data.products;
            } else {
                throw new Error(response.data.message);
            }
        }
    });

    const removeMutation = useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.post('/api/product/remove', {id});
            if (!response.data.success) throw new Error(response.data.message);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['adminProducts']);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    if (isLoading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );
    if (isError) toast.error(error.message);

    return (
        <div className="animate-fade-in w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">All Products</h1>
            <div className='glass overflow-hidden'>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="p-4 w-20">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {list.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="p-4">
                                        <img className='w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm' src={item.image[0]} alt={item.name}/>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-semibold">{item.category}</span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{currency}{item.price}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={()=>removeMutation.mutate(item._id)} 
                                            className='text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer'
                                            title="Delete Product"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {list.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No products found. Add some products to see them here!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default List