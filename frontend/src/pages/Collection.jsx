import {useContext, useEffect, useState} from "react";
import {ShopContext} from "../context/ShopContext.jsx";
import {assets} from "../assets/assets.js";
import ProductItem from "../components/ProductItem.jsx";

const Collection = () => {

    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);

    const toggleCategory = (e) => {

        if(category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value));
        }
        else setCategory(prev => [...prev, e.target.value]);
    }
    const toggleSubCategory = (e) => {

        if(subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value));
        }
        else setSubCategory(prev => [...prev, e.target.value]);
    }

    const applyFilter = () => {

        let productsCopy = products.slice();

        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
        }
        setFilterProducts(productsCopy);
    }

    useEffect(() => {
        applyFilter();
    }, [category, subCategory, search, showSearch, products]);

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        {/* Filter Options */}
            <div className='min-w-60'>
                <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>Filters
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
                </p>
                {/* Category filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>Categories</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'fresh_produce'}
                                   onChange={toggleCategory}/> Fresh Produce
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'dairy_eggs'}
                                   onChange={toggleCategory}/> Dairy & Eggs
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'meat_seafood'}
                                   onChange={toggleCategory}/> Meat & Seafood
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'pantry_staples'}
                                   onChange={toggleCategory}/> Pantry Staples
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'beverages'}
                                   onChange={toggleCategory}/> Beverages
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'snacks'}
                                   onChange={toggleCategory}/> Snacks
                        </p>
                    </div>
                </div>
                {/* Sub category filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                <p className='mb-3 text-sm font-medium'>Type</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'fruits'}
                                   onChange={toggleSubCategory}/> Fruits
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'vegetables'}
                                   onChange={toggleSubCategory}/> Vegetables
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'dairy_products'}
                                   onChange={toggleSubCategory}/> Dairy Products
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'eggs'}
                                   onChange={toggleSubCategory}/> Eggs
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'meat'}
                                   onChange={toggleSubCategory}/> Meat
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'seafood'}
                                   onChange={toggleSubCategory}/> Seafood
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'rice'}
                                   onChange={toggleSubCategory}/> Rice
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'flour_baking'}
                                   onChange={toggleSubCategory}/> Flour and Baking Supplies
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'pasta_noodles'}
                                   onChange={toggleSubCategory}/> Pasta & Noodles
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'oils'}
                                   onChange={toggleSubCategory}/> Oils
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'tea_coffee'}
                                   onChange={toggleSubCategory}/> Tea & Coffee
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'jucies'}
                                   onChange={toggleSubCategory}/> Jucies
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'soft_drinks'}
                                   onChange={toggleSubCategory}/> Soft Drinks
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'chips'}
                                   onChange={toggleSubCategory}/> Chips
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'cookies'}
                                   onChange={toggleSubCategory}/> Cookies
                        </p>
                    </div>
                </div>
            </div>

            {/* Map Products */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                {
                    filterProducts.map((item, index) => (
                            <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
                        ))
                    }
                </div>
        </div>
    )
}

export default Collection;