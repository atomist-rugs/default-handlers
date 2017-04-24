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
import {
    CommandPlan,
    HandleCommand,
    HandlerContext,
    HandleResponse,
    MappedParameters,
    Response,
} from "@atomist/rug/operations/Handlers";
import { handleErrors, handleSuccess } from "@atomist/rugs/operations/CommonHandlers";

@CommandHandler("ReactGitHubPullRequestComment", "React to a GitHub pull request review comment")
@Tags("github", "pull requests", "comments", "reactions")
@Secrets("github://user_token?scopes=repo")
class ReactGitHubPullRequestCommentCommand implements HandleCommand {

    @Parameter({ description: "The reaction to add", pattern: "^\\+1|\\-1|laugh|confused|heart|hooray$" })
    public reaction: string;

    @Parameter({ description: "The pull request number", pattern: "^.*$" })
    public pullRequest: string;

    @Parameter({ description: "The comment number", pattern: "^.*$" })
    public comment: string;

    @MappedParameter(MappedParameters.GITHUB_REPOSITORY)
    public repo: string;

    @MappedParameter(MappedParameters.GITHUB_REPO_OWNER)
    public owner: string;

    @MappedParameter("atomist://correlation_id")
    public corrid: string;

    public handle(ctx: HandlerContext): CommandPlan {
        const plan = new CommandPlan();
        const execute = {
            instruction: {
                kind: "execute",
                name: "react-github-pull-request-review-comment",
                parameters: this,
            },
        };
        const msg = "Successfully reacted with :";
        handleErrors(execute, this);
        handleSuccess(
            execute,
            `${msg}${this.reaction}: to ${this.owner}/${this.repo}/pulls/#${this.pullRequest}/comments/${this.comment}`,
        );
        plan.add(execute);
        return plan;
    }
}

export let comment = new ReactGitHubPullRequestCommentCommand();
