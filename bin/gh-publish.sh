#!/bin/bash

echo "!!! Make sure you are in the project root before running this script !!!"
echo "Current location: " 
pwd

sleep 3s
echo "Begin Deployment"

ng build --configuration production --base-href="https://mrabhishekshrestha.github.io/website-builder/"
cp -r dist/website-builder/* . 

git add . 
git commit -m "deploy new prod build"
git push 

echo "Deployment complete. Changes should be live in a few minutes. Please check https://github.com/MrAbhishekShrestha/website-builder/settings/pages"