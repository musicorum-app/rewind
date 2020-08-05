import React, {MouseEventHandler} from 'react';
import PropTypes from 'prop-types';

const SplittedWordText: React.FC<{
  text: string,
  nodesClass: string,
}> = ({ text, nodesClass }) => {
  return (
    <>
      {
        text.split('').map((l, i) => <span className={nodesClass} key={i}>
          {l}
        </span>)
      }
    </>
  );
};

export default SplittedWordText;
