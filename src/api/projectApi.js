import { BASE_URL } from "../config";
import { customFetch } from "../utils/customFetch";
import { api } from "./fetchWrapper"

export const getOptions = async () => {
    // return await api.get("project/project-options");
    const res = await customFetch(`${BASE_URL}/api/project/project-options`, {method: "GET"})
    return await res.json();
}

export const createProject = async (projectData) => {
    // return await api.post("project/create", projectData);
    const result = await customFetch(`${BASE_URL}/api/project/create`, {method: "POST", body: JSON.stringify(projectData)});
    return result;
}