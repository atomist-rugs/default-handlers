import * as mustache from 'mustache'
import { Issue } from "@atomist/github/core/Core"

let list_issues = `{
  "attachments": [
    {{#issues}}
    {
      "fallback": "#{{number}}: {{title}}",
      {{#closed}}
      "footer_icon": "http://images.atomist.com/rug/issue-closed.png",
      "color": "#bd2c00",
      {{/closed}}
      {{^closed}}
      "footer_icon": "http://images.atomist.com/rug/issue-open.png",
      "color": "#6cc644",
      {{/closed}}
      {{#assignee}}
      "author_link": "{{{assignee.html_url}}}",
      "author_name": "@{{{assignee.login}}}",
      "author_icon": "{{{assignee.avatar_url}}}",
      {{/assignee}}
      "mrkdwn_in": ["text"],
      "text": "<{{{issueUrl}}}|#{{number}}: {{{title}}}>",
      "footer": "<{{{url}}}|{{{repo}}}>",
      "ts": "{{ts}}"
    }
    {{/issues}}
  ]
}`

//render github issues for slack
function renderIssues(issuesList: Issue[]): string {
  try{
    return mustache.render(list_issues, 
  {issues: issuesList, 
    closed: function() {
       return this.state === "closed"
     } , 
     assignee: function() {
       return this.assignee !== undefined
     }
  })
  }catch(ex) {
    return `Failed to render message using template: ${ex}`
  }
}

let failure = `{
  "attachments": [
    {
      "fallback": "Unable to run command",
      "mrkdwn_in": ["text", "pretext"],
      "author_name": "Unable to run command",
      "author_icon": "https://images.atomist.com/rug/error-circle.png",
      "color": "#D94649",
      "text" : "{{{text}}}"
    }
  ]
}`

//generic error rendering
function renderError(msg: string): string {
try{
    return mustache.render(failure, {text: msg})
  }catch(ex) {
    return `Failed to render message using template: ${ex}`
  }
}

let success = `{
  "attachments": [
    {
      "fallback": "{{{text}}}",
      "mrkdwn_in": ["text", "pretext"],
      "author_name": "Successfully ran command",
      "author_icon": "https://images.atomist.com/rug/check-circle.gif?gif={{random}}",
      "color": "#45B254",
      "text": "{{{text}}}"
    }
  ]
}`

//generic success rendering
function renderSuccess(msg: string): string {
try{
    return mustache.render(success, {text: msg})
  }catch(ex) {
    return `Failed to render message using template: ${ex}`
  }
}

export {renderIssues, renderError, renderSuccess}
