import { Order } from "./order";

export interface Customer {
    code: string;
    userName: string;
    password: string;
    fullName: string;
    avatar: string;
    phoneNumber: string;
    email: string;
    address: string;
    dob: string;
    phone: string;
    gender: string;
    lastLogin: Date;
    token: string;
    orders: Order[]
}
