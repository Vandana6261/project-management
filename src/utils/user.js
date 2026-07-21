import { BASE_URL } from "../config";
import { cusApi } from "./customFetch";

export async function me() {
    try {
        const res = await cusApi.get("auth/me");
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error)
    }   
}
