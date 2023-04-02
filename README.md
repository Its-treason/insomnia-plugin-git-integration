# Git integration for Insomnia

Insomnia plugin for exporting and importing insomnia Projects into Git
repositories.

⚠️ This plugin is currently under development. It is recommended to backup
Insomnia data before using it.

## I want your feedback!

I need your feedback to further improve the Plugins features and usability. If you have any Issue or Ideas please [open a new issue](https://github.com/Its-treason/insomnia-plugin-git-integration/issues/new).

## Features

- Export and Import Insomnia projects
- Manage projects with git, without leaving Insomnia. (Pull, Push, Commit)

## Requirements

- The `git` binary must be installed
- Credentials must be setup for pushing and pulling commits

## How to use

### Setup with existing project

- Open the collection overview of the existing project.
- Click on `Create` and in the dropdown choose `Configure project`

![](https://cdn.discordapp.com/attachments/693228572286124085/1090742892953354372/Screenshot_2023-03-29_225814.png)

- Now choose a folder
- You can init a git repository in the choosen folder or manualy in a parent folder.
  - The git repository is fully optional. You can just this plugin for importing and exporting

### Import project from git

- Click the `git` symbol in the left sidebar

![](https://cdn.discordapp.com/attachments/693228572286124085/1090742892311625821/Screenshot_2023-03-29_225628.png)

- Choose the folder with the `project.json` file
- Data will be importet and Insomnia will be restartet

### New buttons refence

This plugins injects new Buttons into the Insomnia ui.

- Top left in project overview:
  - `git`-Button allowes to open a folder with an `project.json` from an exported project and import it into Insomnia
- Create dropdown
  - `Export Project` export the project and all its workspaces into the configured folder
  - `Import Project` import data from configured folder and update all workspaces, Requests etc.
  - `Configure project` Open a dialog to configure the project.
  - `Commit changes` exports the project data and commits it
  - `Push` push all commits to the current remote branch
  - `Fetch` fetch new commits from the remote repository
  - `Pull` pull new commits from current remote branch
- Inside the workspace dropdown
  - `Export workspace to Git` export just this workspace into the configured folder
  - `Import workspace from Git` import just this workspace from the configured folder

## TODO

- UI for Resolving Merge-Conflicts
