"use server"
import { cookies } from "next/headers";

const fetchCurrentUser = async () => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;

    if (!token) {
        return null;
    }

    const res = await fetch(`${process.env.API_URL}/api/users/me`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });

    if (!res.ok) {
        return null;
    }
    const data = await res.json();
    return data.user;
}

export default fetchCurrentUser;