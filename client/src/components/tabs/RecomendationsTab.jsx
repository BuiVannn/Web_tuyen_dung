import React from 'react';

const RecommendationsTab = ({ jobs }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Việc làm phù hợp với bạn</h2>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">{job.title}</h3>
                                <p className="text-gray-600">{job.company}</p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <span className="flex items-center mr-4">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {job.location}
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {job.salary}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-sm font-medium mb-1 text-green-600">{job.matchScore}% phù hợp</div>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${job.matchScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition">
                                Ứng tuyển ngay
                            </button>
                            <button className="text-gray-600 flex items-center text-sm hover:text-gray-900">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Lưu
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationsTab;