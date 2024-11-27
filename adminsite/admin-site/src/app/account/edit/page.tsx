'use client';

import {useState } from 'react'
import {useRouter, useSearchParams} from 'next/navigation'

export default function Page() {
    const [projectData, setProjectData] = useState({
        project_code: "",
        title: "",
        description: "",
        instructions: ""
    })

    const searchParams = useSearchParams()
    const chosen_project = searchParams.get('project_id')

    const router = useRouter()

    async function updateProject(event: any) {
        event.preventDefault()

        // create request
        const editProjectHeader = new Headers();
        editProjectHeader.append("Content-Type", "application/json");

        const editProjectRequest = new Request("https://capstone-deploy-production.up.railway.app/update-project/" + chosen_project, {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(projectData),
            headers: editProjectHeader
        })
        // try and contact server to change the project
        try {
            const editProjectResponse = await fetch(editProjectRequest);
            if (!editProjectResponse.ok) {
                if (editProjectResponse.status === 500) {
                    const codeMatch = document.getElementById('codeMatch')
                    if (codeMatch) {
                        codeMatch.style.display = 'block'
                    }
                }
                throw new Error(`Response status: ${editProjectResponse.status}`);
            } else {
                router.push('/account');
            }
        } catch (error: any) {
            console.error(error.message);
        }
    }

    return (
        <div className="editProject">
            <form onSubmit={updateProject}>
            <h2>Edit your Project</h2>
            <p style={{ textAlign: "center" }}>Please fill out the form below to edit your project.</p>
                <label className="inputLabel">
                    Project Code
                    <input id="projectCode" className="inputBox" type="text" name="" value={projectData.project_code} onChange={(e) => setProjectData({...projectData, project_code: e.target.value})} required/>
                </label>
                <label className="inputLabel">
                    Project Title
                    <input id="projectTitle" className="inputBox" type="text" name="" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} required/>
                </label>
                <label className="inputLabel">
                    Project Description
                    <input id="projectDescription" className="inputBox" type="text" name="" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} required/>
                </label>
                <label className="inputLabel">
                    Instructions
                    <input id="projectInstructions" className="inputBox" type="text" name="" value={projectData.instructions} onChange={(e) => setProjectData({...projectData, instructions: e.target.value})} required/>
                </label>
                <p id="codeMatch" style={{display: 'none'}}>Project code must be unique.</p>
                <button className="submitButton" type="submit">
                Submit
                </button>
            </form>
        </div>
    )
}