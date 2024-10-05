import React from "react";
import {Statistic} from "antd";
import formatTime from "../hooks/formatTime";

const TimerDisplay: React.FC<{ elapsedTime: number }> = ({ elapsedTime }) => (
    <Statistic value={formatTime(elapsedTime)} className="timer-display" />
);

export default TimerDisplay;