import React from "react";
import TextField from "@mui/material/TextField";
import { ErrorMessage } from "formik";
import TextError from "./TextError";

const Input = (props) => {
  const {
    label,
    formik,
    step = 1,
    value,
    id = "outlined-basic",
    touched = false,
    error,
    name,
    ...rest
  } = props;
  return (
    <>
      <div className="mb-3">
        <TextField
          direction="ltr"
          size="small"
          className="input-bg"
          fullWidth
          inputProps={{
            step: step,
          }}
          id={id}
          variant="outlined"
          label={label}
          name={name}
          value={value || ""}
          error={touched && Boolean(error)}
          onChange={(e) => formik.setFieldValue(name, e.target.value)}
          onBlur={() => formik.setFieldTouched(name, true)}
          {...rest}
        />
        <ErrorMessage name={name} component={TextError} />
      </div>
    </>
  );
};

export default Input;
