import {
  getAdminDsaStats,
  getAdminDsaTopics,
  createAdminDsaTopic,
  updateAdminDsaTopic,
  deleteAdminDsaTopic,
  getAdminDsaSections,
  createAdminDsaSection,
  updateAdminDsaSection,
  deleteAdminDsaSection,
  getAdminDsaProblems,
  createAdminDsaProblem,
  updateAdminDsaProblem,
  deleteAdminDsaProblem,
  toggleAdminDsaProblemStatus,
  duplicateAdminDsaProblem
} from '../services/dsaService';

export const getDSATopics = async () => {
  return await getAdminDsaTopics();
};

export const addDSATopic = async (topic) => {
  return await createAdminDsaTopic(topic);
};

export const updateDSATopic = async (topic) => {
  return await updateAdminDsaTopic(topic.id, topic);
};

export const deleteDSATopic = async (id) => {
  return await deleteAdminDsaTopic(id);
};

export const getDSAProblems = async (params = {}) => {
  return await getAdminDsaProblems(params);
};

export const addDSAProblem = async (problem) => {
  return await createAdminDsaProblem(problem);
};

export const updateDSAProblem = async (problem) => {
  return await updateAdminDsaProblem(problem.id, problem);
};

export const deleteDSAProblem = async (id) => {
  return await deleteAdminDsaProblem(id);
};

export const getDSASolutions = async () => {
  return [];
};

export const addDSASolution = async () => {};
export const updateDSASolutionStatus = async () => {};
export const deleteDSASolution = async () => {};
