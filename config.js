//API doc: https://github.com/toggl/toggl_api_docs/blob/master/reports.md

let config = {
  apiToken: '...',
  url: {
    base: 'https://toggl.com/reports/api/v2',
    detail: '/details',
    project: '/project',
    summary: '/summary'
  },
  urlData: {
    user_agent: '...',
    workspace_id: '...',
    since: '2017-08-16',
    until: '2017-08-17',
    billable: null,
    //client_ids: 'Commity',
    project_ids: null,
    user_ids: null,
    members_of_group_ids: null,
    or_members_of_group_ids: null,
    tag_ids: null,
    task_ids: null,
    time_entry_ids: null,
    description: null,
    without_description: null,
    order_field: null
  }
};