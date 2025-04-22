import React, { useState, useEffect } from 'react';
import { AlertCircle, Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const JobPostSuggestion = ({ companyData }) => {
    const [jobRole, setJobRole] = useState('Frontend Developer');
    const [jobLevel, setJobLevel] = useState('Mid-Level');
    const [includeBenefits, setIncludeBenefits] = useState(true);
    const [includeQualifications, setIncludeQualifications] = useState(true);
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(true);

    // Job roles options
    const jobRoles = [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'UI/UX Designer',
        'Product Manager',
        'DevOps Engineer',
        'Data Scientist',
        'Marketing Specialist',
        'Sales Representative',
        'Customer Support Specialist'
    ];

    // Experience levels
    const experienceLevels = [
        'Entry-Level',
        'Junior',
        'Mid-Level',
        'Senior',
        'Lead',
        'Manager'
    ];

    // Template for different job roles
    const templates = {
        'Frontend Developer': {
            description: `We are looking for a talented Frontend Developer to join our team at ${companyData?.name || 'our company'}. You will be responsible for implementing visual elements that users see and interact with in a web application.`,
            responsibilities: [
                "Develop new user-facing features using React.js",
                "Build reusable components and front-end libraries for future use",
                "Translate designs and wireframes into high-quality code",
                "Optimize components for maximum performance across devices and browsers",
                "Collaborate with back-end developers and designers"
            ],
            qualifications: [
                "Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model",
                "Thorough understanding of React.js and its core principles",
                "Experience with popular React.js workflows (such as Redux)",
                "Familiarity with RESTful APIs and modern authorization mechanisms",
                "Knowledge of modern front-end build pipelines and tools"
            ],
            benefits: [
                "Competitive salary and equity options",
                "Health, dental, and vision insurance",
                "Flexible work schedule and remote work options",
                "Professional development opportunities",
                "Collaborative, inclusive work environment"
            ]
        },
        'Backend Developer': {
            description: `${companyData?.name || 'Our company'} is seeking an experienced Backend Developer to design, build, and maintain efficient, reusable, and reliable server-side code.`,
            responsibilities: [
                "Design and implement robust, scalable API services",
                "Write clean, maintainable, and efficient code",
                "Integrate user-facing elements with server-side logic",
                "Implement security and data protection measures",
                "Optimize applications for maximum performance"
            ],
            qualifications: [
                "Strong proficiency with server-side languages such as Node.js, Python, or Java",
                "Solid understanding of database technology (SQL, NoSQL)",
                "Experience with cloud services (AWS, GCP, or Azure)",
                "Knowledge of modern authorization mechanisms",
                "Understanding of fundamental design principles for scalable applications"
            ],
            benefits: [
                "Competitive salary package",
                "Comprehensive health benefits",
                "Flexible working hours",
                "Remote work options",
                "Continuous learning and career growth opportunities"
            ]
        }
        // Add more templates as needed
    };

    // Generate description based on selections
    useEffect(() => {
        generateDescription();
    }, [jobRole, jobLevel, includeBenefits, includeQualifications]);

    const generateDescription = () => {
        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            try {
                // Get the template for selected role or default to Frontend Developer
                const template = templates[jobRole] || templates['Frontend Developer'];

                // Adjust description based on level
                let levelAdjustedDesc = template.description.replace(/an experienced|a talented/i, `a ${jobLevel}`);

                // Build the full description
                let fullDescription = `${levelAdjustedDesc}\n\n`;
                fullDescription += "## Responsibilities\n";

                template.responsibilities.forEach(resp => {
                    fullDescription += `- ${resp}\n`;
                });

                if (includeQualifications) {
                    fullDescription += "\n## Qualifications\n";
                    template.qualifications.forEach(qual => {
                        fullDescription += `- ${qual}\n`;
                    });
                }

                if (includeBenefits) {
                    fullDescription += "\n## Benefits\n";
                    template.benefits.forEach(benefit => {
                        fullDescription += `- ${benefit}\n`;
                    });

                    // Add company-specific benefits if available
                    if (companyData?.benefits && companyData.benefits.length > 0) {
                        companyData.benefits.forEach(benefit => {
                            if (!template.benefits.includes(benefit)) {
                                fullDescription += `- ${benefit}\n`;
                            }
                        });
                    }
                }

                // Add company information if available
                if (companyData?.description) {
                    fullDescription += `\n## About ${companyData.name}\n`;
                    fullDescription += companyData.description;
                }

                setGeneratedDescription(fullDescription);
                setLoading(false);
            } catch (error) {
                console.error("Error generating description:", error);
                setGeneratedDescription("Error generating job description. Please try again.");
                setLoading(false);
            }
        }, 1000);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedDescription);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center">
                    <AlertCircle className="text-blue-600 mr-2" size={20} />
                    <h3 className="font-medium text-gray-800">AI Job Post Generator</h3>
                </div>
                {expanded ?
                    <ChevronUp className="text-gray-500" size={20} /> :
                    <ChevronDown className="text-gray-500" size={20} />
                }
            </div>

            {expanded && (
                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Quickly generate professional job descriptions tailored to your company profile. Customize the options below to get started.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
                            <select
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-2 px-3 border"
                            >
                                {jobRoles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                            <select
                                value={jobLevel}
                                onChange={(e) => setJobLevel(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-2 px-3 border"
                            >
                                {experienceLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="includeBenefits"
                                checked={includeBenefits}
                                onChange={(e) => setIncludeBenefits(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="includeBenefits" className="ml-2 block text-sm text-gray-700">
                                Include Benefits
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="includeQualifications"
                                checked={includeQualifications}
                                onChange={(e) => setIncludeQualifications(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="includeQualifications" className="ml-2 block text-sm text-gray-700">
                                Include Qualifications
                            </label>
                        </div>
                    </div>

                    <div className="relative mt-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={handleCopyToClipboard}
                                    className={`p-2 rounded-md ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    title="Copy to clipboard"
                                >
                                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto pr-10">
                                    {generatedDescription}
                                </pre>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => generateDescription()}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                            Regenerate
                        </button>
                        <button
                            onClick={() => window.location.href = '/dashboard/add-job'}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                            Use This Description
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPostSuggestion;