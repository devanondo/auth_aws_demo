import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { user_roles } from './user.constants';
import { IUser, UserModel } from './user.interface';

const UserSchema = new Schema<IUser, UserModel>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: user_roles,
            default: 'admin',
            required: true,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        is_verified: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

UserSchema.statics.isUserExist = async function (
    query: string
): Promise<IUser | null> {
    const user = await User.aggregate([
        {
            $match: {
                $or: [
                    { email: query },
                    { username: query },
                    { _id: new Schema.ObjectId(query) },
                ],
            },
        },
    ]);

    // return await User.findOne({ query }, { userid: 1, password: 1, role: 1 });
    return user[0];
};

UserSchema.statics.isPasswordMatched = async function (
    givenPassword: string,
    savedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
    // hashing user password
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bycrypt_salt_rounds)
    );

    next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
