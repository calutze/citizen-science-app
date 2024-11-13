'use client';

import Link from 'next/link';

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

export default function Page() {
    // this component is the users account page. will eventually have functionality to click a make new project button, explore current projects, and look at observations.
    let project_list = dummyProjects

    function getList() {
        // TODO: call backend and get the list of projects from the user
    }

    try {
        localStorage.setItem("projects", JSON.stringify(project_list))
    } catch (error) {}

    return (
    <div className="accountPage">
        <p>Project List</p>
        {project_list.map(function(project, index){
            return (<div className="projectCard">
                <p>{project.title}</p>
                <p>Project code: {project.project_code}</p>
                <p>{project.description}</p>
                <Link href={{
                    pathname: '/account/project',
                    query: {
                        index: index.toString()
                    }
                }}>Edit Project</Link>
            </div>)
        })}
    </div>
    )
}