import { BASE_URL } from "../config";
import { cusApi } from "../utils/customFetch";
import { api } from "./fetchWrapper"

export const getOptions = async () => {
    const res = await cusApi.get('project/project-options');
    return await res.json();
}

export const createProject = async (projectData) => {
    const res = await cusApi.post('project/create', projectData);
    return res;
}

export const addMemberInProject = async (data) => {
    const res = await cusApi.post('project/add-member', data);
    return res;
}

export const getProjectMembers = async (projectId) => {
    const res = await cusApi.get(`project/${projectId}/members`);
    return res.json();
}

export const getTaskOptions = async () => {
    const res = await cusApi.get('project/task/getOptions')
    return await res.json();
}