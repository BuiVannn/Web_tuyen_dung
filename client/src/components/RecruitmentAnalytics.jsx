import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const RecruitmentAnalytics = ({ data }) => {
    // Fallback data if no real data is available
    const fallbackApplicationsData = [
        { name: 'Week 1', applications: 8 },
        { name: 'Week 2', applications: 12 },
        { name: 'Week 3', applications: 7 },
        { name: 'Week 4', applications: 15 }
    ];

    const fallbackViewsData = [
        { name: 'Week 1', views: 45 },
        { name: 'Week 2', views: 63 },
        { name: 'Week 3', views: 38 },
        { name: 'Week 4', views: 72 }
    ];

    const fallbackConversionData = [
        { name: 'Frontend Dev', value: 28 },
        { name: 'UI Designer', value: 20 },
        { name: 'Project Manager', value: 15 },
        { name: 'DevOps Engineer', value: 12 }
    ];

    const fallbackSkillsData = [
        { name: 'React', count: 25 },
        { name: 'JavaScript', count: 18 },
        { name: 'Node.js', count: 12 },
        { name: 'SQL', count: 10 },
        { name: 'Python', count: 8 }
    ];

    // Use real data from props if available, otherwise use fallback data
    const applicationsData = data?.applications?.length > 0
        ? data.applications
        : fallbackApplicationsData;

    const viewsData = data?.jobViews?.length > 0
        ? data.jobViews
        : fallbackViewsData;

    const conversionData = data?.conversionByJob?.length > 0
        ? data.conversionByJob
        : fallbackConversionData;

    const skillsData = data?.topSkills?.length > 0
        ? data.topSkills
        : fallbackSkillsData;

    // Colors for the pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications Over Time */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-medium mb-4">Applications Over Time</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={applicationsData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="applications"
                                    stackId="1"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Job Views Trend */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-medium mb-4">Job Views Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={viewsData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#4f46e5"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications by Job */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-medium mb-4">Applications by Job</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={conversionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {conversionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Skills in Demand */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="text-gray-700 font-medium mb-4">Top Skills in Demand</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={skillsData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#82ca9d" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentAnalytics;