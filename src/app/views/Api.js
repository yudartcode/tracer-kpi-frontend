import { getWithAuth } from "../utils/requestHandler";

export const Api = {
  async getOrgUnit() {
    const response = await getWithAuth(`/organisationUnits.json?paging=false&fields=displayName%2Cparent%2Cid`);
    return response;
  },
  async getUserGroup() {
    const response = await getWithAuth(`/userGroups.json?fields=displayName,id&paging=false`);
    return response;
  },
};
