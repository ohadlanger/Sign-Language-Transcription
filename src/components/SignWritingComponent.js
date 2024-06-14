import React from 'react';

const FswSign = ({ sign, describeSign }) => (
    <div className="fsw-sign" onClick={() => describeSign(sign)} title={sign.description}>
        {sign.fsw}
    </div>
);

const SignWritingComponent = ({ signs, describeSign }) => (
    <div id="signs">
        {signs.map((sign) => (
            <FswSign key={sign.id} sign={sign} describeSign={describeSign} />
        ))}
    </div>
);

export default SignWritingComponent;
