import React from "react";

function TextError(props) {
  return <div className="error" style={{
    color: 'red',
    fontSize: '13px'
  }}>{props.children}</div>;
}

export default TextError;