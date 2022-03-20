import React from 'react';

import './DateElement.css';

const DateElement = (props) => {
  const date = new Date(props.date);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.toLocaleString('en-US', { day: '2-digit' });
  const year = date.getFullYear();

  return (
    <div className='DateElement'>
      <div className='DateElement__month'>{month}</div>
      <div className='DateElement__year'>{year}</div>
      <div className='DateElement__day'>{day}</div>
    </div>
  );
};

export default DateElement;