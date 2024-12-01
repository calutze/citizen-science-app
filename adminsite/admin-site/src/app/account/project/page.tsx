'use client';

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DisplayObservations from '../ui/display_observations_component';
import { API_URL } from '@/constants/api';

export default function Project() {
    const searchParams = useSearchParams()
    const chosen_project = searchParams.get('project_id')

    const router = useRouter()

    const [observations, setObservations] = useState([])
    const [hasForm, setHasForm] = useState(true)

    async function getProject() {
        // make the request
        const projectHeader = new Headers();
        projectHeader.append("Content-Type", "application/json");

        const projectRequest = new Request(`${API_URL}/project/` + chosen_project,{
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
                    titleP.innerHTML = projectGrabbed.title
                    numberP.innerHTML = "<span style='font-weight: bold;'>Project Number:</span> " + projectGrabbed.project_code
                    descriptionP.innerHTML ="<span style='font-weight: bold;'>Description:</span> " + projectGrabbed.description
                    instructionsP.innerHTML = "<span style='font-weight: bold;'>Instructions:</span>  " + projectGrabbed.instructions
                }
            }
        } catch (error: any) {
            console.error(error.message)
        }

    }

    async function getForm() {
        // make header
        const formHeader = new Headers();
        formHeader.append("Content-Type", "application/json");

        // create request
        const formRequest = new Request(`${API_URL}/form/` + chosen_project,{
            method: "GET",
            credentials: "include",
            headers: formHeader
        })

        // grab the form
        try {
            const formResponse = await fetch(formRequest)
            if (!formResponse.ok) {
                if (formResponse.status === 404) {
                    setHasForm(false);
                } else {
                    throw new Error(`Response status: ${formResponse.status}}`)
                }
            } else {
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    async function getObservations() {
        // make header
        const observationHeader = new Headers();
        observationHeader.append("Content-Type", "application/json");

        // create request
        const observationRequest = new Request(`${API_URL}/show-observations/` + chosen_project,{
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
                // displays observations
                const data = await observationResponse.json()
                setObservations(data.observations)
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getProject()
        getObservations()
        getForm()
    }, [])

    async function deleteProject() {
        // deletes current project page
        const deleteHeader = new Headers();
        deleteHeader.append("Content-Type", "application/json");

        //create the request
        const deleteRequest = new Request(`${API_URL}/delete-project/` + chosen_project, {
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

    function downloadCSV_helper() {
        if (observations) {
            downloadCSV(observations)
        }
    }

    function downloadCSV(observations: any) {
        // convert to CSV
        let csv_content = "Observation ID, Details\n"

        const observation_csv = observations.map((observation: any) => {
            const ob_id = observation["observation_id"]
            const ob_values = observation["observation_values"].map((value: any) => `${value.value}`).join(" ")
            return ob_id + ', ' + ob_values
        }).join('\n')
        csv_content += observation_csv
        console.log(csv_content)

        // download file
        const csv_file = new Blob([csv_content], { type: 'text/csv'});

        const url = URL.createObjectURL(csv_file);

        const download = document.createElement('a');

        download.href = url;
        download.download = 'download.csv';

        download.click();
    }

    return (
        chosen_project ? (
            <div className="projectDetails">
                <h2>Project Details</h2>
                <div className="container">
                    <h3 id='title'></h3>
                    <p id='number'>Project Number:</p>
                    <p id='description'></p>
                    <p id='instructions'></p>
                    { hasForm
                        ? <Link href={{ pathname: "/account/form",
                            query: { project_id: Number(chosen_project), edit: true }
                        }}><button className="projectButton">Edit Observation Form</button></Link>
                        : <Link href={{ pathname: "/account/form",
                            query: { project_id: Number(chosen_project), edit: false }
                        }}><button className="projectButton">Create Observation Form</button></Link>
                    }
                    <Link href={{ 
                        pathname: '/account/edit',
                        query: {project_id: Number(chosen_project)}
                        }}>
                    <button className="projectButton">Edit Project</button></Link>

                    <button className="projectButton" onClick={downloadCSV_helper}>Observation CSV file</button>

                    <button id="deleteProject" className="projectButton" onClick={deleteConfirm}>Delete Project</button>
                </div>

                <DisplayObservations observations={observations} />

            </div>
        ) : (
            <p>Oops! Did you pick a project from the list?</p>
        )
    )
}