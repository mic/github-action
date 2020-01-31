const core = require('@actions/core');
const github = require('@actions/github');

try {

    const startTime = (new Date).toISOString();

    // Pull request
    const pr = github.context.payload.pull_request;

    // Check if any Tasks are open
    const hasOpenTasks = pr.body.match(/\[\]|\[ \]/);

    const [
        gitHubRepoOwner,
        gitHubRepoName
    ] = process.env.GITHUB_REPOSITORY.split("/");
    const gitHubSha = process.env.GITHUB_SHA;
    const gitHubToken = core.getInput("github-token");


    const octokit = new github.GitHub(gitHubToken);

    let check = {
        owner: gitHubRepoOwner,
        repo: gitHubRepoName,
        name: 'task-list-completed',
        head_sha: pr.head.sha,
        started_at: startTime,
        head_sha: gitHubSha,
        status: 'in_progress',
        conclusion: 'failure',
        output: {
            title: 'Outstanding tasks',
            summary: 'Tasks still remain to be completed',
            text: 'We check if any task lists need completing before you can merge this PR'
        }
    };

    // all finished?
    if (hasOpenTasks === null) {
        check.status = 'completed';
        check.conclusion = 'success';
        check.completed_at = (new Date).toISOString();
        check.output.title = 'Tasks completed';
        check.output.summary = 'All tasks have been completed';
    };


    core.setOutput("time", new Date().toTimeString());
    octokit.checks.create(check);

    if (hasOpenTasks != null) {
        // process.exit(1);
        //core.setFailed("Please make sure to check all checkboxes!");
        console.log("Failure")
    } else {
        // octokit.repos.createStatus({
        //     owner: gitHubRepoOwner,
        //     repo: gitHubRepoName,
        //     sha: gitHubSha,
        //     context: 'continuous-integration/travis-ci/push',
        //     state: 'success',
        //     // target_url  : 'https://your.url/',
        //     description: 'All tasks have been completed'
        // });
        console.log("success")
    }


} catch (error) {
    core.setFailed(error.message);
}