# How to sync your GitHub repository and Azure

## Contents

* Introduction
* Prerequisite
* Start a new project
* First sync with Azure
* Deployment setup
* Conclusion

## Introduction

Today we will learn how to build and deploy your front-end application directly from your GitHub account to the site hosted on Azure.

Actually, there are at least few ways how to do this. First one is to setup continues integration for the project. It is a nice and powerful tool but requires too much time to set-up. So, if you need something simple and quick - this is not for you. The second way is to use Kudu. Today we will learn how to do this.

## Prerequisite

You will need node, npm, git and some front-end project. For this example, I will create new Angular 5 project using @angular/cli. Also, you will need Azure account to host your app. If you don't have it you can create a new account and get some free money just for experiments.

## Start a new project

If you already have any front-end project and all staff mentioned before just skip this step. If no - let's start from the very beginning.

Go to the Github and create a new repository. Then clone it to your local workspace and create there a new  index.html file with any content you want. This is only to check that basic synchronization mechanism works correctly. Commit your index.html and push it to the remote.

## First sync with Azure

Now it is time to sync your repository with Azure. Open [Azure.Portal](portal.azure.com) and create new WebApp. Feel free to select any service plan you want, this doesn't matter right now. When this will be done, select your website and click on "Deployment options" menu. Here you need to pick GitHub as the source, provide your credentials and select the remote repo you want to sync with. After this, Azure will clone your repository, push all files under the wwwroot folder and start serving static files with IIS server. As far as we have the index.html file in the root of the repository it will be given by default and now you should see it.

The simplest sync is done. If you need, you can add some js, images, etc., and all should work just fine. But we can do better.

## Deployment setup

Go back to your local repository and install @angular/cli if you don't have it.

``` language = cmd
npm install -g angular\cli
```

Then switch to your local repository folder and create a new angular project.

``` language = cmd
ng new app
```

Now, jump into app folder and run your new app.

``` language = cmd
npm run ng serve
```

Your application should rise and be testable on [http://localhost:4200](http://localhost:4200) Check this and let's go further.

So, at this step we have the repository, that synced with your WebApp and new Angular 5 project. But if you will commit this right now, you will see your first index.html file. This happens because, by default, Azure only copy files from your repository under and nothing more. So, we need to provide some additional information about our deployment process. Fortunately, it is not hard.

Firstly we need to add to the root file with name .deployment with next text:

``` lang = cmd
[config]
command = build.cmd
```

This will instruct Azure to execute build.cmd file. And there, you can do whatever you want. It is pure command line file that can do almost everything. Isn't this cool? So we can write our own deployment script or modify existed one. But if we will do this manually it will take some time and be not very efficient. So it's time for [Kudu](https://github.com/projectkudu/kudu).Under the hood, Azure uses to sync your code and your publish folder. So we also can use Kudu for our needs. Grab [build.cmd](test) file from my repository and let's take a look at it.

Build.cmd contains few sections.

* Check prerequisitions (node must be installed)
* Set variables most important for us is DEPLOYMENT_TARGET
* Build steps (not defined in original Kudu script)
* Deployment
* Error logging section

So as you see all is quite simple.
What do we need is to create new step to build our project and modify deployment script to put artifacts in the proper place.

Add this after setup step

```lang = cmd
@echo "installing ui dependencies"
cd ./app
call npm install

@echo "building ui"
call npm run build

@echo "returning back to root"
cd ..
```

Just regular and simple code. No magic.
Second and the last step is to modify deployment script. As far as we have no server to serve static, we need to put static under the wwwroot. Just change this one:

``` language = cmd
call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;build.cmd;app;node_modules;"
```

to this one:

``` language = cmd
call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%\dist" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;build.cmd;app;node_modules;"
```

## Conclusion

TBD

[SyncGitAndAzure]