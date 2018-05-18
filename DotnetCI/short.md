# Continuous Integration with three steps - build, test, deploy

Hi guys! Today we will learn how to setup Continuous Integration process for our own GitHub repository. This is very easy and even free. You will need

* [GitHub account](https://github.com)
* [.NET Core SDK > 2.1.](https://www.microsoft.com/net/)
* [Visual Studio 2017](https://www.visualstudio.com/)
* [Azure account](https://portal.azure.com/) - optional

Lets start.

## Start new project

Create new repository on GitHub and clone it locally. Don't forget to select .gitignore file template for VisualStudio to keep your repository clean and nice. Than generate new .NET core web application with

```cmd
dotnet new sln --name CIDemo
md web
cd web
dotnet new web
cd..
dotnet sln CIDemo.sln add web/web.csproj
```

Commit your changes directly to master and push them to the remote.

## CI Build

Now we will setup first step of the CI process - build check.

Go to the [Travis](https://travis-ci.org/) and login with GitHub account. Give Travis access to your repository.

Go back to the repostory, create new branch CIBuild and add .travis.yml file to the root of the folder

``` text
language: csharp

dotnet: 2.1.4
sudo: false

env:
    global:
        - DOTNET_CLI_TELEMETRY_OPTOUT: 1

script:
    - dotnet build CIDemo.sln -c Release
```

were:

* language - your programming language.
* dotnet - version of the required dotnet SDK
* env - environment variables passed to the build process. I've added DOTNET_CLI_TELEMETRY_OPTOUT to [switch off](https://docs.microsoft.com/en-us/dotnet/core/tools/telemetry) telemtry.
* script - commands for Travis.

Commit and push, than make a pull request. Now you should see something like this:

Don't forget to take build badge from the personal cabinet.

## CI Tests

Inside the solution, create new projec test. Add [coverlet.msbuild](https://github.com/tonerdo/coverlet) nuget package to the BllTest project. It will generate code coverage report file.

```cmd
dotnet new xunit --name test
dotnet add test/test.csproj package coverlet.msbuild -v 1.2.0
dotnet sln CIDemo.sln add test/test.csproj
```

Inside web project create new class

```c#
using System;

namespace web
{
    public class IdProvider
    {
        public Guid NewId()
        {
            return Guid.NewGuid();
        }
    }
}
```

Inside the test project create new class

```c#
using web;
using Xunit;

namespace test
{
    public class IdProviderTest
    {
        [Fact]
        public void NewIdShouldReturnUniqueValues()
        {
            var idProvider = new IdProvider();
            var id1 = idProvider.NewId();
            var id2 = idProvider.NewId();

            Assert.NotEqual(id1, id2);
        }
    }
}
```

Update travis.yml file and add this line to the script section:

```text
 - dotnet test -c Release --no-build test/test.c        sproj /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

Go to the [Codecov](https://codecov.io), login with your GitHub account and give access to your repository.

Add this to the end of the .travis.yml file

```text
    after_script:
        - bash <(curl -s https://codecov.io/bash)
```

Commit and push. Now you should see something like this

### CI Deploy

Login to [Azure](https://portal.azure.com) and create new site with this link
[link](https://portal.azure.com/#create/Microsoft.WebSite). Specify site name, subscription and OS.

Go back to the repository. Add two new files to the root of the project

* [.deployment](https://github.com/Drag13/FSharpWebAppWithCIDemo/blob/master/.deployment) // describes deployment steps
* [build.cmd](https://github.com/Drag13/FSharpWebAppWithCIDemo/blob/master/build.cmd)   // describe deployment process

After adding this files, go back to Azure and select your site. Than select DeploymentOptions -> Github -> Project -> Branch. After this your remote repository will be synced with github and a few minutes later - deployed. 

Well done, CI is ready.

## Usefull Links

* [.NET Core SDK > 2.1.](https://www.microsoft.com/net/)
* [GitHub](https://github.com)
* [Git](https://git-scm.com/downloads)
* [Travis-ci](https://travis-ci.org)
* [TravisDocumentation](https://docs.travis-ci.com/)
* [Codecov](https://codecov.io)
* [Azure](https://portal.azure.com)
* [DemoRepository](https://github.com/Drag13/FSharpWebAppWithCIDemo)
