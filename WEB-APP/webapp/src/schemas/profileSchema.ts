import {z} from 'zod';

export const usernameValidation = z
.string()
.trim()
.min(3, 'username must be atleast 3 characters')
.max(30, 'username must be less than the 30characters')
//.regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');


export const profileSchema = z.object({
   leetcodeUsername : usernameValidation,
    notifyMail: z
    .string()
    .trim()
    .email({ message: "Invalid email address" }),
});
