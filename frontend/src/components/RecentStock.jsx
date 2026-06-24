import {useContext, useEffect, useState} from "react";
import {ShopContext} from "../context/ShopContext.jsx";
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx";

const RecentStock = () => {
    const { products, isLoading } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0,20));
    }, [products])

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'Recent'} text2={'Stock'} />
            </div>
        {/*  Rendering Products  */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {isLoading 
                    ? Array(10).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse flex flex-col gap-2">
                            <div className="bg-gray-200 w-full h-48 rounded-md"></div>
                            <div className="bg-gray-200 h-4 w-3/4 mt-2"></div>
                            <div className="bg-gray-200 h-4 w-1/2"></div>
                        </div>
                    ))
                    : latestProducts.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>
    )
}

export default RecentStock;