'use client';

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Project() {
    const searchParams = useSearchParams()
    const chosen_project = searchParams.get('project_id')

    async function getProject() {
        // make the request
        const projectHeader = new Headers();
        projectHeader.append("Content-Type", "application/json");

        const projectRequest = new Request('https://capstone-deploy-production.up.railway.app/project/' + chosen_project,{
            method: "GET",
            credentials: "include",
            headers: projectHeader
        })

        // grab the project info from the server
        try {
            const projectResponse = await fetch(projectRequest)
            if (!projectResponse.ok) {
                throw new Error(`Response status: ${projectResponse.status}`)
            } else {
                // grab the information
                let projectGrabbed = await projectResponse.json()
                projectGrabbed = projectGrabbed.project
                // put the information in the ptags
                const numberP = document.getElementById('number')
                const titleP = document.getElementById('title')
                const descriptionP = document.getElementById('description')
                const instructionsP = document.getElementById('instructions')

                if (numberP && titleP && descriptionP && instructionsP) {
                    numberP.innerHTML = "Project Number: " + projectGrabbed.project_code
                    titleP.innerHTML = projectGrabbed.title
                    descriptionP.innerHTML ="Description: " + projectGrabbed.description
                    instructionsP.innerHTML = "Instructions: " + projectGrabbed.instructions
                }
            }
        } catch (error: any) {
            console.error(error.message)
        }

    }

    useEffect(() => {getProject()})

    return (
        chosen_project ? (
            <div className="projectDetails">
                <p id='number'>Project Number:</p>
                <p id='title'></p>
                <p id='description'></p>
                <p id='instructions'></p>
                <button>Data Visualization</button>
                <Link href={{ pathname: "/account/form",
                    query: { project_id: Number(chosen_project) }
                }}><button>Observation Form</button></Link>
            </div>
        ) : (
            <p>Oops! Did you pick a project from the list?</p>
        )
    )
}