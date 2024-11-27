// References:
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components


import React from 'react';

type ObservationValue = {
    observation_value_id: number;
    field: number;
    value: string;
};

type Observation = {
    observation_id: number;
    created_at: string;
    observation_values: ObservationValue[];
};

interface DisplayObservationsProps {
    observations: Observation[];
}


export default function DisplayObservations({observations,}: DisplayObservationsProps) {
    return (
        <div className="container observations">
            <h3>Observations</h3>
            {observations.length > 0 ? (
                <div>
                <p style={{ fontWeight: 'bold' }}>Total Observations: {observations.length}</p>
                <table className="observations-table">
                    <thead>
                        <tr>
                            <th>Observation ID</th>
                            <th>Created At</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {observations.map((observation) => (
                            <tr key={observation.observation_id}>
                                <td>{observation.observation_id}</td>
                                <td>{new Date(observation.created_at).toLocaleString()}</td>
                                <td>
                                    {observation.observation_values
                                        .map((value) => `${value.value}`)
                                        .join(', ')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            ) : (
                <p>No observations available.</p>
            )}
        </div>
    );
}
