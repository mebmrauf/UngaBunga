import { useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Categories = ({ token }) => {
    const queryClient = useQueryClient();
    
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    
    const [subCatName, setSubCatName] = useState("");
    const [subCatValue, setSubCatValue] = useState("");
    const [subCategories, setSubCategories] = useState([]);

    const { data: categories = [], isLoading, isError, error } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/category/list');
            if (response.data.success) {
                return response.data.categories;
            } else {
                throw new Error(response.data.message);
            }
        }
    });

    const addCategoryMutation = useMutation({
        mutationFn: async (newCategory) => {
            const response = await axiosInstance.post('/api/category/add', newCategory);
            if (!response.data.success) throw new Error(response.data.message);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['categories']);
            setName(""); setValue(""); setSubCategories([]);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const removeCategoryMutation = useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.post('/api/category/remove', { id });
            if (!response.data.success) throw new Error(response.data.message);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['categories']);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const handleAddSubCategory = () => {
        if (!subCatName || !subCatValue) return toast.error("Enter both name and value for subcategory");
        setSubCategories([...subCategories, { name: subCatName, value: subCatValue }]);
        setSubCatName(""); setSubCatValue("");
    };

    const handleRemoveSubCategory = (val) => {
        setSubCategories(subCategories.filter(s => s.value !== val));
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (!name || !value) return toast.error("Enter Category name and value");
        addCategoryMutation.mutate({ name, value, subCategories });
    };

    if (isLoading) return <p>Loading Categories...</p>;
    if (isError) toast.error(error.message);

    return (
        <div className="animate-fade-in w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Categories</h1>
            
            <div className='flex flex-col lg:flex-row gap-8 w-full'>
                <div className="glass p-8 w-full lg:w-1/3">
                    <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-5'>
                        <h2 className='text-xl font-bold text-gray-800'>Add New Category</h2>
                        <div className='w-full'>
                            <p className='mb-2 font-medium text-gray-700'>Category Name</p>
                            <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full' type='text' placeholder='e.g. Electronics' required/>
                        </div>
                        <div className='w-full'>
                            <p className='mb-2 font-medium text-gray-700'>Category Value (ID)</p>
                            <input onChange={(e)=>setValue(e.target.value)} value={value} className='w-full' type='text' placeholder='e.g. electronics' required/>
                        </div>
                        
                        <div className='w-full mt-2 bg-gray-50 border border-gray-200 rounded-lg p-5'>
                            <h3 className='font-bold text-gray-700 mb-3'>Sub-Categories</h3>
                            <div className='flex gap-2 mb-3'>
                                <input onChange={(e)=>setSubCatName(e.target.value)} value={subCatName} className='w-full' type='text' placeholder='Name (e.g. Phones)' />
                                <input onChange={(e)=>setSubCatValue(e.target.value)} value={subCatValue} className='w-full' type='text' placeholder='Value (e.g. phones)' />
                                <button type="button" onClick={handleAddSubCategory} className='bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer'>Add</button>
                            </div>
                            {subCategories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {subCategories.map((sub, idx) => (
                                        <div key={idx} className="flex gap-2 items-center bg-white shadow-sm px-3 py-1 rounded-full border border-gray-200 text-sm">
                                            <span className="font-medium text-gray-700">{sub.name}</span>
                                            <button type="button" onClick={() => handleRemoveSubCategory(sub.value)} className="text-red-500 hover:text-red-700 font-bold cursor-pointer transition-colors">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type='submit' className='w-full py-3 mt-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-md transition-colors cursor-pointer'>SAVE CATEGORY</button>
                    </form>
                </div>

                <div className='w-full lg:w-2/3'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="glass p-6 relative flex flex-col hover:-translate-y-1 transition-transform duration-300">
                                <h3 className="font-bold text-lg text-gray-800 mb-1">{cat.name} <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-2">({cat.value})</span></h3>
                                <button onClick={() => removeCategoryMutation.mutate(cat._id)} className="absolute top-6 right-6 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer" title="Delete Category">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Sub-categories</p>
                                    {cat.subCategories && cat.subCategories.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {cat.subCategories.map((sub, sidx) => (
                                                <span key={sidx} className="bg-gray-50 px-2.5 py-1 text-sm rounded-md border border-gray-200 text-gray-600">{sub.name}</span>
                                            ))}
                                        </div>
                                    ) : <p className="text-sm text-gray-400 italic">No sub-categories</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    {categories.length === 0 && (
                        <div className="glass p-10 text-center text-gray-500">
                            No categories created yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Categories;
