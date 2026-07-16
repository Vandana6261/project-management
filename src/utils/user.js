import { BASE_URL } from "../config";
import { customFetch } from "./customFetch";

export async function me() {
    try {
        const res = await customFetch(`${BASE_URL}/api/auth/me`, {method: "GET"});
        return await res.json()
    } catch (error) {
        console.log(error)
    }   
}
