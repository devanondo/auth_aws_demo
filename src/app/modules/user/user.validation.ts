import { z } from 'zod';

const createAdminZodSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Name is Required',
        }),
        username: z.string({
            required_error: 'Username is Required',
        }),
        email: z.string().email('Email is required'),
        password: z.string({
            required_error: 'Password is Required',
        }),
    }),
});

export const UserZodValidation = {
    createAdminZodSchema,
};
