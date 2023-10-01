# Git integration for Insomnia

# ⚠️ THIS PLUGIN DOES NOT WORK WITH INSOMNIA VERSION 8 OR HIGHER

Since Insomnia update 8 all data is saved in the cloud and cannot be accessed by
this plugin. Use version 2023.5.8 of Insomnia, if you still want to use this
Plugin. I would highly recommend switching to another API-Client like
[bruno](https://github.com/usebruno/bruno).
---

Insomnia plugin for exporting and importing insomnia Projects into Git
repositories.

⚠️ This plugin accesses Insomnia data directly. It is recommended to back up
Insomnia data before using it. Insomnia may introduce changes that break this
Plugins functionality. If you have problems after an Update, please create a new
issue.

## Features

- Export and import Insomnia projects
- Manage projects with git, without leaving Insomnia (Pull, Push, Commit)

## Requirements

- `git` must be installed
- Credentials must be setup for pushing and pulling

## How to use

### Setup with existing project

- This plugin does not work with the default `Insomnia` project, you must create a other project.
- Open the collection overview of the existing project.
- Click the plus on the top right and in the dropdown choose `Configure project`

![](https://cdn.discordapp.com/attachments/321212401158717440/1147266012811624539/Screenshot_2023-09-01_220920.png)

- In the dialog, you can now choose a folder to where your project data should be saved
- You can init a git repository in the choosen folder or manualy create/use one from a parent folder.
  - The git repository is fully optional. You can just this plugin for importing and exporting your project data

![](https://cdn.discordapp.com/attachments/321212401158717440/1147266013033943220/Screenshot_2023-09-01_221009.png)

### Import project from git

- Click on the `git` symbol in the left sidebar

![](https://cdn.discordapp.com/attachments/321212401158717440/1147266013298171914/Screenshot_2023-09-01_221043.png)

- Choose a folder with the plugins `project.json` file
- The project will be importet and Insomnia will restart

### New buttons refence

This plugins injects new Buttons into the Insomnia ui.

- Top left in project overview:
  - `git`-Button allowes to open a folder with an `project.json` from an exported project and import it into Insomnia
- Create dropdown
  - `Export Project` export the project and all its workspaces into the configured folder
  - `Import Project` import data from configured folder, Insomnia will restart for this
  - `Configure project` Open a dialog to configure the project.
  - `Commit changes` exports the project data and commits it
  - `Push` push all commits to the current remote branch
  - `Fetch` fetch new commits from the remote repository
  - `Pull` pull new commits from current remote branch
- Inside the workspace dropdown
  - `Export workspace to Git` export just this workspace into the configured folder
  - `Import workspace from Git` import just this workspace from the configured folder

## TODO

- UI for resolving merge conflicts

## Development

Requirements
- nodejs
- yarn

Clone the repostitory and add the path to the additional plugin path (Settings > General > Additional Plugin Path)

Use `yarn run watch` to auto rebuild the project when changes are made.

Use `npx eslint src --ext .ts,.tsx --fix` to execute eslint
