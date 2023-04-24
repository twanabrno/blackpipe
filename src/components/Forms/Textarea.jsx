import React from "react";
import TextField from "@mui/material/TextField";
import { ErrorMessage } from "formik";
import TextError from "./TextError";
const Textarea = (props) => {
  const {
    label,
    formik,
    value = "",
    touched = false,
    error,
    name,
    ...rest
  } = props;
  return (
    <>
      <div className="mb-3">
        <TextField
          fullWidth
          inputProps={{
            step: 0.1,
          }}
          size="small"
          id="outlined-multiline-static"
          variant="outlined"
          style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          multiline
          minRows={4}
          maxRows={6}
          label={label}
          name={name}
          value={value || ""}
          error={touched && Boolean(error)}
          onChange={(value) => formik.setFieldValue(name, value.target.value)}
          onBlur={() => formik.setFieldTouched(name, true)}
          {...rest}
        />
        <ErrorMessage name={name} component={TextError} />
      </div>
    </>
  );
};

export default Textarea;
