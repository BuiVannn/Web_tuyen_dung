import React from 'react';

const ResumeTab = ({ userData }) => {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Kinh nghiệm làm việc</h2>
                <div className="space-y-6">
                    {userData.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-4 ml-2">
                            <div className="flex justify-between">
                                <h3 className="font-medium text-gray-900">{exp.position}</h3>
                                <span className="text-sm text-gray-500">{exp.duration}</span>
                            </div>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="mt-2 text-gray-700">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Học vấn</h2>
                <div className="space-y-6">
                    {userData.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-green-500 pl-4 ml-2">
                            <div className="flex justify-between">
                                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                                <span className="text-sm text-gray-500">{edu.year}</span>
                            </div>
                            <p className="text-gray-600">{edu.school}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4">Dự án</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.projects.map((project, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                            <h3 className="font-medium text-gray-900">{project.name}</h3>
                            <p className="text-sm text-blue-600 mb-2">{project.technologies}</p>
                            <p className="text-gray-700">{project.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeTab;