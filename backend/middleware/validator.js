import { z } from 'zod';

export const validateRequest = (schema) => (req, res, next) => {
    try {
        const parsedBody = schema.parse(req.body);
        req.body = parsedBody;
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.errors[0].message,
            errors: error.errors
        });
    }
};

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Please enter a strong password (min 8 characters)")
});

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required")
});

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().or(z.number()),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().optional(),
    bestseller: z.string().optional(),
    quantity: z.string().optional(),
});
