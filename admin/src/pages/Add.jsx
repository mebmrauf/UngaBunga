import {assets} from "../assets/admin_assets/assets.js";

const Add = () => {
    return (
        <div>
            <form className='flex flex-col w-full items-start gap-3'>
                <div>
                    <p className='mb-2'>Upload Image</p>
                </div>

                <div className='flex gap-2'>
                    <label htmlFor='image1'>
                        <img className='w-20' src={assets.upload_area} alt=''/>
                        <input type='file' id='image1' hidden/>
                    </label>
                    <label htmlFor='image2'>
                        <img className='w-20' src={assets.upload_area} alt=''/>
                        <input type='file' id='image2' hidden/>
                    </label>
                    <label htmlFor='image3'>
                        <img className='w-20' src={assets.upload_area} alt=''/>
                        <input type='file' id='image3' hidden/>
                    </label>
                    <label htmlFor='image4'>
                        <img className='w-20' src={assets.upload_area} alt=''/>
                        <input type='file' id='image4' hidden/>
                    </label>
                </div>
                <div className='w-full'>
                    <p className='mb-2'>Product Name</p>
                    <input className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='Enter product Name' required/>
                </div>

                <div className='w-full'>
                    <p className='mb-2'>Product Description</p>
                    <textarea className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='Enter product description' required/>
                </div>

                <div>
                    <div>
                        <p>Product Category</p>
                        <select>
                            <option value='Men'>Men</option>
                            <option value='Women'>Women</option>
                            <option value='Kids'>Kids</option>
                        </select>
                    </div>

                    <div>
                        <p>Product Sub-Category</p>
                        <select>
                            <option value='Topwear'>Topwear</option>
                            <option value='Bottomwear'>Bottomwear</option>
                            <option value='Winterwear'>Winterwear</option>
                        </select>
                    </div>

                    <div>
                        <p>Product Price</p>
                        <input type='Number' placeholder='Enter Product Price' min={0} required/>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Add;