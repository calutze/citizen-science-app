'use client';

import { projectEntrypointsSubscribe } from 'next/dist/build/swc/generated-native';
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function Project() {
    const router = useRouter()
    const searchParams = useSearchParams()
    let chosen_project = searchParams.get('index')
    let projectList
    let project

    try {
        projectList = localStorage.getItem("projects")
    } catch (error) {}

    if (projectList) {
        projectList = JSON.parse(projectList)
        if (chosen_project) {
            project = projectList[parseInt(chosen_project)]
        }
    }

    return (
        project ? (
            <div>
                <p>Project Number: {project.project_code}</p>
                <p>{project.title}</p>
                <p>{project.description}</p>
                <p>{project.instructions}</p>
                <button>Data Visualization</button>
                <button>Edit Observation Form</button>
            </div>
        ) : (
            <p>Oops! Did you pick a project from the list?</p>
        )
    )
}