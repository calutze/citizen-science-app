'use client';

import {useState} from 'react'
import {useRouter} from 'next/navigation'

export default function Page() {
    const [projectData, setProjectData] = useState({
        project_code: "UNIQUE CODE",
        title: "Test Project",
        description: "Description goes here",
        instructions: "Project instructions"
    })

    const router = useRouter()

    async function createProject(event: React.FormEvent<HTMLFormElement>) {
        // stop refresh
        event.preventDefault()

        // create the request
        const createProjectHeader = new Headers();
        createProjectHeader.append("Content-Type", "application/json");

        const createProjectRequest = new Request("https://capstone-deploy-production.up.railway.app/add-project",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify(projectData),
            headers: createProjectHeader
        })
        // try and contact server and make project
        try {
            const createProjectResponse = await fetch(createProjectRequest);
            if (!createProjectResponse.ok) {
                throw new Error(`Response status: ${createProjectResponse.status}`);
            } else {
                router.push('/account')
            }
        } catch (error: any) {
            console.error(error.message);
        }
    }

    return (
        <div className="newProject">
            <form onSubmit={createProject}>
                <label>
                    project_code:
                    <input type="text" name="" value={projectData.project_code} onChange={(e) => setProjectData({...projectData, project_code: e.target.value})} required/>
                </label>
                <label>
                    title:
                    <input type="text" name="" value={projectData.title} onChange={(e) => setProjectData({...projectData, title: e.target.value})} required/>
                </label>
                <label>
                    description:
                    <input type="text" name="" value={projectData.description} onChange={(e) => setProjectData({...projectData, description: e.target.value})} required/>
                </label>
                <label>
                    instructions:
                    <input type="text" name="" value={projectData.instructions} onChange={(e) => setProjectData({...projectData, instructions: e.target.value})} required/>
                </label>
                <input className="submitButton" type="submit" />
            </form>
        </div>
    )
}