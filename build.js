const execSync = require('child_process').execSync;
const arguments = process.argv.splice(2);
const releaseType = arguments[0].toUpperCase();

var packageJson = require('./package.json');

switch(releaseType){
    case "MAJOR":
	case "MINOR":
	case "PATCH":
		console.log(`============== Starting ${releaseType} release of ${packageJson.name} ==============`);
		break;
    default: 
		console.log("Only 'MAJOR', 'MINOR' and 'PATCH' supported!");
		process.exit(0);
		break;
}

var bumpedVersion;

//STEP [1/5] COMPILATION CHECK
Step_Compile();

//STEP [2/5] INCREMENT PACKAGE VERSION
Step_BumpVersion();

//STEP [3/5] COMMIT CHANGES
Step_Commit();

//STEP [4/5] TAG PACKAGE
Step_Tag();

//STEP [5/5] UPLOAD PACKAGE
Step_Uploading();

console.log(`==============	 Finished ${releaseType} release ${packageJson.name}@${bumpedVersion} ==============`);

function Step_Compile(){
	console.log(`STEP [1/5] COMPILING RELEASE ....`);
	//add check here
}

function Step_BumpVersion(){
	console.log(`STEP [2/5] BUMPING PACKAGE VERSION ....`);
	const releaseTypeLowerCase = releaseType.toLowerCase();
	execSync(`(npm version ${releaseTypeLowerCase} --no-git-tag-version)`, { stdio:[0, 1, 2] });
	
	const packageVersion = packageJson.version; 
	packageJson = JSON.parse(require('fs').readFileSync('package.json', 'utf8'))
	bumpedVersion = packageJson.version
	console.log(`- Bumped package.json version ${packageVersion} -> ${bumpedVersion}`);
}

function Step_Commit(){
	console.log(`STEP [3/5] COMMITING CHANGES TO GIT ....`);
	execSync(`(git add -A && git commit -m \"[RELEASE][${releaseType}] ${packageJson.name}@${bumpedVersion}\")`, { stdio:[0, 1, 2] });
}

function Step_Tag(){
	console.log(`STEP [4/5] TAGGING PACKAGE ....`);
	var tag = `v${bumpedVersion}${packageJson.name}`;
	execSync(`(git tag -a ${tag} -m \"Tag for ${releaseType} release of module ${packageJson.name}\") & git log -1 --stat --oneline`, { stdio:[0, 1, 2] });
	console.log(`- Created tag: ${packageJson.name}@${packageJson.version}`)
}

function Step_Uploading(){
	console.log(`STEP [5/5] UPLOADING CHANGES/TAGS TO GITHUB ....`);
}

