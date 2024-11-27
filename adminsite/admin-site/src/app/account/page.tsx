'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import ChartComponent from './ui/chart_component';


export default function Page() {
    // this component is the users account page. will eventually have functionality to click a make new project button, explore current projects, and look at observations.
    const router = useRouter()

    function makeCard(project: any) {
        // make the project cards
        const projectCard = document.createElement('div')
        projectCard.className = 'projectCard'

        // create elements
        const projectTitle = document.createElement('p')
        const projectCode = document.createElement('p')
        const projectDesc = document.createElement('p')
        const projectButton = document.createElement('button')

        // give them classes
        projectTitle.className = 'projectTitle'
        projectCode.className = 'projectCode'
        projectDesc.className = 'projectDesc'
        projectButton.className = 'projectButton'

        // put information in elements
        projectTitle.innerText = project.title
        projectCode.innerText = "Project code: " + project.project_code
        projectDesc.innerText = project.description
        projectButton.innerText = "View Project"
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

        const listRequest = new Request('https://capstone-deploy-production.up.railway.app/user-projects', {
            method: "GET",
            credentials: "include",
            headers: listHeader
        })

        // call the server for the project list
        try {
            const listResponse = await fetch(listRequest)
            if (!listResponse.ok) {
                throw new Error(`Response status: ${listResponse.status}`)
            } else {
                const listOfProjects = await listResponse.json() // put the json object here.
                const divToAppend = document.getElementById('projectList')
                // if the length exists run through the array and put each of them in the make card function then append them to the project list div
                if (listOfProjects && divToAppend) {
                    divToAppend.innerHTML = ""
                    for (const project in listOfProjects) {
                        const projectCard = makeCard(listOfProjects[project])
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
        <h1>Projects Dashboard</h1>
        <h4>Manage all your projects here.</h4>

        <div className='chartSection'>
            <ChartComponent />
        </div>
        <br/>
        {/* <h2>Projects</h2> */}
        <Link href="/account/create" className= "newProjectButton">Create New Project</Link>
        <div className="projectList" id="projectList"></div>
    </div>
    )
}