import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import ProductItem from "../components/ProductItem.jsx";

const Categories = () => {
    const { products } = useContext(ShopContext);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Categories from Collection page
    const categories = [
        { name: "Fresh Produce", value: "fresh_produce" },
        { name: "Dairy & Eggs", value: "dairy_eggs" },
        { name: "Meat & Seafood", value: "meat_seafood" },
        { name: "Pantry Staples", value: "pantry_staples" },
        { name: "Beverages", value: "beverages" },
        { name: "Snacks", value: "snacks" },
    ];

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        const filtered = products.filter((product) => product.category === category);
        setFilteredProducts(filtered);
    };

    return (
        <div className="flex flex-col space-y-10">
            {/* Categories Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        className={`flex items-center justify-center h-12 rounded-lg bg-gray-100 hover:bg-gray-200 transition`}
                        onClick={() => handleCategoryClick(cat.value)}
                    >
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Filtered Products Section */}
            <div>
                {selectedCategory && (
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Products in {selectedCategory.replace(/_/g, " ")}
                    </h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product, index) => (
                        <ProductItem
                            key={index}
                            name={product.name}
                            id={product._id}
                            price={product.price}
                            image={product.image}
                        />
                    ))}
                    {filteredProducts.length === 0 && selectedCategory && (
                        <p className="text-gray-500">No products found in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;