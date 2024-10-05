import React from "react";
import {List, Tag, Typography} from "antd";
import {TimerDTO} from "../data/TimerDTO";
import formatTime from "../hooks/formatTime";
const { Text } = Typography;

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

export default RecentTimersList;