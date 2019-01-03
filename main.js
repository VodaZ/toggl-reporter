//let url = 'https://toggl.com/reports/api/v2/details?user_agent=' + userEmail + '&workspace_id=' + workspaceId + '&since=' + fromDate + '&until=' + toDate + '&client_ids=' + clientIds;

httpGetAsync(config.apiToken, 'api_token', 'summary', projectsCallback);
