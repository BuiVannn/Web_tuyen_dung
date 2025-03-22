import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalaryComparison = ({ jobTitle, industry, location, currentSalary }) => {
    const [marketData, setMarketData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Giả lập dữ liệu thị trường - trong ứng dụng thật, bạn sẽ fetch từ API
    useEffect(() => {
        // Giả lập API call
        setTimeout(() => {
            // Tạo dữ liệu mẫu dựa trên các tham số
            const data = [
                {
                    name: 'Mức thấp',
                    salary: currentSalary * 0.7,
                },
                {
                    name: 'Trung bình ngành',
                    salary: currentSalary * 0.9,
                },
                {
                    name: `${jobTitle}`,
                    salary: currentSalary,
                    current: true
                },
                {
                    name: 'Cao nhất',
                    salary: currentSalary * 1.3,
                },
            ];

            setMarketData(data);
            setLoading(false);
        }, 1000);
    }, [jobTitle, industry, location, currentSalary]);

    const formatSalary = (value) => {
        return `${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">So sánh mức lương {jobTitle}</h2>
            <div className="flex flex-col mb-4">
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ngành: {industry}</span>
                    <span className="text-sm text-gray-500">Khu vực: {location}</span>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={marketData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={value => `${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip formatter={(value) => formatSalary(value)} />
                        <Legend />
                        <Bar
                            dataKey="salary"
                            name="Mức lương"
                            fill="#8884d8"
                            radius={[4, 4, 0, 0]}
                            barSize={60}
                            fill={(entry) => entry.current ? '#4f46e5' : '#a5b4fc'}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-1">Đánh giá</h3>
                <p className="text-sm text-gray-700">
                    Mức lương của bạn
                    {currentSalary >= marketData[2].salary * 1.1
                        ? ' cao hơn 10% so với mức trung bình của ngành.'
                        : currentSalary <= marketData[1].salary
                            ? ' thấp hơn mức trung bình của ngành.'
                            : ' nằm trong khoảng trung bình của ngành.'}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                    Dựa trên dữ liệu thị trường mới nhất và 500+ mẫu lương cho vị trí này.
                </p>
            </div>
        </div>
    );
};

export default SalaryComparison;