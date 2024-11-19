'use client';

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Project() {
    const router = useRouter()
    const searchParams = useSearchParams()
    let chosen_project = searchParams.get('project_id')
    let projectList
    let project

    async function getProject() {
        // make the request
        const projectHeader = new Headers();
        projectHeader.append("Content-Type", "application/json");

        let projectRequest = new Request('https://capstone-deploy-production.up.railway.app/project/' + chosen_project,{
            method: "GET",
            credentials: "include",
            headers: projectHeader
        })

        // grab the project info from the server
        try {
            let projectResponse = await fetch(projectRequest)
            if (!projectResponse.ok) {
                throw new Error(`Response status: ${projectResponse.status}`)
            } else {
                // grab the information
                let projectGrabbed = await projectResponse.json()
                projectGrabbed = projectGrabbed.project
                // put the information in the ptags
                let numberP = document.getElementById('number')
                let titleP = document.getElementById('number')
                let descriptionP = document.getElementById('number')
                let instructionsP = document.getElementById('number')

                if (numberP && titleP && descriptionP && instructionsP) {
                    numberP.innerHTML = "Project Number: " + projectGrabbed.project_code
                    titleP.innerHTML = projectGrabbed.title
                    descriptionP.innerHTML = projectGrabbed.description
                    instructionsP.innerHTML = projectGrabbed.instructions
                }
            }
        } catch (error: any) {
            console.error(error.message)
        }

    }

    useEffect(() => {getProject()})

    return (
        chosen_project ? (
            <div>
                <p id='number'>Project Number:</p>
                <p id='title'></p>
                <p id='description'></p>
                <p id='instructions'></p>
                <button>Data Visualization</button>
                <button>Edit Observation Form</button>
            </div>
        ) : (
            <p>Oops! Did you pick a project from the list?</p>
        )
    )
}