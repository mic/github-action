const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

try {
    const tasks = fs.readFileSync('./tasklist.txt', 'utf8')
    console.log(tasks)

    // `who-to-greet` input defined in action metadata file
    const pathToTasklist = core.getInput('tasklist');
    // console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}