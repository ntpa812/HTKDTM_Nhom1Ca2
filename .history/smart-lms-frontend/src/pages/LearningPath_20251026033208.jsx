import React, { useState } from 'react';
import { CheckCircleIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const LearningPath = () => {
    const [selectedPath, setSelectedPath] = useState('web-dev');

    const learningPaths = {
        'web-dev': {
            name: 'Web Development',
            progress: 65,
            modules: [
                { id: 1, title: 'HTML & CSS Cơ bản', status: 'completed', duration: '4h', score: 95 },
                { id: 2, title: 'JavaScript ES6+', status: 'completed', duration: '8h', score: 88 },
                { id: 3, title: 'React.js Fundamentals', status: 'in-progress', duration: '12h', progress: 60 },
                { id: 4, title: 'Node.js & Express', status: 'locked', duration: '10h' },
                { id: 5, title: 'Database & MongoDB', status: 'locked', duration: '8h' },
            ]
        },
        'ai-ml': {
            name: 'AI & Machine Learning',
            progress: 40,
            modules: [
                { id: 1, title: 'Python for Data Science', status: 'completed', duration: '6h', score: 92 },
                { id: 2, title: 'Machine Learning Basics', status: 'in-progress', duration: '15h', progress: 45 },
                { id: 3, title: 'Deep Learning với TensorFlow', status: 'locked', duration: '20h' },
                { id: 4, title: 'Natural Language Processing', status: 'locked', duration: '18h' },
            ]
        }
    };

    const currentPath = learningPaths[selectedPath];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Lộ trình học tập cá nhân hóa</h1>
                <p className="text-gray-600 mt-1">Được tạo bởi AI dựa trên năng lực và mục tiêu của bạn</p>
            </div>

            {/* Path Selector */}
            <div className="flex space-x-4">
                <button
                    onClick={() => setSelectedPath('web-dev')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${selectedPath === 'web-dev'
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Web Development
                </button>
                <button
                    onClick={() => setSelectedPath('ai-ml')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${selectedPath === 'ai-ml'
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    AI & Machine Learning
                </button>
            </div>

            {/* Progress Overview */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{currentPath.name}</h2>
                    <span className="text-2xl font-bold text-primary">{currentPath.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${currentPath.progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Learning Modules */}
            <div className="space-y-4">
                {currentPath.modules.map((module, index) => (
                    <div key={module.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    {/* Status Icon */}
                                    <div className="flex-shrink-0 mt-1">
                                        {module.status === 'completed' && (
                                            <CheckCircleIcon className="h-8 w-8 text-green-500" />
                                        )}
                                        {module.status === 'in-progress' && (
                                            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        {module.status === 'locked' && (
                                            <LockClosedIcon className="h-8 w-8 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Module Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-gray-500">Module {index + 1}</span>
                                            {module.status === 'completed' && (
                                                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                                    Hoàn thành
                                                </span>
                                            )}
                                            {module.status === 'in-progress' && (
                                                <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                                    Đang học
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mt-1">{module.title}</h3>

                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                {module.duration}
                                            </div>
                                            {module.score && (
                                                <div className="flex items-center">
                                                    <span className="font-medium">Điểm: {module.score}/100</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Progress bar for in-progress modules */}
                                        {module.status === 'in-progress' && (
                                            <div className="mt-3">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${module.progress}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{module.progress}% hoàn thành</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="ml-4">
                                    {module.status === 'completed' && (
                                        <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-blue-50 transition">
                                            Ôn tập
                                        </button>
                                    )}
                                    {module.status === 'in-progress' && (
                                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">
                                            Tiếp tục
                                        </button>
                                    )}
                                    {module.status === 'locked' && (
                                        <button disabled className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed">
                                            Chưa mở khóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default LearningPath;
