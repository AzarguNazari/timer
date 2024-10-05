import useLocalStorage from "./useStorage";
import {TimerDTO} from "../data/TimerDTO";

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

export default useTimer;
