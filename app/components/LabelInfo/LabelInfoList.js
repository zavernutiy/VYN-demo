import React from 'react';
import LabelInfo from './LabelInfoComponent';

const LabelInfoList = (props) => {
    return (
        <div>
            {props.list.map((item, index) => <LabelInfo key={index} label={item.label} info={item.info}/>)}
        </div>
    );
};

export default LabelInfoList;