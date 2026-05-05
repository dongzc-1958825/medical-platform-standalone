import React, { useState, useEffect } from 'react';

interface Device {
    id: string;
    name: string;
    type: 'watch' | 'band' | 'scale' | 'bp-monitor' | 'glucometer';
    connected: boolean;
    lastSync: string;
    batteryLevel: number;
    data: {
        steps?: number;
        heartRate?: number;
        sleepHours?: number;
        weight?: number;
        bloodPressure?: string;
        bloodGlucose?: number;
    };
}

const WearableDevicesPage: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([
        {
            id: '1',
            name: '小米手环7',
            type: 'band',
            connected: true,
            lastSync: '2024-01-12 08:30',
            batteryLevel: 85,
            data: {
                steps: 12543,
                heartRate: 72,
                sleepHours: 7.5
            }
        },
        {
            id: '2',
            name: '华为手表GT3',
            type: 'watch',
            connected: true,
            lastSync: '2024-01-12 08:15',
            batteryLevel: 65,
            data: {
                steps: 8921,
                heartRate: 68,
                sleepHours: 6.8
            }
        },
        {
            id: '3',
            name: '欧姆龙血压计',
            type: 'bp-monitor',
            connected: false,
            lastSync: '2024-01-10 14:20',
            batteryLevel: 40,
            data: {
                bloodPressure: '128/85'
            }
        },
        {
            id: '4',
            name: '云康宝体脂秤',
            type: 'scale',
            connected: false,
            lastSync: '2024-01-11 09:15',
            batteryLevel: 90,
            data: {
                weight: 68.5
            }
        }
    ]);

    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

    const handleConnectDevice = (deviceId: string) => {
        setDevices(prev => prev.map(device => 
            device.id === deviceId 
                ? { ...device, connected: !device.connected, lastSync: new Date().toISOString().slice(0, 16).replace('T', ' ') }
                : device
        ));
    };

    const handleSyncAll = () => {
        setSyncStatus('syncing');
        setTimeout(() => {
            setDevices(prev => prev.map(device => 
                device.connected 
                    ? { 
                        ...device, 
                        lastSync: new Date().toISOString().slice(0, 16).replace('T', ' '),
                        batteryLevel: Math.max(10, device.batteryLevel - 5),
                        data: {
                            ...device.data,
                            steps: device.data.steps ? device.data.steps + Math.floor(Math.random() * 1000) : undefined,
                            heartRate: device.data.heartRate ? device.data.heartRate + Math.floor(Math.random() * 10) - 5 : undefined
                        }
                    }
                    : device
            ));
            setSyncStatus('success');
            
            setTimeout(() => setSyncStatus('idle'), 2000);
        }, 1500);
    };

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'watch': return '⌚️';
            case 'band': return '📿';
            case 'scale': return '⚖️';
            case 'bp-monitor': return '🩺';
            case 'glucometer': return '🩸';
            default: return '📱';
        }
    };

    const getDeviceColor = (type: string) => {
        switch (type) {
            case 'watch': return 'bg-blue-100 text-blue-600';
            case 'band': return 'bg-green-100 text-green-600';
            case 'scale': return 'bg-purple-100 text-purple-600';
            case 'bp-monitor': return 'bg-red-100 text-red-600';
            case 'glucometer': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const connectedDevices = devices.filter(d => d.connected);
    const disconnectedDevices = devices.filter(d => !d.connected);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">⌚️ 穿戴设备</h1>
                <p className="text-gray-600">连接和管理您的健康监测设备</p>
            </header>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">已连接</p>
                    <p className="text-2xl font-bold text-green-600">{connectedDevices.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">设备总数</p>
                    <p className="text-2xl font-bold text-blue-600">{devices.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">今日同步</p>
                    <p className="text-2xl font-bold text-purple-600">{devices.filter(d => d.lastSync.includes('2024-01-12')).length}</p>
                </div>
            </div>

            {/* 同步按钮 */}
            <div className="mb-6">
                <button
                    onClick={handleSyncAll}
                    disabled={syncStatus === 'syncing'}
                    className={`w-full font-medium py-3 px-4 rounded-lg transition flex items-center justify-center ${
                        syncStatus === 'syncing' 
                            ? 'bg-gray-300 text-gray-500' 
                            : syncStatus === 'success'
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {syncStatus === 'syncing' ? (
                        <>
                            <span className="animate-spin mr-2">⟳</span>
                            同步中...
                        </>
                    ) : syncStatus === 'success' ? (
                        <>
                            <span className="mr-2">✅</span>
                            同步成功！
                        </>
                    ) : (
                        <>
                            <span className="mr-2">🔄</span>
                            同步所有设备
                        </>
                    )}
                </button>
            </div>

            {/* 已连接设备 */}
            {connectedDevices.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">已连接设备</h2>
                    <div className="space-y-4">
                        {connectedDevices.map((device) => (
                            <div key={device.id} className="bg-white rounded-xl shadow p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 rounded-full ${getDeviceColor(device.type)} flex items-center justify-center mr-3`}>
                                            <span className="text-xl">{getDeviceIcon(device.type)}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{device.name}</h3>
                                            <p className="text-sm text-gray-500">最后同步: {device.lastSync}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleConnectDevice(device.id)}
                                        className="bg-red-100 hover:bg-red-200 text-red-600 font-medium py-2 px-4 rounded-lg transition"
                                    >
                                        断开
                                    </button>
                                </div>
                                
                                {/* 设备数据 */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">电量</p>
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                <div 
                                                    className={`h-2 rounded-full ${
                                                        device.batteryLevel > 50 ? 'bg-green-500' :
                                                        device.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${device.batteryLevel}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">{device.batteryLevel}%</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">今日步数</p>
                                        <p className="text-lg font-bold text-green-600">{device.data.steps?.toLocaleString() || '--'}</p>
                                    </div>
                                    
                                    {device.data.heartRate && (
                                        <div className="bg-red-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">心率</p>
                                            <p className="text-lg font-bold text-red-600">{device.data.heartRate} bpm</p>
                                        </div>
                                    )}
                                    
                                    {device.data.sleepHours && (
                                        <div className="bg-purple-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">睡眠</p>
                                            <p className="text-lg font-bold text-purple-600">{device.data.sleepHours}h</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 未连接设备 */}
            {disconnectedDevices.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">可用设备</h2>
                    <div className="space-y-4">
                        {disconnectedDevices.map((device) => (
                            <div key={device.id} className="bg-white rounded-xl shadow p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 rounded-full ${getDeviceColor(device.type)} flex items-center justify-center mr-3 opacity-50`}>
                                            <span className="text-xl">{getDeviceIcon(device.type)}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{device.name}</h3>
                                            <p className="text-sm text-gray-500">最后同步: {device.lastSync}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleConnectDevice(device.id)}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium py-2 px-4 rounded-lg transition"
                                    >
                                        连接
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 添加新设备 */}
            <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-semibold text-gray-800 mb-3">添加新设备</h3>
                <div className="space-y-3">
                    <button className="w-full border border-dashed border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 font-medium py-3 px-4 rounded-lg transition flex items-center justify-center">
                        <span className="mr-2">+</span>
                        扫描附近设备
                    </button>
                    
                    <div className="text-center">
                        <p className="text-sm text-gray-500">支持设备类型:</p>
                        <div className="flex justify-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600">智能手表</span>
                            <span className="text-sm text-gray-600">手环</span>
                            <span className="text-sm text-gray-600">体脂秤</span>
                            <span className="text-sm text-gray-600">血压计</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WearableDevicesPage;