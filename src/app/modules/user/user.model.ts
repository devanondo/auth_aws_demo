import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../error/api-error';
import { user_roles } from './user.constants';
import { IUser, UserModel } from './user.interface';

const UserSchema = new Schema<IUser, UserModel>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
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
        token: {
            type: String,
            select: 0,
        },
        is_verified: {
            type: Boolean,
            default: false,
            required: true,
        },
        is_deleted: {
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
                    // { _id: new mongoose.Types.ObjectId(query) },
                ],
            },
        },
    ]);

    return user[0];
};

UserSchema.statics.isPasswordMatched = async function (
    givenPassword: string,
    savedPassword: string
): Promise<boolean> {
    const matchedPassword = await bcrypt.compare(givenPassword, savedPassword);
    return matchedPassword;
};

UserSchema.statics.isVerifiedUser = async function (
    id: string
): Promise<boolean> {
    const user = await User.findById(id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');

    return user.is_verified!;
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
