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
  setPlayerTime: (value: number) => void;
  getPlayerTime: (element: any) => number;
}

const TimeController: React.FC<NumberInputProps> = ({ setPlayerTime, getPlayerTime }) => {
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      setStartTime(newValue);
    }
  };

  const setToCurrentTime = () => {
    const currentTime = getPlayerTime(playerElement);
    setStartTime(Math.round(currentTime * 100) / 100);
  }

  return (
    <>
      <label htmlFor='startinput'>Start time:</label>
      <input
        id='startinput'
        type='number'
        value={startTime}
        onChange={handleChange}
      />
      <button onClick={(e) => setPlayerTime(startTime)}>Play from here</button>
      <button onClick={setToCurrentTime}>Set to current time</button>
    </>
  )
}

export default function YouTubeControls() {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    playerElement = event.target;
    console.log(playerElement);
    // event.target.pauseVideo();
    setInterval(() => {
      getPlayerTime(playerElement);
    }, 1000);
  }

  const setPlayerTime = (time: number) => {
    playerElement.seekTo(time);
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
        setPlayerTime={setPlayerTime}
        getPlayerTime={getPlayerTime}
      />
    </>
  )
}