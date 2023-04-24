import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";

const FileInput = (props) => {
  const {
    label,
    formik,
    value,
    touched,
    error,
    name,
    accept,
    ...rest
  } = props;
  return (
    <div className="mb-3 pt-2">
      <label htmlFor={name} className="form-label">
        Upload Image:
      </label>
      <Field
        className="form-control"
        type="file"
        accept="image/*"
        value={undefined}
        onChange={(e) => formik.setFieldValue(name, e.currentTarget.files[0])}
        {...rest}
      />
      <ErrorMessage name={name} component={TextError} /> 
    </div>
  );
};

export default FileInput;
