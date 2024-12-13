import { useState, useEffect, useRef } from 'react';

const Pomodoro = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [currentSession, setCurrentSession] = useState("SESSION");
  const [isRunning, setIsRunning] = useState(false);
  const timeOutRef = useRef(null);  // Ref to store timeout ID for clearing when necessary

  useEffect(() => {
    if (isRunning) {
      timeOutRef.current = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          resetTimer();
        }
      }, 1000);
    } else {
      clearTimeout(timeOutRef.current); // Clear timeout if time is stopped
    }

    return () => clearTimeout(timeOutRef.current); // Clean up on unmount
  }, [timeLeft, isRunning]);

  const handleBreakIncrement = () => {
    if (breakLength < 60) setBreakLength(breakLength + 1);
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) setBreakLength(breakLength - 1);
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isRunning) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isRunning) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const handleReset = () => {
    clearTimeout(timeOutRef.current);
    setIsRunning(false);
    setTimeLeft(1500);
    setBreakLength(5);
    setSessionLength(25);
    setCurrentSession("SESSION");
    const audio = document.getElementById("beep");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handlePlay = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    const audio = document.getElementById("beep");
    if (currentSession === "SESSION") {
      setTimeLeft(breakLength * 60);
      setCurrentSession("BREAK");
      if (audio) audio.play();
    } else {
      setTimeLeft(sessionLength * 60);
      setCurrentSession("SESSION");
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  };

  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const title = currentSession === "SESSION" ? "Session" : "Break";

  return (
    <div>
      <div className="wrapper">
        <h2>25 + 5 Clock</h2>
        <div className="break-session-length">
          <div>
            <h3 id="break-label">Break Length</h3>
            <div>
              <button disabled={isRunning} onClick={handleBreakIncrement} id="break-increment">Increase</button>
              <strong id="break-length">{breakLength}</strong>
              <button disabled={isRunning} onClick={handleBreakDecrement} id="break-decrement">Decrease</button>
            </div>
          </div>
          <div>
            <h3 id="session-label">Session Length</h3>
            <div>
              <button disabled={isRunning} onClick={handleSessionIncrement} id="session-increment">Increase</button>
              <strong id="session-length">{sessionLength}</strong>
              <button disabled={isRunning} onClick={handleSessionDecrement} id="session-decrement">Decrease</button>
            </div>
          </div>
        </div>
        <div className="timer-wrapper">
          <div className="timer">
            <h2 id="timer-label">{title}</h2>
            <h3 id="time-left" style={{ color: timeLeft < 60 ? "red" : "black" }}>{timeFormatter()}</h3>
          </div>
          <button onClick={handlePlay} id="start_stop">Start / Stop</button>
          <button onClick={handleReset} id="reset">Reset</button>
        </div>
      </div>
      <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" />
    </div>
  );
};

export default Pomodoro;
