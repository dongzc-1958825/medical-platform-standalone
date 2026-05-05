import React, { useState } from 'react';

const HealthQuestionnairePage: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    
    const questions = [
        {
            id: 1,
            question: "您是否有规律的作息时间？",
            options: ["是", "否", "有时"]
        },
        {
            id: 2,
            question: "您每周进行体育锻炼的频率？",
            options: ["从不", "1-2次", "3-5次", "每天"]
        },
        {
            id: 3,
            question: "您每天的蔬菜水果摄入量？",
            options: ["很少", "适量", "充足"]
        }
    ];

    const handleAnswer = (answer: string) => {
        console.log(`问题 ${currentQuestion + 1}: ${answer}`);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📝 健康问卷</h1>
                <p className="text-gray-600">完成问卷获取个性化健康建议</p>
            </header>

            <div className="bg-white rounded-xl shadow p-6">
                {/* 进度条 */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>进度</span>
                        <span>{currentQuestion + 1}/{questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* 当前问题 */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">{questions[currentQuestion].question}</h2>
                    <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 导航按钮 */}
                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className={`px-4 py-2 rounded-lg ${currentQuestion === 0 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700'}`}
                    >
                        上一题
                    </button>
                    
                    <div className="text-sm text-gray-500">
                        第 {currentQuestion + 1} 题 / 共 {questions.length} 题
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthQuestionnairePage;