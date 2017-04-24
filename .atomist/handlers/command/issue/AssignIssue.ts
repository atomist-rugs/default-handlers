import {
    CommandPlan,
    HandleCommand,
    HandlerContext,
    HandleResponse,
    MappedParameters,
    Response,
    ResponseMessage,
} from "@atomist/rug/operations/Handlers";

import {
    CommandHandler,
    Intent,
    MappedParameter,
    Parameter,
    ParseJson,
    ResponseHandler,
    Secrets,
    Tags,
} from "@atomist/rug/operations/Decorators";
import { handleErrors, wrap } from "@atomist/rugs/operations/CommonHandlers";

import { Issue } from "@atomist/cortex/Issue";
import { execute } from "@atomist/rugs/operations/PlanUtils";

import { renderError, renderIssues, renderSuccess } from "@atomist/rugs/operations/messages/MessageRendering";

@CommandHandler("AssignGitHubIssue", "Assign a GitHub issue to a user")
@Tags("github", "issues")
@Secrets("github://user_token?scopes=repo")
@Intent("assign issue")
class AssignIssueCommand implements HandleCommand {

    @Parameter({ description: "The issue number", pattern: "^.*$" })
    public issue: number;

    @Parameter({ description: "The user to whom the issue should be assigned", pattern: "^.*$" })
    public assignee: string;

    @MappedParameter(MappedParameters.GITHUB_REPOSITORY)
    public repo: string;

    @MappedParameter(MappedParameters.GITHUB_REPO_OWNER)
    public owner: string;

    @MappedParameter("atomist://correlation_id")
    public corrid: string;

    public handle(ctx: HandlerContext): CommandPlan {
        const plan = new CommandPlan();
        const exec = execute("assign-github-issue", this);
        plan.add(
            wrap(
                exec,
                `${this.owner}/${this.repo}#${this.issue} successfully assigned to ${this.assignee}`,
                this));

        const message = new ResponseMessage(`Assigning issue to ${this.assignee}`);
        plan.add(message);

        return plan;
    }
}

export let assignIssue = new AssignIssueCommand();
