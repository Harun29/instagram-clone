import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ specialClass, nanoseconds, seconds }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const milliseconds = nanoseconds / 1e6 + seconds * 1000;
    const givenDate = new Date(milliseconds);

    // Calculate the time difference and format it
    const timeAgo = formatDistanceToNow(givenDate, { addSuffix: true });

    // Custom formatting for seconds, minutes, and days
    const match = timeAgo.match(/(\d+)\s+(\w+)/);
    if (match) {
      const value = match[1];
      const unit = match[2].charAt(0).toLowerCase();

      switch (unit) {
        case 's':
          setTimeAgo(`${value}s`);
          break;
        case 'm':
          setTimeAgo(`${value}m`);
          break;
        case 'h':
          setTimeAgo(`${value}h`);
          break;
        case 'd':
          setTimeAgo(`${value}d`);
          break;
        default:
          setTimeAgo(timeAgo);
      }
    } else {
      setTimeAgo(timeAgo);
    }
  }, [nanoseconds, seconds]);

  return <span className={`time-ago ${specialClass && specialClass}`}>{timeAgo}</span>;
};

export default TimeAgo;
