import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Tag, Statistic, List, Input } from 'antd';
import { PlayCircleOutlined, StopOutlined, HistoryOutlined, EditOutlined } from '@ant-design/icons';
import './App.css';

const { Title, Text } = Typography;

interface TimerDTO {
  id: number;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  projectId: number;
  taskId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const useTimer = () => {
  const [currentTimer, setCurrentTimer] = useLocalStorage<TimerDTO | null>('currentTimer', null);
  const [recentTimers, setRecentTimers] = useLocalStorage<TimerDTO[]>('recentTimers', []);
  const [projectName, setProjectName] = useLocalStorage<string>('projectName', 'Work');

  const startTimer = ({ projectId, taskId, userId }: { projectId: number; taskId: number; userId: number }) => {
    const newTimer: TimerDTO = {
      id: Date.now(),
      startTime: new Date().toISOString(),
      endTime: null,
      duration: null,
      projectId,
      taskId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentTimer(newTimer);
  };

  const stopTimer = () => {
    if (currentTimer) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - new Date(currentTimer.startTime).getTime()) / 1000);
      const stoppedTimer: TimerDTO = {
        ...currentTimer,
        endTime: endTime.toISOString(),
        duration,
        updatedAt: endTime.toISOString(),
      };
      setCurrentTimer(null);
      setRecentTimers([stoppedTimer, ...recentTimers.slice(0, 9)]);
    }
  };

  return {
    currentTimer,
    recentTimers,
    startTimer,
    stopTimer,
    projectName,
    setProjectName,
  };
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TimerDisplay: React.FC<{ elapsedTime: number }> = ({ elapsedTime }) => (
    <Statistic value={formatTime(elapsedTime)} className="timer-display" />
);

const TimerControls: React.FC<{
  currentTimer: TimerDTO | null;
  onStart: () => void;
  onStop: () => void;
}> = ({ currentTimer, onStart, onStop }) => (
    <Space size="large" className="timer-controls">
      {!currentTimer ? (
          <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={onStart}
              size="large"
          >
            Start
          </Button>
      ) : (
          <Button
              icon={<StopOutlined />}
              onClick={onStop}
              size="large"
              danger
          >
            Stop
          </Button>
      )}
    </Space>
);

const RecentTimersList: React.FC<{ recentTimers: TimerDTO[] }> = ({ recentTimers }) => (
    <List
        dataSource={recentTimers}
        renderItem={(timer) => (
            <List.Item>
              <Text>Timer {formatTime(timer.duration || 0)}</Text>
              <Tag color="green">{new Date(timer.startTime).toLocaleString()}</Tag>
            </List.Item>
        )}
    />
);

const ProjectNameEditor: React.FC<{ projectName: string; setProjectName: (name: string) => void }> = ({ projectName, setProjectName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(projectName);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setProjectName(editValue);
    setIsEditing(false);
  };

  return (
      <Space>
        {isEditing ? (
            <>
              <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onPressEnter={handleSave}
                  style={{ width: 120 }}
              />
              <Button onClick={handleSave} size="small">
                Save
              </Button>
            </>
        ) : (
            <>
              <Tag color="blue">Project: {projectName}</Tag>
              <Button icon={<EditOutlined />} onClick={handleEdit} size="small" />
            </>
        )}
      </Space>
  );
};

const TimerComponent: React.FC = () => {
  const { currentTimer, recentTimers, startTimer, stopTimer, projectName, setProjectName } = useTimer();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentTimer) {
      interval = setInterval(() => {
        const startTime = new Date(currentTimer.startTime).getTime();
        const now = new Date().getTime();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [currentTimer]);

  const handleStart = () => {
    startTimer({ projectId: 1, taskId: 1, userId: 1 });
  };

  const handleStop = () => {
    stopTimer();
  };

  return (
      <div className="timer-container">
        <Card
            className="timer-card"
            title={<Title level={2}>Time Tracker</Title>}
            extra={<ProjectNameEditor projectName={projectName} setProjectName={setProjectName} />}
        >
          <TimerDisplay elapsedTime={elapsedTime} />
          <TimerControls
              currentTimer={currentTimer}
              onStart={handleStart}
              onStop={handleStop}
          />
        </Card>

        <Card
            className="history-card"
            title={<Title level={3}><HistoryOutlined /> Recent Timers</Title>}
        >
          <RecentTimersList recentTimers={recentTimers} />
        </Card>
      </div>
  );
};

export default TimerComponent;