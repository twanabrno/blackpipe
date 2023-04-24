import React from "react";
import { ErrorMessage } from "formik";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextError from "./TextError";

const SelectInput = (props) => {
  const {
    label,
    name,
    value,
    touched = false,
    error,
    formik,
    options,
    ...rest
  } = props;
  return (
    <div className="mb-3">
      <FormControl fullWidth>
        <InputLabel id="demo-select-small">{label}</InputLabel>
        <Select
          size="small"
          style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          labelId="demo-select-small"
          id="demo-select-small"
          className="input-bg"
          value={value || ""}
          label={label}
          error={touched && Boolean(error)}
          onChange={(e) => formik.setFieldValue(name, e.target.value)}
          onBlur={() => formik.setFieldTouched(name, true)}
          {...rest}
        >
          {options.map((option) => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default SelectInput;
