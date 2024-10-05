import React, {useEffect, useState} from 'react';
import {Card, Typography} from 'antd';
import {HistoryOutlined} from '@ant-design/icons';
import './App.css';
import ProjectNameEditor from "./project-name-editor/ProjectNameEditor";
import useTimer from "./hooks/useTimer";
import TimerDisplay from "./timer-display/TimerDisplay";
import RecentTimersList from "./recent-timers-list/RecentTimersList";
import TimerControls from "./timer-controllers/TimerControls";

const { Title} = Typography;

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
