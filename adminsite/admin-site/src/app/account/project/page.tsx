'use client';

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Project() {
    const searchParams = useSearchParams()
    const chosen_project = searchParams.get('project_id')

    const router = useRouter()

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
                // put the information in the p tags
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

    //TODO: once this call is fixed uncomment call in useEffect currently commented for linter

    /*
    async function getObservations() {
        // make header
        const observationHeader = new Headers();
        observationHeader.append("Content-Type", "application/json");

        // create request
        const observationRequest = new Request('https://capstone-deploy-production.up.railway.app/show-observations/' + chosen_project,{
            method: "GET",
            credentials: "include",
            headers: observationHeader
        })

        // grab the observations
        try {
            const observationResponse = await fetch(observationRequest)
            if (!observationResponse.ok) {
                throw new Error(`Response status: ${observationResponse.status}}`)
            } else {
                //TODO: put the observations on screen
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }
        */

    useEffect(() => {
        getProject()
        // getObservations()
    })

    async function deleteProject() {
        // deletes current project page
        const deleteHeader = new Headers();
        deleteHeader.append("Content-Type", "application/json");

        //create the request
        const deleteRequest = new Request('https://capstone-deploy-production.up.railway.app/delete-project/' + chosen_project, {
            method: "DELETE",
            credentials: "include",
            headers: deleteHeader
        })

        //delete the project
        try {
            const deleteResponse = await fetch(deleteRequest)
            if (!deleteResponse.ok) {
                throw new Error(`Response status: ${deleteResponse.status}`)
            } else {
                // if successful navigate back to project list page
                router.push('/account')
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    function deleteConfirm() {
        // changed the button to a confirmation and changes the onclick function to delete project
        const deleteButton = document.getElementById('deleteProject');
        if (deleteButton) {
            deleteButton.innerHTML = "Click again to confirm"
            deleteButton.onclick = deleteProject
        }
    }

    return (
        chosen_project ? (
            <div className="projectDetails">
                <h2>Project Details</h2>
                <div className="container">
                    <p style={{ fontWeight: "bold" }}id='number'>Project Number:</p>
                    <p id='title'></p>
                    <p id='description'></p>
                    <p id='instructions'></p>
                    
                    <Link href={{ pathname: "/account/form",
                        query: { project_id: Number(chosen_project) }
                    }}><button className="projectButton">Create an Observation Form</button></Link>

                    <Link href={{ 
                        pathname: '/account/edit',
                        query: {project_id: Number(chosen_project)}
                        }}>
                    <button className="projectButton">Edit Project</button></Link>

                    <button id="deleteProject" className="projectButton" onClick={deleteConfirm}>Delete Project</button>
                </div>
            </div>
        ) : (
            <p>Oops! Did you pick a project from the list?</p>
        )
    )
}