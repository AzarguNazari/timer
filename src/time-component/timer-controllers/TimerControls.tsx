import React from "react";
import {TimerDTO} from "../data/TimerDTO";
import {Button, Space} from "antd";
import {PlayCircleOutlined, StopOutlined} from "@ant-design/icons";

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

export default TimerControls;