'use client';
import React, { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

let playerElement: any;

function getPlayerTime(element: any): number {
  const playerTime = element.getCurrentTime();
  console.log(playerTime);
  return playerTime;
}

interface NumberInputProps {
  time: number;
  labelText: string;
  setTime: (value: number) => void;
  setPlayerTime: (value: number) => void;
  getPlayerTime: (element: any) => number;
}

interface TimeInputProps {
  start: number;
  end: number;
  submit: (obj: object) => void;
}

const TimeController: React.FC<NumberInputProps> = ({ time, setTime, labelText, setPlayerTime, getPlayerTime }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      setTime(newValue);
    }
  };

  const setToCurrentTime = () => {
    const currentTime = getPlayerTime(playerElement);
    setTime(Math.round(currentTime * 100) / 100);
  }

  return (
    <div className='timecontroller'>
      <label htmlFor='startinput'>{labelText}:</label>
      <input
        id='startinput'
        type='number'
        value={time}
        onChange={handleChange}
      />
      <button onClick={(e) => setPlayerTime(time)}>Play from here</button>
      <button onClick={setToCurrentTime}>Set to current time</button>
    </div>
  )
}

const FinishButton: React.FC<TimeInputProps> = ({ start, end, submit }) => {
  const submitInfo = {
    start: start,
    end: end,
  }
  return (
    <>
      <button onClick={(e) => submit(submitInfo)}>Finish</button>
      <p>{start} - {end}</p>
    </>
  )
}

async function submitInfo(obj: object) {
  const response = await fetch("/api/v1/jorks", {
    method: "POST",
    body: JSON.stringify(obj),
  });
}

export default function YouTubeControls() {
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    playerElement = event.target;
    console.log(playerElement);
  }

  const setPlayerTime = (time: number) => {
    playerElement.seekTo(time);
    playerElement.playVideo();
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
    <>
      <YouTube
        videoId='WSeNSzJ2-Jw' // scary monsters and nice sprites
        opts={opts}
        onReady={onPlayerReady}
      />
      <TimeController
        time={startTime}
        setTime={setStartTime}
        labelText="Start time"
        setPlayerTime={setPlayerTime}
        getPlayerTime={getPlayerTime}
      />
      <TimeController
        time={endTime}
        setTime={setEndTime}
        labelText="End time"
        setPlayerTime={setPlayerTime}
        getPlayerTime={getPlayerTime}
      />
      <FinishButton
        start={startTime}
        end={endTime}
        submit={submitInfo}
      />
    </>
  )
}