'use client';

import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// register Chart.js components
Chart.register(...registerables);

const ChartComponent = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // fetch projects with observations
                const response = await fetch(
                    'https://capstone-deploy-production.up.railway.app/user-projects-with-observations',
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                if (!response.ok) {
                    console.error(`Error fetching projects with observations: ${response.status}`);
                    alert('Failed to fetch project data.');
                    return;
                }

                const { projects } = await response.json();

                // chart data
                const labels = projects.map((project: any) => project.title);
                const dataValues = projects.map(
                    (project: any) => project.observations?.length || 0
                );

                const ctx = chartRef.current?.getContext('2d');
                if (!ctx) return;
                
                // destroy existing chart
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                // create chart
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Number of Observations',
                                data: dataValues,
                                backgroundColor: '#1f625f66',
                                borderColor: '#1f625f',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                            title: {
                                display: true,
                                text: 'Observations per Project',
                            },
                        },
                    },
                });
            } catch (error) {
                console.error('Error loading chart data:', error);
                alert('An error occurred while loading the chart data.');
            }
        };

        fetchChartData();

        // cleanup component
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="chart-container">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ChartComponent;
