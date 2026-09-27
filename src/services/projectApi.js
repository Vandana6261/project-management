import { BASE_URL } from "../config";
import { cusApi } from "./customFetch";
import { api } from "../api/fetchWrapper"

export const getOptions = async () => {
    const res = await cusApi.get('project/project-options');
    return await res.json();
}

export const createProject = async (projectData) => {
    const res = await cusApi.post('project/create', projectData);
    return await res.json();
}

const projectCache = new Map();

export const invalidateProjectCache = (projectId) => {
    if (projectId) {
        projectCache.delete(projectId);
    } else {
        projectCache.clear();
    }
};

export const addMemberInProject = async (data) => {
    const res = await cusApi.post('project/add-member', data);
    const result = await res.json();
    if (result?.success && data?.projectId) {
        invalidateProjectCache(data.projectId);
    }
    return result;
}

export const getProjectMembers = async (projectId) => {
    const res = await cusApi.get(`project/${projectId}/members`);
    return res.json();
}

export const getTaskOptions = async () => {
    const res = await cusApi.get('project/task/get-options')
    return await res.json();
}

export const addTaskInProject = async (payload) => {
    const res = await cusApi.post('project/task/create', payload);
    const result = await res.json();
    if (result?.success && payload?.projectId) {
        invalidateProjectCache(payload.projectId);
    }
    return result;
}

export const getProjectInfo = async (projectId, forceRefresh = false) => {
    if (!forceRefresh && projectCache.has(projectId)) {
        return projectCache.get(projectId);
    }
    const res = await cusApi.get(`project/${projectId}`);
    const data = await res.json();
    if (data?.success) {
        projectCache.set(projectId, data);
    }
    return data;
}