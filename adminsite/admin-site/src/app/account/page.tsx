'use client';

// dummy projects until it gets connected to the database
let dummyProjects = [
    {
        project_code: "12345",
        title: "Grow a plant",
        description: "grow a plant and measure results",
        instructions: "step 1: blah, step 2: blah blah"
    },
    {
        project_code: "8675309",
        title: "Average weight of an apple",
        description: "Weigh a few apples and record their weights and we'll plot all of them and find the average",
        instructions: "step 1: blah, step 2: blah blah"
    }
]

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

export default function Page() {
    // this component is the users account page. will eventually have functionality to click a make new project button, explore current projects, and look at observations.
    const router = useRouter()

    function makeCard(project: any) {
        // make the project cards
        let projectCard = document.createElement('div')
        projectCard.className = 'projectCard'

        // create elements
        let projectTitle = document.createElement('p')
        let projectCode = document.createElement('p')
        let projectDesc = document.createElement('p')
        let projectButton = document.createElement('button')

        // give them classes
        projectTitle.className = 'projectTitle'
        projectCode.className = 'projectCode'
        projectDesc.className = 'projectDesc'
        projectButton.className = 'projectButton'

        // put information in elements
        projectTitle.innerText = project.title
        projectCode.innerText = "Project code: " + project.project_code
        projectDesc.innerText = project.description
        projectButton.innerText = "Edit Project"
        projectButton.onclick = () => {router.push('/account/project?project_id='+project.project_id)}

        // append all info to card
        projectCard.appendChild(projectTitle)
        projectCard.appendChild(projectCode)
        projectCard.appendChild(projectDesc)
        projectCard.appendChild(projectButton)

        // return card
        return projectCard
    }

    async function getList() {
        // make the request
        const listHeader = new Headers();
        listHeader.append("Content-Type", "application/json");

        let listRequest = new Request('https://capstone-deploy-production.up.railway.app/user-projects', {
            method: "GET",
            credentials: "include",
            headers: listHeader
        })

        // call the server for the project list
        try {
            let listResponse = await fetch(listRequest)
            if (!listResponse.ok) {
                throw new Error(`Response status: ${listResponse.status}`)
            } else {
                let listOfProjects = await listResponse.json() // put the json object here.
                let divToAppend = document.getElementById('projectList')
                // if the length exists run through the array and put each of them in the make card function then append them to the project list div
                if (listOfProjects && divToAppend) {
                    divToAppend.innerHTML = ""
                    for (const project in listOfProjects) {
                        let projectCard = makeCard(listOfProjects[project])
                        divToAppend.append(projectCard)
                    }
                }
                // else print some kind of no current project message
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    useEffect(() => {getList()})

    return (
    <div className="accountPage">
        <p>Projects</p>
        <Link href="/account/create" className= "newProjectButton">Create a new project</Link>
        <p>Project List</p>
        <div className="projectList" id="projectList">

        </div>
    </div>
    )
}