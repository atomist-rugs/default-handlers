/*
 * Copyright © 2017 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    CommandHandler,
    Intent,
    MappedParameter,
    Parameter,
    Secrets,
    Tags,
} from "@atomist/rug/operations/Decorators";
import {
    CommandPlan,
    HandleCommand,
    HandlerContext,
    MappedParameters,
} from "@atomist/rug/operations/Handlers";
import { wrap } from "@atomist/rugs/operations/CommonHandlers";
import { execute } from "@atomist/rugs/operations/PlanUtils";

@CommandHandler("CreateGitHubRelease", "Create a release of a repo on GitHub")
@Tags("github", "issues")
@Secrets("github://user_token?scopes=repo")
@Intent("create release")
class CreateReleaseCommand implements HandleCommand {

    @Parameter({ description: "The tag to release", pattern: "^.*$" })
    public tag: string;

    @Parameter({ description: "The release message", pattern: "@any" })
    public message: string;

    @MappedParameter(MappedParameters.GITHUB_REPOSITORY)
    public repo: string;

    @MappedParameter(MappedParameters.GITHUB_REPO_OWNER)
    public owner: string;

    @MappedParameter("atomist://github_api_url")
    public apiUrl: string = "https://api.github.com/";

    @MappedParameter("atomist://correlation_id")
    public corrid: string;

    public handle(ctx: HandlerContext): CommandPlan {
        const plan = new CommandPlan();
        const ex = execute("create-github-release", this);
        plan.add(wrap(ex, `Successfully created a new release on ${this.owner}/${this.repo}#${this.tag}`, this));
        return plan;
    }
}

export let command = new CreateReleaseCommand();
