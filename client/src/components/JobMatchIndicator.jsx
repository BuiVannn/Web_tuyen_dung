import React from 'react';
import { MdCheck, MdClose } from 'react-icons/md';

const JobMatchIndicator = ({ jobSkills, candidateSkills, jobTitle, candidateExperience, requiredExperience }) => {
    // Tính toán độ phù hợp của kỹ năng
    const calculateSkillMatch = () => {
        if (!jobSkills || !candidateSkills) {
            return {
                percentage: 0,
                matched: [],
                missing: []
            };
        }

        const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase());
        const candidateSkillsLower = candidateSkills.map(skill => skill.toLowerCase());

        const matchedSkills = jobSkillsLower.filter(skill =>
            candidateSkillsLower.includes(skill)
        );

        const missingSkills = jobSkills.filter(skill =>
            !candidateSkillsLower.includes(skill.toLowerCase())
        );

        return {
            percentage: Math.round((matchedSkills.length / jobSkills.length) * 100),
            matched: matchedSkills,
            missing: missingSkills
        };
    };

    // Tính toán độ phù hợp về kinh nghiệm
    const calculateExperienceMatch = () => {
        const ratio = candidateExperience / requiredExperience;
        if (ratio >= 1.5) return { status: "excellent", text: "Vượt trội" };
        if (ratio >= 1) return { status: "good", text: "Phù hợp" };
        if (ratio >= 0.7) return { status: "fair", text: "Chấp nhận được" };
        return { status: "poor", text: "Chưa đủ" };
    };

    // Tính toán độ phù hợp tổng thể
    const calculateOverallMatch = () => {
        const skillMatch = calculateSkillMatch().percentage;
        const experienceRatio = candidateExperience / requiredExperience;
        const experienceScore = Math.min(experienceRatio * 100, 100);

        // Trọng số: kỹ năng 70%, kinh nghiệm 30%
        const overallScore = Math.round((skillMatch * 0.7) + (experienceScore * 0.3));
        return overallScore;
    };

    const skillMatch = calculateSkillMatch();
    const experienceMatch = calculateExperienceMatch();
    const overallMatch = calculateOverallMatch();

    const getColorClass = (score) => {
        if (score >= 85) return "text-green-600";
        if (score >= 70) return "text-blue-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getProgressColor = (score) => {
        if (score >= 85) return "bg-green-500";
        if (score >= 70) return "bg-blue-500";
        if (score >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Đánh giá sự phù hợp với vị trí {jobTitle}</h2>

            {/* Điểm tổng thể */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="font-semibold">Mức độ phù hợp tổng thể</h3>
                    </div>
                    <div className={`font-bold text-xl ${getColorClass(overallMatch)}`}>
                        {overallMatch}%
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${getProgressColor(overallMatch)}`}
                        style={{ width: `${overallMatch}%` }}
                    ></div>
                </div>
            </div>

            {/* Độ phù hợp về kỹ năng */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Kỹ năng ({skillMatch.percentage}%)</h3>
                    <span className={getColorClass(skillMatch.percentage)}>
                        {skillMatch.matched?.length || 0}/{jobSkills?.length || 0} kỹ năng phù hợp
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                        className={`h-2.5 rounded-full ${getProgressColor(skillMatch.percentage)}`}
                        style={{ width: `${skillMatch.percentage}%` }}
                    ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Kỹ năng đã có:</h4>
                        <ul className="space-y-1">
                            {skillMatch.matched?.map((skill, index) => (
                                <li key={index} className="text-sm flex items-center gap-2">
                                    <MdCheck className="text-green-500" size={18} />
                                    <span>{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Kỹ năng còn thiếu:</h4>
                        <ul className="space-y-1">
                            {skillMatch.missing?.map((skill, index) => (
                                <li key={index} className="text-sm flex items-center gap-2">
                                    <MdClose className="text-red-500" size={18} />
                                    <span>{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Độ phù hợp về kinh nghiệm */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Kinh nghiệm</h3>
                    <span className={`font-medium
            ${experienceMatch.status === "excellent" ? "text-green-600" :
                            experienceMatch.status === "good" ? "text-blue-600" :
                                experienceMatch.status === "fair" ? "text-yellow-600" :
                                    "text-red-600"}`}>
                        {experienceMatch.text}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 flex-1">
                        <p className="text-sm text-gray-500">Yêu cầu</p>
                        <p className="font-medium">{requiredExperience} năm</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2 flex-1">
                        <p className="text-sm text-gray-500">Của bạn</p>
                        <p className="font-medium">{candidateExperience} năm</p>
                    </div>
                </div>
            </div>

            {/* Gợi ý cải thiện */}
            <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Gợi ý cải thiện</h3>
                {skillMatch.missing?.length > 0 ? (
                    <p className="text-sm text-gray-700">
                        Để tăng cơ hội nhận được công việc này, bạn nên phát triển các kỹ năng còn thiếu như:
                        <span className="font-medium"> {skillMatch.missing.join(', ')}</span> .
                    </p>
                ) : (
                    <p className="text-sm text-gray-700">
                        Bạn đã có đầy đủ các kỹ năng cần thiết cho vị trí này. Hãy chú trọng vào việc trình bày các kỹ năng này trong CV và phỏng vấn.
                    </p>
                )}

                {experienceMatch.status === "poor" && (
                    <p className="text-sm text-gray-700 mt-2">
                        Kinh nghiệm của bạn chưa đủ yêu cầu. Bạn có thể nhấn mạnh vào các dự án cá nhân hoặc các kỹ năng bổ sung để bù đắp.
                    </p>
                )}
            </div>
        </div>
    );
};

export default JobMatchIndicator;
