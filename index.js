const core = require('@actions/core');
const github = require('@actions/github');

try {

    const time = (new Date()).toTimeString();
    core.setOutput("time", time);

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)


    // Pull request
    const pr = github.context.payload.pull_request;

    // Body
    const body = pr.body;

    console.log(`The event payload: ${pr}`);
    console.log("----------------------------");
    console.log(`The event body: ${body}`);

    // Check if any Tasks are open
    const hasOpenTasks = pr.body.match(/\[\]|\[ \]/);


    console.log("hasOpenTasks", hasOpenTasks);

    let check = {
        name: 'task-list-completed',
        head_sha: pr.head.sha,
        started_at: startTime,
        status: 'in_progress',
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

    return github.checks.create(context.repo(check));
} catch (error) {
    core.setFailed(error.message);
}