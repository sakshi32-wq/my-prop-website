import { defineConfig } from "orval"

export default defineConfig({
  api: {
    // Swap this for the backend's schema URL once it exists.
    input: { target: "./openapi/openapi.yaml" },
    output: {
      mode: "tags-split",
      target: "src/api/generated",
      schemas: "src/api/generated/model",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      mock: {
        generators: [{ type: "msw", delay: false, baseUrl: "/api" }],
      },
      override: {
        mutator: { path: "src/api/fetcher.ts", name: "customFetch" },
        fetch: { includeHttpResponseReturnType: false },
        enumGenerationType: "union",
        query: {
          version: 5,
          signal: true,
          shouldExportKeys: true,
          mutationInvalidates: [
            {
              onMutations: ["createLead"],
              invalidates: ["listLeads"],
            },
            {
              onMutations: ["updateLead", "deleteLead"],
              invalidates: [
                "listLeads",
                { query: "getLead", params: ["leadId"] },
              ],
            },
            {
              onMutations: ["createCampaign"],
              invalidates: ["listCampaigns"],
            },
            {
              onMutations: ["updateCampaign", "deleteCampaign"],
              invalidates: [
                "listCampaigns",
                { query: "getCampaign", params: ["campaignId"] },
              ],
            },
            {
              onMutations: ["inviteTeamMember"],
              invalidates: ["listTeamMembers"],
            },
            {
              onMutations: ["updateTeamMember", "removeTeamMember"],
              invalidates: [
                "listTeamMembers",
                { query: "getTeamMember", params: ["memberId"] },
              ],
            },
            {
              onMutations: ["createDomain"],
              invalidates: ["listDomains"],
            },
            {
              onMutations: ["deleteDomain", "verifyDomain"],
              invalidates: [
                "listDomains",
                { query: "getDomain", params: ["domainId"] },
              ],
            },
            {
              onMutations: ["createApiKey", "revokeApiKey"],
              invalidates: ["listApiKeys"],
            },
            {
              onMutations: [
                "updateIntegration",
                "connectIntegration",
                "disconnectIntegration",
              ],
              invalidates: ["listIntegrations"],
            },
            {
              // Creating a website also bumps its template's use count.
              onMutations: ["createWebsite"],
              invalidates: [
                "listWebsites",
                // Another tag's query: `file` is its folder, relative to the output root.
                { query: "listTemplates", file: "./templates" },
              ],
            },
            {
              onMutations: ["createTemplate"],
              invalidates: ["listTemplates"],
            },
            {
              onMutations: ["saveWebsiteContent"],
              invalidates: [
                "listWebsites",
                { query: "getWebsite", params: ["websiteId"] },
                { query: "getWebsiteContent", params: ["websiteId"] },
              ],
            },
            {
              onMutations: ["publishWebsite"],
              invalidates: [
                "listWebsites",
                { query: "getWebsite", params: ["websiteId"] },
              ],
            },
          ],
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
})
