import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

const TimerComponent: React.FC = () => {
  const [currentTimer, setCurrentTimer] = useLocalStorage<any | null>('currentTimer', null);
  const [recentTimers, setRecentTimers] = useLocalStorage<any[]>('recentTimers', []);
  const [projectName, setProjectName] = useLocalStorage<string>('projectName', 'Work');
  const [elapsedTime, setElapsedTime] = React.useState(0);

  const startTimer = () => {
    setCurrentTimer({ startTime: new Date().toISOString() });
  };

  const stopTimer = () => {
    if (currentTimer) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - new Date(currentTimer.startTime).getTime()) / 1000);
      setRecentTimers([{ ...currentTimer, endTime: endTime.toISOString(), duration }, ...recentTimers.slice(0, 9)]);
      setCurrentTimer(null);
    }
  };

  React.useEffect(() => {
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

  return (
      <div>
        <h2>Time Tracker</h2>
        <div>Project: {projectName} <button onClick={() => setProjectName('New Project')}>Edit</button></div>
        <div>{currentTimer ? 'Running' : 'Stopped'} - {elapsedTime} seconds</div>
        <button onClick={currentTimer ? stopTimer : startTimer}>
          {currentTimer ? 'Stop' : 'Start'}
        </button>
        <div>
          <h3>Recent Timers</h3>
          {recentTimers.map((timer, index) => (
              <div key={index}>Timer {timer.duration} seconds</div>
          ))}
        </div>
      </div>
  );
};

describe('TimerComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders without crashing', () => {
    render(<TimerComponent />);
    expect(screen.getByText('Time Tracker')).toBeInTheDocument();
  });

  test('displays initial project name', () => {
    render(<TimerComponent />);
    expect(screen.getByText('Project: Work')).toBeInTheDocument();
  });

  test('allows editing project name', () => {
    render(<TimerComponent />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Project: New Project')).toBeInTheDocument();
  });

  test('starts and stops timer', () => {
    render(<TimerComponent />);
    fireEvent.click(screen.getByText('Start'));
    expect(screen.getByText('Running - 0 seconds')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Running - 5 seconds')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Stop'));
    expect(screen.getByText('Stopped - 0 seconds')).toBeInTheDocument();
  });

  test('displays recent timers', () => {
    const mockTimers = [
      { startTime: '2023-05-15T10:00:00Z', endTime: '2023-05-15T10:02:00Z', duration: 120 },
      { startTime: '2023-05-15T11:00:00Z', endTime: '2023-05-15T11:01:30Z', duration: 90 },
    ];
    window.localStorage.setItem('recentTimers', JSON.stringify(mockTimers));

    render(<TimerComponent />);
    expect(screen.getByText('Timer 120 seconds')).toBeInTheDocument();
    expect(screen.getByText('Timer 90 seconds')).toBeInTheDocument();
  });
});

describe('useLocalStorage', () => {
  test('should use initial value when localStorage is empty', () => {
    const TestComponent = () => {
      const [value] = useLocalStorage('emptyKey', 'defaultValue');
      return <div>{value}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('defaultValue')).toBeInTheDocument();
  });

  test('should use value from localStorage when available', () => {
    localStorage.setItem('existingKey', JSON.stringify('storedValue'));

    const TestComponent = () => {
      const [value] = useLocalStorage('existingKey', 'defaultValue');
      return <div>{value}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByText('storedValue')).toBeInTheDocument();
  });

  test('should update localStorage when value changes', () => {
    const TestComponent = () => {
      const [value, setValue] = useLocalStorage('updateKey', 'initialValue');
      return (
          <div>
            <span>{value}</span>
            <button onClick={() => setValue('updatedValue')}>Update</button>
          </div>
      );
    };

    render(<TestComponent />);
    fireEvent.click(screen.getByText('Update'));
    expect(JSON.parse(localStorage.getItem('updateKey') || '')).toBe('updatedValue');
  });
});